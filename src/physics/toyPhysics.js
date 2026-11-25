// ─────────────────────────────────────────────
// ARCADE TOY PHYSICS
// A small custom solver (no extra physics dependency):
// the car is a steering circle, props are dynamic circles,
// and the existing STATIC_COLLIDERS stay solid.
// ─────────────────────────────────────────────

import { STATIC_COLLIDERS, WORLD_BOUNDS, generateVegetationAndRocks } from '../data/worldConfig';
import {
  LAKE,
  NATURE_SEED,
  TERRAIN_FEATURES,
  VEHICLE,
} from '../config/toyWorld';

const natureCache = new Map();

export function natureColliders(treeCount) {
  if (!natureCache.has(treeCount)) {
    natureCache.set(treeCount, generateVegetationAndRocks(treeCount, NATURE_SEED).dynamicColliders);
  }
  return natureCache.get(treeCount);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function intoLocal(x, z, feature) {
  const dx = x - feature.x;
  const dz = z - feature.z;
  const yaw = feature.yaw || 0;
  const cos = Math.cos(-yaw);
  const sin = Math.sin(-yaw);
  return {
    lx: dx * cos - dz * sin,
    lz: dx * sin + dz * cos,
  };
}

/** Height of the driveable surface at x,z. Walls do not raise the ground. */
export function sampleHeight(x, z) {
  let h = 0;
  for (const feature of TERRAIN_FEATURES) {
    const { lx, lz } = intoLocal(x, z, feature);
    if (feature.kind === 'ramp') {
      if (Math.abs(lx) <= feature.hw && lz >= -feature.hd && lz <= feature.hd) {
        const t = (lz + feature.hd) / (feature.hd * 2);
        h = Math.max(h, t * feature.height);
      }
    } else if (feature.kind === 'deck') {
      if (Math.abs(lx) <= feature.hw && Math.abs(lz) <= feature.hd) {
        h = Math.max(h, feature.height);
      }
    }
  }
  return h;
}

export function sampleJumpPad(x, z) {
  for (const feature of TERRAIN_FEATURES) {
    if (feature.kind !== 'pad') continue;
    if (Math.hypot(x - feature.x, z - feature.z) <= feature.r) return feature;
  }
  return null;
}

function pushCircle(x, z, radius, collider) {
  if (collider.type === 'circle') {
    const dx = x - collider.x;
    const dz = z - collider.z;
    const dist = Math.hypot(dx, dz) || 0.0001;
    const min = radius + collider.r;
    if (dist >= min) return null;
    const nx = dx / dist;
    const nz = dz / dist;
    return { x: collider.x + nx * min, z: collider.z + nz * min, nx, nz };
  }

  const minX = collider.x - collider.hw;
  const maxX = collider.x + collider.hw;
  const minZ = collider.z - collider.hd;
  const maxZ = collider.z + collider.hd;
  const cx = clamp(x, minX, maxX);
  const cz = clamp(z, minZ, maxZ);
  let dx = x - cx;
  let dz = z - cz;
  let dist = Math.hypot(dx, dz);

  if (dist >= radius && !(x > minX && x < maxX && z > minZ && z < maxZ)) return null;

  if (dist < 1e-4) {
    const left = x - minX;
    const right = maxX - x;
    const down = z - minZ;
    const up = maxZ - z;
    const minSide = Math.min(left, right, down, up);
    if (minSide === left) return { x: minX - radius, z, nx: -1, nz: 0 };
    if (minSide === right) return { x: maxX + radius, z, nx: 1, nz: 0 };
    if (minSide === down) return { x, z: minZ - radius, nx: 0, nz: -1 };
    return { x, z: maxZ + radius, nx: 0, nz: 1 };
  }

  const nx = dx / dist;
  const nz = dz / dist;
  return { x: cx + nx * radius, z: cz + nz * radius, nx, nz };
}

function terrainWalls() {
  return TERRAIN_FEATURES.filter((feature) => feature.kind === 'wall').map((feature) => ({
    type: 'box',
    x: feature.x,
    z: feature.z,
    hw: feature.hw,
    hd: feature.hd,
  }));
}

export function staticColliders(treeCount) {
  return [...STATIC_COLLIDERS, ...terrainWalls(), ...natureColliders(treeCount)];
}

function resolveStatics(x, z, radius, colliders) {
  let hit = null;
  const bound = WORLD_BOUNDS.radius - 3;
  if (Math.hypot(x, z) > bound) {
    const dist = Math.hypot(x, z) || 0.0001;
    x = (x / dist) * bound;
    z = (z / dist) * bound;
    hit = { nx: x / bound, nz: z / bound };
  }
  for (let pass = 0; pass < 2; pass += 1) {
    for (const collider of colliders) {
      const pushed = pushCircle(x, z, radius, collider);
      if (pushed) {
        x = pushed.x;
        z = pushed.z;
        hit = pushed;
      }
    }
  }
  return { x, z, hit };
}

function killIntoNormal(vx, vz, hit) {
  if (!hit) return { vx, vz };
  const into = vx * hit.nx + vz * hit.nz;
  if (into >= 0) return { vx, vz };
  return { vx: vx - into * hit.nx, vz: vz - into * hit.nz };
}

export function createCar(spawn = VEHICLE.spawn) {
  return {
    x: spawn[0],
    y: 0,
    z: spawn[2],
    vx: 0,
    vy: 0,
    vz: 0,
    heading: 0,
    speed: 0,
    steer: 0,
    wheelSpin: 0,
    airborne: false,
    airRoll: 0,
    groundedFor: 0,
    flipLatched: false,
  };
}

export function createProp(def) {
  return {
    ...def,
    y: def.y || 0,
    vx: 0,
    vy: 0,
    vz: 0,
    ry: def.ry || 0,
    ang: 0,
    knocked: false,
    active: true,
  };
}

/**
 * Advance the car by dt seconds.
 * input: { throttle, steer, boost, brake, jump }
 * callbacks: { onJump, onLand, onFlip }
 */
export function stepCar(car, input, dt, colliders, callbacks = {}) {
  const throttle = clamp(input.throttle || 0, -1, 1);
  const steer = clamp(input.steer || 0, -1, 1);
  const boosting = Boolean(input.boost) && throttle > 0.2 && !input.brake;
  const lakeSlow = Math.hypot(car.x - LAKE.x, car.z - LAKE.z) < LAKE.radius ? LAKE.speedScale : 1;

  const accel = (boosting ? VEHICLE.boostAccel : VEHICLE.accel) * lakeSlow;
  const maxSpeed = (boosting ? VEHICLE.boostSpeed : VEHICLE.maxSpeed) * lakeSlow;

  if (Math.abs(throttle) > 0.05) {
    car.speed += throttle * accel * dt;
  } else {
    car.speed *= Math.pow(VEHICLE.coastDrag, dt * 60);
  }
  if (input.brake) car.speed *= Math.pow(VEHICLE.brakeDrag, dt * 60);
  car.speed = clamp(car.speed, -VEHICLE.reverseSpeed, maxSpeed);
  if (Math.abs(car.speed) < 0.08 && Math.abs(throttle) < 0.05) car.speed = 0;

  const speedFactor = clamp(Math.abs(car.speed) / VEHICLE.maxSpeed, 0, 1.2);
  car.heading += steer * VEHICLE.turnRate * speedFactor * Math.sign(car.speed || throttle || 1) * dt;
  car.steer += (steer - car.steer) * Math.min(1, dt * 8);

  const fx = Math.sin(car.heading);
  const fz = -Math.cos(car.heading);
  const desiredVx = fx * car.speed;
  const desiredVz = fz * car.speed;
  const grip = 1 - Math.exp(-VEHICLE.grip * dt);
  car.vx += (desiredVx - car.vx) * grip;
  car.vz += (desiredVz - car.vz) * grip;

  const nextX = car.x + car.vx * dt;
  const nextZ = car.z + car.vz * dt;
  const nextH = sampleHeight(nextX, nextZ);
  const climb = nextH - car.y;

  if (!car.airborne && climb > VEHICLE.maxClimb) {
    const blocked = resolveStatics(car.x, car.z, VEHICLE.radius, [{
      type: 'circle',
      x: nextX,
      z: nextZ,
      r: 0.4,
    }]);
    car.x = blocked.x;
    car.z = blocked.z;
    car.speed *= 0.4;
  } else {
    const resolved = resolveStatics(nextX, nextZ, VEHICLE.radius, colliders);
    car.x = resolved.x;
    car.z = resolved.z;
    if (resolved.hit) {
      const killed = killIntoNormal(car.vx, car.vz, resolved.hit);
      car.vx = killed.vx;
      car.vz = killed.vz;
      car.speed *= 0.92;
    }
  }

  const ground = sampleHeight(car.x, car.z);
  if (car.y <= ground + 0.05 && car.vy <= 0.2) {
    const impact = car.airborne ? -car.vy : 0;
    car.y = ground;
    car.vy = 0;
    car.airborne = false;
    car.groundedFor += dt;
    if (impact > 3) callbacks.onLand?.(impact);
    if (input.jump && car.groundedFor > 0.08) {
      car.vy = VEHICLE.jumpVelocity;
      car.airborne = true;
      car.groundedFor = 0;
      callbacks.onJump?.();
    } else if (car.groundedFor > 0.05) {
      const pad = sampleJumpPad(car.x, car.z);
      if (pad && Math.abs(car.speed) > 2) {
        car.vy = pad.power;
        car.airborne = true;
        car.groundedFor = 0;
        callbacks.onJump?.();
      }
    }
    car.airRoll *= 1 - Math.min(1, dt * 3);
    car.flipLatched = false;
  } else {
    car.vy -= VEHICLE.gravity * dt;
    car.y += car.vy * dt;
    car.airborne = true;
    car.groundedFor = 0;
    car.airRoll += steer * (4 + Math.abs(car.speed) * 0.15) * dt;
    if (!car.flipLatched && Math.abs(car.airRoll) > 2.6) {
      car.flipLatched = true;
      callbacks.onFlip?.();
    }
    if (car.y < ground) {
      callbacks.onLand?.(-car.vy);
      car.y = ground;
      car.vy = 0;
      car.airborne = false;
    }
  }

  car.wheelSpin += car.speed * dt * 1.6;
  return { boosting, drifting: Math.abs(steer) > 0.45 && Math.abs(car.speed) > 8 && !car.airborne };
}

function separatePair(a, b) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const dist = Math.hypot(dx, dz) || 0.0001;
  const ra = a.r || Math.max(a.hw || 0.4, a.hd || 0.4);
  const rb = b.r || Math.max(b.hw || 0.4, b.hd || 0.4);
  const min = ra + rb;
  if (dist >= min) return false;
  const nx = dx / dist;
  const nz = dz / dist;
  const overlap = min - dist;
  const ma = a.mass || 1;
  const mb = b.mass || 1;
  const total = ma + mb;
  if (a.pinned) {
    b.x += nx * overlap;
    b.z += nz * overlap;
  } else if (b.pinned) {
    a.x -= nx * overlap;
    a.z -= nz * overlap;
  } else {
    a.x -= nx * overlap * (mb / total);
    a.z -= nz * overlap * (mb / total);
    b.x += nx * overlap * (ma / total);
    b.z += nz * overlap * (ma / total);
  }
  const rel = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
  if (rel < 0) {
    const impulse = -(1.15) * rel / (1 / ma + 1 / mb);
    if (!a.pinned) {
      a.vx -= (impulse / ma) * nx;
      a.vz -= (impulse / ma) * nz;
    }
    if (!b.pinned) {
      b.vx += (impulse / mb) * nx;
      b.vz += (impulse / mb) * nz;
      b.ang += impulse * 0.4;
    }
  }
  return true;
}

export function stepProps(props, car, dt, colliders, onBump) {
  const carBody = {
    x: car.x,
    z: car.z,
    vx: car.vx,
    vz: car.vz,
    r: VEHICLE.radius,
    mass: 4.5,
    pinned: true,
  };

  for (const prop of props) {
    if (!prop.active) continue;
    prop.vy -= VEHICLE.gravity * dt;
    prop.x += prop.vx * dt;
    prop.z += prop.vz * dt;
    prop.y += prop.vy * dt;
    prop.ry += prop.ang * dt;
    prop.ang *= 1 - Math.min(1, dt * 1.5);

    const ground = sampleHeight(prop.x, prop.z);
    if (prop.y <= ground) {
      if (prop.vy < -1.4) onBump?.();
      prop.y = ground;
      prop.vy = Math.abs(prop.vy) > 1.2 ? -prop.vy * 0.35 : 0;
      prop.vx *= 0.9;
      prop.vz *= 0.9;
    }

    const resolved = resolveStatics(prop.x, prop.z, prop.r || prop.hw || 0.4, colliders);
    if (resolved.hit) {
      const killed = killIntoNormal(prop.vx, prop.vz, resolved.hit);
      prop.x = resolved.x;
      prop.z = resolved.z;
      prop.vx = killed.vx * 0.8;
      prop.vz = killed.vz * 0.8;
    }

    if (separatePair(carBody, prop)) {
      onBump?.();
      if (prop.kind === 'pin') {
        const slide = Math.hypot(prop.vx, prop.vz);
        if (slide > 1.4) prop.knocked = true;
      }
    }
  }

  for (let i = 0; i < props.length; i += 1) {
    if (!props[i].active) continue;
    for (let j = i + 1; j < props.length; j += 1) {
      if (!props[j].active) continue;
      if (separatePair(props[i], props[j]) && props[i].kind === 'pin') {
        if (Math.hypot(props[i].vx, props[i].vz) > 1.2) props[i].knocked = true;
      }
    }
  }
}

export function nearestCheckpoint(x, z, checkpoints) {
  let best = checkpoints[0];
  let bestDist = Infinity;
  for (const checkpoint of checkpoints) {
    const dist = Math.hypot(x - checkpoint.position[0], z - checkpoint.position[2]);
    if (dist < bestDist) {
      best = checkpoint;
      bestDist = dist;
    }
  }
  return best;
}
