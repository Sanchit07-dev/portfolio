// ─────────────────────────────────────────────
// PROCEDURAL DEVELOPER PLAYER & DYNAMIC COLLISION ENGINE
// Real sliding physics along obstacle tangents, comprehensive circle & box colliders,
// robust NPC proximity audit (fixing Beacon Operator Lyra & all world NPCs)
// ─────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS, COLLECTIBLES } from '../../data/gameData';
import { STATIC_COLLIDERS, WORLD_BOUNDS, WORLD_NPCS } from '../../data/worldConfig';
import { soundManager } from '../../utils/soundManager';

export function Player() {
  const controls = usePlayerControls();
  const playerGroup = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  const { camera } = useThree();

  // Internal physics & movement state - spawn safely at [0, 0, 3] on the open stone plaza
  const pos = useRef(new THREE.Vector3(0, 0, 3));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  const isGrounded = useRef(true);
  const verticalVel = useRef(0);
  const stepTimer = useRef(0);

  // Mouse orbit camera angles
  const cameraAngles = useRef({ theta: 0, phi: 0.35, distance: 9.5 });

  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const setCurrentLocation = useGameStore((state) => state.setCurrentLocation);
  const setNearbyInteractable = useGameStore((state) => state.setNearbyInteractable);
  const collectItem = useGameStore((state) => state.collectItem);
  const collectibles = useGameStore((state) => state.collectibles);
  const isPaused = useGameStore((state) => state.isPaused);
  const activeModal = useGameStore((state) => state.activeModal);

  // Mouse drag camera orbit listener
  useEffect(() => {
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
        0.08,
        Math.min(1.25, cameraAngles.current.phi + deltaY * 0.005)
      );
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e) => {
      cameraAngles.current.distance = Math.max(
        4.0,
        Math.min(18.0, cameraAngles.current.distance + e.deltaY * 0.008)
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
  }, []);

  // Collision detection helper: checks if a point (x, z) collides with an obstacle
  const checkCollisionAt = (px, pz, playerRadius = 0.4) => {
    // 1. World perimeter boundary
    if (Math.hypot(px, pz) > WORLD_BOUNDS.radius - 2) {
      return true;
    }

    // 2. Static Colliders (structures, walls, well, windmill)
    for (const col of STATIC_COLLIDERS) {
      if (col.type === 'circle') {
        const dist = Math.hypot(px - col.x, pz - col.z);
        if (dist < col.r + playerRadius) {
          return true;
        }
      } else if (col.type === 'box') {
        const minX = col.x - col.hw - playerRadius;
        const maxX = col.x + col.hw + playerRadius;
        const minZ = col.z - col.hd - playerRadius;
        const maxZ = col.z + col.hd + playerRadius;
        if (px >= minX && px <= maxX && pz >= minZ && pz <= maxZ) {
          return true;
        }
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    // Movement is disabled only when a modal dialogue is explicitly open
    if (activeModal) return;

    // Movement calculation
    const moveSpeed = controls.sprint ? 12 : 7.0;
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

    const isMoving = moveDir.lengthSq() > 0.001;

    if (isMoving) {
      moveDir.normalize();
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, moveDir.x * moveSpeed, delta * 12);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, moveDir.z * moveSpeed, delta * 12);

      // Character facing rotation
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - rotation.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotation.current += angleDiff * delta * 14;

      // Footstep audio
      stepTimer.current += delta * (controls.sprint ? 1.7 : 1.1);
      if (stepTimer.current > 0.35 && isGrounded.current) {
        soundManager.playFootstep();
        stepTimer.current = 0;
      }
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, delta * 14);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, delta * 14);
      stepTimer.current = 0;
    }

    // Jump & Gravity physics
    if (controls.jump && isGrounded.current) {
      verticalVel.current = 9.0;
      isGrounded.current = false;
      soundManager.playJump();
    }

    if (!isGrounded.current) {
      verticalVel.current -= 26 * delta; // gravity
      pos.current.y += verticalVel.current * delta;

      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVel.current = 0;
        isGrounded.current = true;
      }
    }

    // ── COLLISION RESOLUTION WITH TRUE AXIS SLIDING ──
    const targetX = pos.current.x + velocity.current.x * delta;
    const targetZ = pos.current.z + velocity.current.z * delta;

    // Check full move
    if (!checkCollisionAt(targetX, targetZ)) {
      pos.current.x = targetX;
      pos.current.z = targetZ;
    } else {
      // Slide along X axis if Z blocked
      if (!checkCollisionAt(targetX, pos.current.z)) {
        pos.current.x = targetX;
      } else {
        velocity.current.x = 0;
      }

      // Slide along Z axis if X blocked
      if (!checkCollisionAt(pos.current.x, targetZ)) {
        pos.current.z = targetZ;
      } else {
        velocity.current.z = 0;
      }
    }

    // Apply to 3D Player Mesh
    if (playerGroup.current) {
      playerGroup.current.position.copy(pos.current);
      playerGroup.current.rotation.y = rotation.current;

      // Limb walking animation
      const walkCycle = Math.sin(state.clock.elapsedTime * (controls.sprint ? 15 : 10));
      if (isMoving && isGrounded.current) {
        if (leftLeg.current) leftLeg.current.rotation.x = walkCycle * 0.7;
        if (rightLeg.current) rightLeg.current.rotation.x = -walkCycle * 0.7;
        if (leftArm.current) leftArm.current.rotation.x = -walkCycle * 0.6;
        if (rightArm.current) rightArm.current.rotation.x = walkCycle * 0.6;
      } else {
        if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, delta * 12);
        if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, delta * 12);
        if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, delta * 12);
        if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, delta * 12);
      }
    }

    // Third-person smooth follow camera
    const camDist = cameraAngles.current.distance;
    const camX = pos.current.x + Math.sin(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;
    const camY = pos.current.y + Math.sin(cameraAngles.current.phi) * camDist + 1.8;
    const camZ = pos.current.z + Math.cos(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;

    camera.position.lerp(new THREE.Vector3(camX, Math.max(1.2, camY), camZ), delta * 8);
    camera.lookAt(pos.current.x, pos.current.y + 1.4, pos.current.z);

    // Sync position to store (throttled)
    setPlayerPos([pos.current.x, pos.current.y, pos.current.z]);

    // Check closest zone / location for HUD
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

    // ── AUDIT ALL NPCS & STRUCTURE INTERACTION ──
    let foundInteractable = null;

    // 1. Check proximity to every NPC directly (interaction radius = 4.2m)
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

    // 2. If not talking to NPC, check if near location beacons or chest areas (< 5.0m)
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

    // 3. Inside Developer House trigger (x: -35 ± 3.5, z: -22 ± 3)
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

    // Collectible pickup range (< 2.4 units)
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
    <group ref={playerGroup} position={[0, 0, 3]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[0.42, 0.45, 0.42]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.6} flatShading />
      </mesh>

      {/* Developer Headphones */}
      <mesh position={[0, 1.82, 0]}>
        <torusGeometry args={[0.26, 0.05, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} flatShading />
      </mesh>
      <mesh position={[-0.24, 1.65, 0]}>
        <boxGeometry args={[0.08, 0.22, 0.22]} />
        <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0.24, 1.65, 0]}>
        <boxGeometry args={[0.08, 0.22, 0.22]} />
        <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
      </mesh>

      {/* Modern Developer Hoodie (Torso) */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.62, 0.72, 0.38]} />
        <meshStandardMaterial color="#EA580C" roughness={0.7} flatShading />
      </mesh>
      {/* Hoodie Pocket / Zipper detail */}
      <mesh position={[0, 0.88, 0.2]}>
        <boxGeometry args={[0.34, 0.22, 0.04]} />
        <meshStandardMaterial color="#C2410C" flatShading />
      </mesh>

      {/* Laptop Sling Bag Strap across chest */}
      <mesh position={[0, 1.08, 0.2]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.1, 0.75, 0.04]} />
        <meshStandardMaterial color="#292524" flatShading />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArm} position={[-0.42, 1.32, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.2]} />
          <meshStandardMaterial color="#EA580C" flatShading />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.68, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.16]} />
          <meshStandardMaterial color="#FCD34D" flatShading />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArm} position={[0.42, 1.32, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.2]} />
          <meshStandardMaterial color="#EA580C" flatShading />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.68, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.16]} />
          <meshStandardMaterial color="#FCD34D" flatShading />
        </mesh>
      </group>

      {/* Hip / Belt */}
      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[0.58, 0.12, 0.36]} />
        <meshStandardMaterial color="#1C1917" flatShading />
      </mesh>

      {/* Left Leg (Jeans) */}
      <group ref={leftLeg} position={[-0.16, 0.6, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.22, 0.62, 0.24]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.68, 0.05]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.36]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.5} flatShading />
        </mesh>
      </group>

      {/* Right Leg (Jeans) */}
      <group ref={rightLeg} position={[0.16, 0.6, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.22, 0.62, 0.24]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.68, 0.05]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.36]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.5} flatShading />
        </mesh>
      </group>

      {/* Ground Contact Shadow Disc */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
