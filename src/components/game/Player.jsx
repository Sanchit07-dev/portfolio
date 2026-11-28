// ─────────────────────────────────────────────
// RAPIER-POWERED DEVELOPER CHARACTER CONTROLLER & THIRD-PERSON CAMERA
// Rapier dynamic physics with capsule collider, smooth acceleration/deceleration,
// slopes & steps handling, continuous collision detection, camera collision avoidance,
// out-of-bounds abyss rescue, respawn system, and velocity-driven animations.
// ─────────────────────────────────────────────

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS } from '../../data/gameData';
import { STATIC_COLLIDERS, WORLD_BOUNDS, WORLD_NPCS, PLAYER_PHYSICS, generateVegetationAndRocks } from '../../data/worldConfig';
import { soundManager } from '../../utils/soundManager';

// Fast geometric 2D/3D raycast against static and tree colliders to avoid camera clipping
function testRaycastObstacles(origin, dir, maxDist, obstacles) {
  let closestDist = maxDist;

  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    if (ob.type === 'circle') {
      // 2D Ray-circle intersection
      const dx = ob.x - origin.x;
      const dz = ob.z - origin.z;
      const t = dx * dir.x + dz * dir.z;
      if (t > 0.4 && t < closestDist) {
        const perpSq = (dx * dx + dz * dz) - (t * t);
        const radiusWithPad = ob.r + 0.35;
        if (perpSq >= 0 && perpSq < radiusWithPad * radiusWithPad) {
          const dt = Math.sqrt(radiusWithPad * radiusWithPad - perpSq);
          const hit = t - dt;
          if (hit > 0.4 && hit < closestDist) {
            closestDist = hit;
          }
        }
      }
    } else if (ob.type === 'box') {
      // 2D Ray-AABB intersection
      const minX = ob.x - ob.hw - 0.35;
      const maxX = ob.x + ob.hw + 0.35;
      const minZ = ob.z - ob.hd - 0.35;
      const maxZ = ob.z + ob.hd + 0.35;

      let tmin = -Infinity;
      let tmax = Infinity;

      if (Math.abs(dir.x) > 0.0001) {
        const tx1 = (minX - origin.x) / dir.x;
        const tx2 = (maxX - origin.x) / dir.x;
        tmin = Math.max(tmin, Math.min(tx1, tx2));
        tmax = Math.min(tmax, Math.max(tx1, tx2));
      } else if (origin.x < minX || origin.x > maxX) {
        continue;
      }

      if (Math.abs(dir.z) > 0.0001) {
        const tz1 = (minZ - origin.z) / dir.z;
        const tz2 = (maxZ - origin.z) / dir.z;
        tmin = Math.max(tmin, Math.min(tz1, tz2));
        tmax = Math.min(tmax, Math.max(tz1, tz2));
      } else if (origin.z < minZ || origin.z > maxZ) {
        continue;
      }

      if (tmax >= tmin && tmin > 0.4 && tmin < closestDist) {
        closestDist = tmin;
      }
    }
  }

  return closestDist;
}

export function Player() {
  const controls = usePlayerControls();
  const rigidBodyRef = useRef();
  const visualGroup = useRef();
  const bodyMesh = useRef();
  const leftLegPivot = useRef();
  const rightLegPivot = useRef();
  const leftArmPivot = useRef();
  const rightArmPivot = useRef();

  const { camera } = useThree();

  // Internal physics & movement state - default spawn plaza
  const pos = useRef(new THREE.Vector3(0, 0.6, 2.5));
  const rotation = useRef(0);
  const isGrounded = useRef(true);
  const stepTimer = useRef(0);
  const walkPhase = useRef(0);
  const menuSweepAngle = useRef(0);

  // Mouse orbit camera angles
  const cameraAngles = useRef({ theta: 0, phi: 0.32, distance: 9.0 });

  // Store bindings
  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const setCurrentLocation = useGameStore((state) => state.setCurrentLocation);
  const setNearbyInteractable = useGameStore((state) => state.setNearbyInteractable);
  const collectItem = useGameStore((state) => state.collectItem);
  const collectibles = useGameStore((state) => state.collectibles);
  const gameState = useGameStore((state) => state.gameState);
  const gameMode = useGameStore((state) => state.gameMode);
  const isPaused = useGameStore((state) => state.isPaused);
  const activeModal = useGameStore((state) => state.activeModal);
  const activePanel = useGameStore((state) => state.activePanel);
  const teleportTarget = useGameStore((state) => state.teleportTarget);
  const clearTeleportTarget = useGameStore((state) => state.clearTeleportTarget);
  const respawnPlayer = useGameStore((state) => state.respawnPlayer);

  // Combined obstacle list for collision & camera raycasting
  const obstacleColliders = useMemo(() => {
    const { dynamicColliders } = generateVegetationAndRocks(220, 108);
    return [...STATIC_COLLIDERS, ...dynamicColliders];
  }, []);

  // Mouse drag camera orbit listener (only active while playing)
  useEffect(() => {
    const isPlaying = (gameState === 'playing' || gameMode === 'playing') && !isPaused && !activeModal && !activePanel;
    if (!isPlaying) return undefined;

    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      if (e.button === 0 || e.button === 2) {
        isMouseDown = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraAngles.current.theta -= deltaX * 0.005;
      cameraAngles.current.phi = Math.max(
        0.06,
        Math.min(1.22, cameraAngles.current.phi + deltaY * 0.005)
      );
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e) => {
      cameraAngles.current.distance = Math.max(
        3.5,
        Math.min(16.0, cameraAngles.current.distance + e.deltaY * 0.008)
      );
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, [gameState, gameMode, isPaused, activeModal, activePanel]);

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // ── 1. TELEPORT / RESPAWN SYSTEM HANDLING ──
    if (teleportTarget) {
      rb.setTranslation({ x: teleportTarget[0], y: teleportTarget[1], z: teleportTarget[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      pos.current.set(teleportTarget[0], teleportTarget[1], teleportTarget[2]);
      clearTeleportTarget();
      return;
    }

    const t = rb.translation();
    pos.current.set(t.x, t.y, t.z);

    // ── 2. OUT-OF-BOUNDS / ABYSS RESCUE ──
    if (t.y < -12.0 || Math.hypot(t.x, t.z) > WORLD_BOUNDS.radius + 15) {
      respawnPlayer();
      return;
    }

    const isPlaying = (gameState === 'playing' || gameMode === 'playing') && !isPaused && !activeModal && !activePanel;

    // ── 3. CINEMATIC CAMERA SWEEP DURING MENU / LOADING ──
    if (!isPlaying) {
      // Gentle cinematic camera orbit around spawn plaza
      menuSweepAngle.current += delta * 0.22;
      const sweepDist = 12.0;
      const sweepHeight = 6.5;
      const camX = pos.current.x + Math.sin(menuSweepAngle.current) * sweepDist;
      const camZ = pos.current.z + Math.cos(menuSweepAngle.current) * sweepDist;
      camera.position.lerp(new THREE.Vector3(camX, sweepHeight, camZ), delta * 3);
      camera.lookAt(pos.current.x, pos.current.y + 1.2, pos.current.z);

      // Damp down character velocity while paused/in menu
      const lv = rb.linvel();
      rb.setLinvel({ x: lv.x * 0.8, y: lv.y, z: lv.z * 0.8 }, true);
      return;
    }

    // ── 4. RAPIER CHARACTER CONTROLLER PHYSICS ──
    const currentSpeed = controls.sprint ? PLAYER_PHYSICS.sprintSpeed : PLAYER_PHYSICS.walkSpeed;
    const moveDir = new THREE.Vector3();

    // Camera relative directions
    const forward = new THREE.Vector3(
      -Math.sin(cameraAngles.current.theta),
      0,
      -Math.cos(cameraAngles.current.theta)
    ).normalize();
    const right = new THREE.Vector3(
      Math.cos(cameraAngles.current.theta),
      0,
      -Math.sin(cameraAngles.current.theta)
    ).normalize();

    if (controls.forward) moveDir.add(forward);
    if (controls.backward) moveDir.sub(forward);
    if (controls.right) moveDir.add(right);
    if (controls.left) moveDir.sub(right);

    const wantsToMove = moveDir.lengthSq() > 0.001;
    const currentLinvel = rb.linvel();

    // Check if player is grounded (vertical velocity near 0 or close to ground surface)
    isGrounded.current = Math.abs(currentLinvel.y) < 0.25 || t.y <= 0.65;

    let targetVx = 0;
    let targetVz = 0;

    if (wantsToMove) {
      moveDir.normalize();
      targetVx = moveDir.x * currentSpeed;
      targetVz = moveDir.z * currentSpeed;

      // Character facing rotation
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - rotation.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotation.current += angleDiff * delta * 14;
    }

    // Smooth acceleration / deceleration
    const newVx = THREE.MathUtils.lerp(currentLinvel.x, targetVx, delta * 12);
    const newVz = THREE.MathUtils.lerp(currentLinvel.z, targetVz, delta * 12);
    let newVy = currentLinvel.y;

    // Jump trigger
    if (controls.jump && isGrounded.current) {
      newVy = PLAYER_PHYSICS.jumpStrength;
      isGrounded.current = false;
      try {
        soundManager.playJump();
      } catch {
        // ignore
      }
    }

    // Apply linear velocity into Rapier rigid body
    rb.setLinvel({ x: newVx, y: newVy, z: newVz }, true);

    // Synchronize visual mesh rotation and position
    if (visualGroup.current) {
      visualGroup.current.position.copy(pos.current);
      visualGroup.current.rotation.y = rotation.current;
    }

    // ── 5. PROCEDURAL WALK & JUMP ANIMATION ──
    const horizSpeed = Math.hypot(newVx, newVz);
    const isActuallyMoving = horizSpeed > 0.4 && isGrounded.current;

    if (isActuallyMoving) {
      const animFreq = controls.sprint ? 14 : 9.5;
      walkPhase.current += delta * animFreq;

      const legAngle = Math.sin(walkPhase.current) * (controls.sprint ? 0.75 : 0.55);
      const armAngle = Math.sin(walkPhase.current) * (controls.sprint ? 0.65 : 0.45);

      if (leftLegPivot.current) leftLegPivot.current.rotation.x = legAngle;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -legAngle;
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -armAngle;
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = armAngle;

      if (bodyMesh.current) {
        bodyMesh.current.position.y = Math.abs(Math.sin(walkPhase.current * 2)) * 0.08;
      }

      stepTimer.current += delta * (controls.sprint ? 1.6 : 1.0);
      if (stepTimer.current > PLAYER_PHYSICS.stepInterval) {
        try {
          soundManager.playFootstep();
        } catch {
          // ignore
        }
        stepTimer.current = 0;
      }
    } else if (!isGrounded.current) {
      // Jump pose
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = THREE.MathUtils.lerp(leftLegPivot.current.rotation.x, -0.4, delta * 10);
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = THREE.MathUtils.lerp(rightLegPivot.current.rotation.x, 0.4, delta * 10);
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = THREE.MathUtils.lerp(leftArmPivot.current.rotation.x, -0.6, delta * 10);
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = THREE.MathUtils.lerp(rightArmPivot.current.rotation.x, -0.6, delta * 10);
      if (bodyMesh.current) {
        bodyMesh.current.position.y = THREE.MathUtils.lerp(bodyMesh.current.position.y, 0.05, delta * 8);
      }
      stepTimer.current = 0;
    } else {
      // Idle pose
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = THREE.MathUtils.lerp(leftLegPivot.current.rotation.x, 0, delta * 12);
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = THREE.MathUtils.lerp(rightLegPivot.current.rotation.x, 0, delta * 12);
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = THREE.MathUtils.lerp(leftArmPivot.current.rotation.x, 0, delta * 12);
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = THREE.MathUtils.lerp(rightArmPivot.current.rotation.x, 0, delta * 12);
      if (bodyMesh.current) {
        bodyMesh.current.position.y = THREE.MathUtils.lerp(bodyMesh.current.position.y, 0, delta * 12);
      }
      stepTimer.current = 0;
    }

    // ── 6. THIRD-PERSON CAMERA WITH COLLISION AVOIDANCE ──
    const headPos = new THREE.Vector3(pos.current.x, pos.current.y + 1.4, pos.current.z);
    const desiredDistance = cameraAngles.current.distance;

    // Unit direction from head towards ideal camera position
    const camDirX = Math.sin(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi);
    const camDirY = Math.sin(cameraAngles.current.phi);
    const camDirZ = Math.cos(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi);
    const camDir = new THREE.Vector3(camDirX, camDirY, camDirZ).normalize();

    // Raycast against world obstacles
    const hitDistance = testRaycastObstacles(headPos, camDir, desiredDistance, obstacleColliders);
    const safeDistance = Math.max(1.3, hitDistance < desiredDistance ? hitDistance - 0.35 : desiredDistance);

    const targetCamX = headPos.x + camDir.x * safeDistance;
    const targetCamY = Math.max(0.7, headPos.y + camDir.y * safeDistance);
    const targetCamZ = headPos.z + camDir.z * safeDistance;

    camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), delta * 10);
    camera.lookAt(headPos);

    // ── 7. ZONE & INTERACTION DETECTION ──
    setPlayerPos([pos.current.x, pos.current.y, pos.current.z]);

    let closestLoc = WORLD_LOCATIONS[0];
    let minLocDist = Infinity;
    for (const loc of WORLD_LOCATIONS) {
      const d = Math.hypot(pos.current.x - loc.coordinates[0], pos.current.z - loc.coordinates[2]);
      if (d < minLocDist) {
        minLocDist = d;
        closestLoc = loc;
      }
    }
    setCurrentLocation(closestLoc);

    let foundInteractable = null;
    for (const npc of WORLD_NPCS) {
      const distToNPC = Math.hypot(pos.current.x - npc.position[0], pos.current.z - npc.position[2]);
      if (distToNPC < 4.2) {
        foundInteractable = {
          id: npc.id,
          locationId: npc.locationId,
          name: npc.name,
          type: 'npc',
          actionText: `Talk with ${npc.name}`,
          data: npc
        };
        break;
      }
    }

    if (!foundInteractable && minLocDist < 5.2 && closestLoc.id !== 'spawn') {
      foundInteractable = {
        id: closestLoc.id,
        locationId: closestLoc.id,
        name: closestLoc.name,
        type: 'location',
        actionText: `Inspect ${closestLoc.name}`,
        data: closestLoc
      };
    }

    if (!foundInteractable) {
      const inHouse = Math.abs(pos.current.x - (-35)) < 4.0 && Math.abs(pos.current.z - (-22)) < 3.2;
      if (inHouse) {
        foundInteractable = {
          id: 'house_interior',
          locationId: 'house',
          name: 'Developer Workshop',
          type: 'interior',
          actionText: 'Inspect Developer Desk'
        };
      }
    }

    setNearbyInteractable(foundInteractable);

    for (const item of collectibles) {
      if (!item.collected) {
        const d = Math.hypot(pos.current.x - item.position[0], pos.current.z - item.position[2]);
        if (d < 2.4) {
          collectItem(item.id);
        }
      }
    }
  });

  return (
    <>
      {/* ── Rapier Physical RigidBody for Character ── */}
      <RigidBody
        ref={rigidBodyRef}
        position={[0, 0.6, 2.5]}
        colliders={false}
        type="dynamic"
        enabledRotations={[false, false, false]}
        linearDamping={2.0}
        friction={0.0}
        restitution={0.0}
        ccd={true}
      >
        {/* Capsule collider matching character bounds: height 1.1m, radius 0.35m */}
        <CapsuleCollider args={[0.55, 0.35]} position={[0, 0.9, 0]} />
      </RigidBody>

      {/* ── Visual Mesh Group ── */}
      <group ref={visualGroup} position={[0, 0.6, 2.5]}>
        <group ref={bodyMesh} position={[0, 0, 0]}>
          {/* Waist */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.58, 0.12, 0.36]} />
            <meshStandardMaterial color="#1C1917" flatShading />
          </mesh>

          {/* Torso / Developer Hoodie */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.62, 0.68, 0.38]} />
            <meshStandardMaterial color="#EA580C" roughness={0.7} flatShading />
          </mesh>
          {/* Hoodie Pocket */}
          <mesh position={[0, 0.98, 0.2]}>
            <boxGeometry args={[0.34, 0.22, 0.04]} />
            <meshStandardMaterial color="#C2410C" flatShading />
          </mesh>
          {/* Bag Strap */}
          <mesh position={[0, 1.18, 0.2]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[0.1, 0.72, 0.04]} />
            <meshStandardMaterial color="#292524" flatShading />
          </mesh>

          {/* Head */}
          <mesh position={[0, 1.74, 0]} castShadow>
            <boxGeometry args={[0.42, 0.44, 0.42]} />
            <meshStandardMaterial color="#FCD34D" roughness={0.6} flatShading />
          </mesh>
          {/* Headphones */}
          <mesh position={[0, 1.94, 0]}>
            <torusGeometry args={[0.26, 0.05, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} flatShading />
          </mesh>
          <mesh position={[-0.24, 1.74, 0]}>
            <boxGeometry args={[0.08, 0.22, 0.22]} />
            <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
          </mesh>
          <mesh position={[0.24, 1.74, 0]}>
            <boxGeometry args={[0.08, 0.22, 0.22]} />
            <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
          </mesh>

          {/* Left Arm */}
          <group ref={leftArmPivot} position={[-0.42, 1.42, 0]}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <boxGeometry args={[0.18, 0.60, 0.2]} />
              <meshStandardMaterial color="#EA580C" flatShading />
            </mesh>
            <mesh position={[0, -0.66, 0]}>
              <boxGeometry args={[0.14, 0.14, 0.16]} />
              <meshStandardMaterial color="#FCD34D" flatShading />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmPivot} position={[0.42, 1.42, 0]}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <boxGeometry args={[0.18, 0.60, 0.2]} />
              <meshStandardMaterial color="#EA580C" flatShading />
            </mesh>
            <mesh position={[0, -0.66, 0]}>
              <boxGeometry args={[0.14, 0.14, 0.16]} />
              <meshStandardMaterial color="#FCD34D" flatShading />
            </mesh>
          </group>

          {/* Left Leg */}
          <group ref={leftLegPivot} position={[-0.16, 0.72, 0]}>
            <mesh position={[0, -0.29, 0]} castShadow>
              <boxGeometry args={[0.22, 0.58, 0.24]} />
              <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, -0.65, 0.05]} castShadow>
              <boxGeometry args={[0.24, 0.14, 0.36]} />
              <meshStandardMaterial color="#FAFAFA" roughness={0.5} flatShading />
            </mesh>
          </group>

          {/* Right Leg */}
          <group ref={rightLegPivot} position={[0.16, 0.72, 0]}>
            <mesh position={[0, -0.29, 0]} castShadow>
              <boxGeometry args={[0.22, 0.58, 0.24]} />
              <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, -0.65, 0.05]} castShadow>
              <boxGeometry args={[0.24, 0.14, 0.36]} />
              <meshStandardMaterial color="#FAFAFA" roughness={0.5} flatShading />
            </mesh>
          </group>
        </group>

        {/* Dynamic Shadow Disc Beneath Soles */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.32} />
        </mesh>
      </group>
    </>
  );
}
