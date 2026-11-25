// ─────────────────────────────────────────────
// DRIVEABLE TOY CAR
// Third-person camera, gamepad, and the arcade car from toyPhysics.
// The walking player stays mounted only in Walk mode.
// ─────────────────────────────────────────────

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { soundManager } from '../../utils/soundManager';
import { WORLD_LOCATIONS, existingProjects } from '../../data/gameData';
import { WORLD_NPCS } from '../../data/worldConfig';
import {
  CAMERA,
  CAR_COLORS,
  CHECKPOINTS,
  CIRCUIT_GATES,
  PORTFOLIO_ZONES,
  PROJECT_PAD_LAYOUT,
  QUALITY_PRESETS,
  SECRETS,
  VEHICLE,
  WHISPER_SIGN,
} from '../../config/toyWorld';
import { createCar, nearestCheckpoint, staticColliders, stepCar } from '../../physics/toyPhysics';
import { attachDriveKeyboard, bindDriveActions, pollGamepad, readDriveInput } from '../../input/driveInput';

const WHEELS = [
  { x: -0.72, z: 0.78, steer: true },
  { x: 0.72, z: 0.78, steer: true },
  { x: -0.72, z: -0.82, steer: false },
  { x: 0.72, z: -0.82, steer: false },
];

function projectPads() {
  return existingProjects.map((project, index) => {
    const layout = PROJECT_PAD_LAYOUT[index] || [55 + index * 4, 0, -30];
    return { project, position: layout };
  });
}

export function Vehicle() {
  const root = useRef();
  const chassis = useRef();
  const wheelRefs = useRef([]);
  const trailRefs = useRef([]);
  const dustRefs = useRef([]);
  const car = useRef(null);
  const angles = useRef({ theta: 0.2, phi: CAMERA.phi, distance: CAMERA.distance });
  const seenRespawn = useRef(0);
  const latch = useRef({ honk: false, interact: false, gates: new Set(), secrets: new Set() });
  const posSync = useRef(0);
  const { camera, gl } = useThree();

  const carColorId = useGameStore((state) => state.carColorId);
  const trailId = useGameStore((state) => state.trailId);
  const paint = CAR_COLORS.find((entry) => entry.id === carColorId) || CAR_COLORS[0];
  const pads = useMemo(() => projectPads(), []);

  if (!car.current) {
    const saved = useGameStore.getState().playerPos;
    const origin = Math.hypot(saved[0], saved[2]) < 0.4 ? VEHICLE.spawn : [saved[0], 0, saved[2]];
    car.current = createCar(origin);
  }

  useEffect(() => {
    bindDriveActions({
      onHonk: () => useGameStore.getState().registerHonk(),
      onInteract: () => useGameStore.getState().triggerInteract(),
      onMap: () => useGameStore.getState().togglePanel('map'),
      onMute: () => useGameStore.getState().toggleAudio(),
      onRespawn: () => useGameStore.getState().requestRespawn(),
      onMenu: () => {
        const state = useGameStore.getState();
        if (state.activeModal) state.closeModal();
        else if (state.activePanel) state.closePanel();
        else state.openPanel('options');
      },
      onKonami: () => useGameStore.getState().triggerKonami(),
    });
    return attachDriveKeyboard();
  }, []);

  useEffect(() => {
    const dom = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pinch = 0;

    const down = (event) => {
      if (event.target !== dom) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const move = (event) => {
      if (!dragging) return;
      angles.current.theta -= (event.clientX - lastX) * CAMERA.orbitSpeed;
      angles.current.phi = THREE.MathUtils.clamp(
        angles.current.phi + (event.clientY - lastY) * CAMERA.orbitSpeed,
        CAMERA.minPhi,
        CAMERA.maxPhi,
      );
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = () => { dragging = false; };
    const wheel = (event) => {
      angles.current.distance = THREE.MathUtils.clamp(
        angles.current.distance + event.deltaY * CAMERA.zoomStep,
        CAMERA.minDistance,
        CAMERA.maxDistance,
      );
    };
    const touchStart = (event) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        pinch = Math.hypot(dx, dy);
      }
    };
    const touchMove = (event) => {
      if (event.touches.length !== 2 || !pinch) return;
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const next = Math.hypot(dx, dy);
      angles.current.distance = THREE.MathUtils.clamp(
        angles.current.distance - (next - pinch) * 0.03,
        CAMERA.minDistance,
        CAMERA.maxDistance,
      );
      pinch = next;
    };

    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    dom.addEventListener('wheel', wheel, { passive: true });
    dom.addEventListener('touchstart', touchStart, { passive: true });
    dom.addEventListener('touchmove', touchMove, { passive: true });
    return () => {
      dom.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      dom.removeEventListener('wheel', wheel);
      dom.removeEventListener('touchstart', touchStart);
      dom.removeEventListener('touchmove', touchMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const state = useGameStore.getState();
    const body = car.current;

    if (state.respawnNonce !== seenRespawn.current) {
      seenRespawn.current = state.respawnNonce;
      const spot = state.teleportTo
        ? { position: state.teleportTo }
        : nearestCheckpoint(body.x, body.z, CHECKPOINTS);
      body.x = spot.position[0];
      body.y = 0.2;
      body.z = spot.position[2];
      body.vx = 0;
      body.vz = 0;
      body.vy = 0;
      body.speed = 0;
      body.airborne = false;
    }

    const playing = state.gameMode === 'playing' && !state.isPaused && !state.activeModal;
    let boosting = false;
    let drifting = false;
    if (playing) {
      pollGamepad(latch.current);
      const input = readDriveInput();
      const treeCount = QUALITY_PRESETS[state.graphicsQuality]?.treeCount || 140;
      const result = stepCar(body, input, dt, staticColliders(treeCount), {
        onJump: () => soundManager.playJump(),
        onLand: () => soundManager.playLand(),
        onFlip: () => state.registerFlip(),
      });
      boosting = result.boosting;
      drifting = result.drifting;
      soundManager.setEngine(body.speed, boosting);
    } else {
      soundManager.setEngine(0, false);
    }

    if (root.current) {
      root.current.position.set(body.x, body.y, body.z);
      root.current.rotation.y = body.heading;
    }
    if (chassis.current) {
      const rest = VEHICLE.bodyRest + (body.airborne ? 0.05 : 0);
      chassis.current.position.y = THREE.MathUtils.damp(chassis.current.position.y, rest, VEHICLE.suspension, dt);
      const reduce = state.reduceMotion;
      const roll = reduce ? 0 : -body.steer * VEHICLE.tiltSteer + body.airRoll * 0.35;
      const pitch = reduce ? 0 : THREE.MathUtils.clamp(-body.vy * VEHICLE.tiltPitch, -0.35, 0.35);
      chassis.current.rotation.z = THREE.MathUtils.damp(chassis.current.rotation.z, roll, 6, dt);
      chassis.current.rotation.x = THREE.MathUtils.damp(chassis.current.rotation.x, pitch, 6, dt);
    }
    wheelRefs.current.forEach((wheel, index) => {
      if (!wheel) return;
      wheel.rotation.x = body.wheelSpin;
      if (WHEELS[index].steer) wheel.parent.rotation.y = body.steer * 0.4;
    });

    const trailOn = trailId !== 'none' && Math.abs(body.speed) > 4;
    trailRefs.current.forEach((puff, index) => {
      if (!puff) return;
      puff.visible = trailOn;
      if (!trailOn) return;
      const back = index * 0.55 + 1.2;
      puff.position.set(
        body.x - Math.sin(body.heading) * back,
        body.y + 0.2,
        body.z + Math.cos(body.heading) * back,
      );
      const scale = 0.35 + index * 0.08;
      puff.scale.setScalar(scale);
      puff.material.opacity = 0.35 - index * 0.04;
    });
    dustRefs.current.forEach((puff, index) => {
      if (!puff) return;
      puff.visible = drifting;
      if (!drifting) return;
      const side = index % 2 === 0 ? -0.8 : 0.8;
      puff.position.set(
        body.x + Math.cos(body.heading) * side,
        body.y + 0.15,
        body.z + Math.sin(body.heading) * side,
      );
    });

    const targetFov = state.reduceMotion || !boosting ? VEHICLE.fovBase : VEHICLE.fovBoost;
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4, dt);
    camera.updateProjectionMatrix();

    const followYaw = body.heading + angles.current.theta;
    const dist = angles.current.distance;
    const camX = body.x - Math.sin(followYaw) * dist;
    const camZ = body.z + Math.cos(followYaw) * dist;
    const camY = body.y + CAMERA.height + Math.sin(angles.current.phi) * 2;
    const follow = state.reduceMotion ? 12 : CAMERA.follow;
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 1 - Math.exp(-follow * dt));
    camera.lookAt(body.x, body.y + CAMERA.lookAtHeight, body.z);

    posSync.current += dt;
    if (posSync.current > 0.12) {
      posSync.current = 0;
      state.setPlayerPos([body.x, body.y, body.z]);
      state.setPlayerRotation(body.heading);
    }

    scanInteractables(body, pads, state);
    scanSecrets(body, state, latch.current.secrets);
    scanCircuit(body, state, latch.current.gates);
  });

  return (
    <group ref={root}>
      <group ref={chassis}>
        <RoundedBox args={[1.55, 0.48, 2.35]} radius={0.16} smoothness={3} castShadow position={[0, 0.55, 0]}>
          <meshStandardMaterial color={paint.color} roughness={0.45} metalness={0.05} />
        </RoundedBox>
        <RoundedBox args={[1.25, 0.42, 1.15]} radius={0.14} smoothness={3} castShadow position={[0, 0.95, -0.12]}>
          <meshStandardMaterial color="#FFF7ED" roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.95, 0.48]}>
          <boxGeometry args={[1.1, 0.28, 0.06]} />
          <meshStandardMaterial color="#B9D6E8" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.42, 1.15]}>
          <boxGeometry args={[0.7, 0.16, 0.12]} />
          <meshStandardMaterial color="#FFF3C4" emissive="#F4D35E" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[-0.48, 0.42, -1.12]}>
          <boxGeometry args={[0.22, 0.12, 0.08]} />
          <meshStandardMaterial color="#E85D4C" emissive="#C0392B" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.48, 0.42, -1.12]}>
          <boxGeometry args={[0.22, 0.12, 0.08]} />
          <meshStandardMaterial color="#E85D4C" emissive="#C0392B" emissiveIntensity={0.4} />
        </mesh>
        {WHEELS.map((wheel, index) => (
          <group key={wheel.x + '-' + wheel.z} position={[wheel.x, VEHICLE.wheelRadius, wheel.z]}>
            <group ref={(node) => { wheelRefs.current[index] = node; }}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[VEHICLE.wheelRadius, VEHICLE.wheelRadius, 0.28, 14]} />
                <meshStandardMaterial color="#2C2A29" roughness={0.7} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.16, 0.16, 0.3, 10]} />
                <meshStandardMaterial color="#F4E1C1" />
              </mesh>
            </group>
          </group>
        ))}
      </group>
      {Array.from({ length: 6 }).map((_, index) => (
        <mesh key={`trail-${index}`} ref={(node) => { trailRefs.current[index] = node; }} visible={false}>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshBasicMaterial color={trailId === 'spark' ? '#F97316' : '#E7D3A1'} transparent opacity={0.3} />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <mesh key={`dust-${index}`} ref={(node) => { dustRefs.current[index] = node; }} visible={false}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial color="#E6D3A3" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function scanInteractables(body, pads, state) {
  let found = null;
  let best = 6.2;

  for (const npc of WORLD_NPCS) {
    const dist = Math.hypot(body.x - npc.position[0], body.z - npc.position[2]);
    if (dist < 4.4 && dist < best) {
      best = dist;
      found = {
        id: npc.id,
        locationId: npc.locationId,
        name: npc.name,
        type: 'npc',
        actionText: `Talk with ${npc.name}`,
        data: npc,
      };
    }
  }

  const whisperDist = Math.hypot(body.x - WHISPER_SIGN.position[0], body.z - WHISPER_SIGN.position[2]);
  if (whisperDist < WHISPER_SIGN.radius) {
    found = {
      id: 'whispers',
      name: 'Whispers',
      type: 'whispers',
      actionText: 'Leave a short note',
    };
  }

  for (const pad of pads) {
    const dist = Math.hypot(body.x - pad.position[0], body.z - pad.position[2]);
    if (dist < 3.3) {
      found = {
        id: `project-${pad.project.id}`,
        name: pad.project.title,
        type: 'project',
        actionText: `Read ${pad.project.title}`,
        data: pad.project,
      };
    }
  }

  for (const zone of PORTFOLIO_ZONES) {
    const dist = Math.hypot(body.x - zone.position[0], body.z - zone.position[2]);
    if (dist < zone.radius) {
      state.visitZone(zone.id);
      if (!found || found.type === 'npc') {
        found = {
          id: zone.id,
          locationId: zone.modalId,
          zoneId: zone.id,
          name: zone.name,
          type: 'zone',
          actionText: `Open ${zone.name}`,
        };
      }
    }
  }

  if (!found) {
    let closest = WORLD_LOCATIONS[0];
    let min = Infinity;
    for (const loc of WORLD_LOCATIONS) {
      const dist = Math.hypot(body.x - loc.coordinates[0], body.z - loc.coordinates[2]);
      if (dist < min) {
        min = dist;
        closest = loc;
      }
    }
    state.setCurrentLocation(closest);
    if (min < 6 && closest.id !== 'spawn') {
      found = {
        id: closest.id,
        locationId: closest.id,
        name: closest.name,
        type: 'location',
        actionText: `Inspect ${closest.name}`,
        data: closest,
      };
    }
  }

  const prev = state.nearbyInteractable;
  const prevId = prev?.id || null;
  const nextId = found?.id || null;
  if (prevId !== nextId) state.setNearbyInteractable(found);
}

function scanSecrets(body, state, inside) {
  for (const secret of SECRETS) {
    const dist = Math.hypot(body.x - secret.position[0], body.z - secret.position[2]);
    const near = dist < secret.radius;
    if (near && !inside.has(secret.id)) {
      inside.add(secret.id);
      state.findSecret(secret.id);
    }
    if (!near) inside.delete(secret.id);
  }
}

function scanCircuit(body, state, inside) {
  CIRCUIT_GATES.forEach((gate, index) => {
    const dist = Math.hypot(body.x - gate.x, body.z - gate.z);
    const near = dist < gate.r;
    if (near && !inside.has(gate.id)) {
      inside.add(gate.id);
      if (index === 0) state.noteCircuitStart(performance.now());
      else state.noteCircuitGate(index, performance.now());
    }
    if (!near) inside.delete(gate.id);
  });
}
