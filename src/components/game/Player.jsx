// ─────────────────────────────────────────────
// PROCEDURAL DEVELOPER PLAYER & DYNAMIC ANIMATION ENGINE
// Fixed foot alignment (soles sit exactly at ground y=0), hip & shoulder pivot joints,
// velocity-driven procedural walk cycle, dynamic body bobbing, jump poses, and shadow positioning
// ─────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS, COLLECTIBLES } from '../../data/gameData';
import { STATIC_COLLIDERS, WORLD_BOUNDS, WORLD_NPCS, PLAYER_PHYSICS } from '../../data/worldConfig';
import { soundManager } from '../../utils/soundManager';

export function Player() {
  const controls = usePlayerControls();
  const playerGroup = useRef();
  const bodyMesh = useRef();
  const leftLegPivot = useRef();
  const rightLegPivot = useRef();
  const leftArmPivot = useRef();
  const rightArmPivot = useRef();

  const { camera } = useThree();

  // Internal physics & movement state - spawn at safe plaza coordinates
  const pos = useRef(new THREE.Vector3(0, 0, 2.5));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  const isGrounded = useRef(true);
  const verticalVel = useRef(0);
  const stepTimer = useRef(0);
  const walkPhase = useRef(0);

  // Mouse orbit camera angles
  const cameraAngles = useRef({ theta: 0, phi: 0.35, distance: 9.5 });

  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const setCurrentLocation = useGameStore((state) => state.setCurrentLocation);
  const setNearbyInteractable = useGameStore((state) => state.setNearbyInteractable);
  const collectItem = useGameStore((state) => state.collectItem);
  const collectibles = useGameStore((state) => state.collectibles);
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
  const checkCollisionAt = (px, pz, radius = PLAYER_PHYSICS.colliderRadius) => {
    // 1. World perimeter boundary
    if (Math.hypot(px, pz) > WORLD_BOUNDS.radius - 2.5) {
      return true;
    }

    // 2. Static Colliders (structures, walls, well, windmill)
    for (const col of STATIC_COLLIDERS) {
      if (col.type === 'circle') {
        const dist = Math.hypot(px - col.x, pz - col.z);
        if (dist < col.r + radius) {
          return true;
        }
      } else if (col.type === 'box') {
        const minX = col.x - col.hw - radius;
        const maxX = col.x + col.hw + radius;
        const minZ = col.z - col.hd - radius;
        const maxZ = col.z + col.hd + radius;
        if (px >= minX && px <= maxX && pz >= minZ && pz <= maxZ) {
          return true;
        }
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    // Movement paused only while modal dialog is open
    if (activeModal) return;

    // Movement calculation
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

    if (wantsToMove) {
      moveDir.normalize();
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, moveDir.x * currentSpeed, delta * 12);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, moveDir.z * currentSpeed, delta * 12);

      // Character facing rotation
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - rotation.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotation.current += angleDiff * delta * 14;
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, delta * 14);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, delta * 14);
    }

    // Jump & Gravity physics
    if (controls.jump && isGrounded.current) {
      verticalVel.current = PLAYER_PHYSICS.jumpStrength;
      isGrounded.current = false;
      soundManager.playJump();
    }

    if (!isGrounded.current) {
      verticalVel.current -= PLAYER_PHYSICS.gravity * delta;
      pos.current.y += verticalVel.current * delta;

      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVel.current = 0;
        isGrounded.current = true;
      }
    }

    // Actual displacement with collision & sliding
    const targetX = pos.current.x + velocity.current.x * delta;
    const targetZ = pos.current.z + velocity.current.z * delta;

    let actualMoved = false;
    const prevX = pos.current.x;
    const prevZ = pos.current.z;

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

    // Calculate actual horizontal speed to drive animation realistically (avoids walking into walls)
    const horizontalDistanceMoved = Math.hypot(pos.current.x - prevX, pos.current.z - prevZ);
    const actualHorizontalSpeed = horizontalDistanceMoved / Math.max(0.0001, delta);
    const isActuallyMoving = actualHorizontalSpeed > 0.4 && isGrounded.current;

    // ── PROCEDURAL WALK & JUMP ANIMATION DRIVEN BY ACTUAL VELOCITY ──
    if (isActuallyMoving) {
      const animFreq = controls.sprint ? 14 : 9.5;
      walkPhase.current += delta * animFreq;

      const legAngle = Math.sin(walkPhase.current) * (controls.sprint ? 0.75 : 0.55);
      const armAngle = Math.sin(walkPhase.current) * (controls.sprint ? 0.65 : 0.45);

      if (leftLegPivot.current) leftLegPivot.current.rotation.x = legAngle;
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = -legAngle;
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = -armAngle;
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = armAngle;

      // Slight natural vertical body bobbing while walking
      if (bodyMesh.current) {
        bodyMesh.current.position.y = Math.abs(Math.sin(walkPhase.current * 2)) * 0.08;
      }

      // Footstep sound
      stepTimer.current += delta * (controls.sprint ? 1.6 : 1.0);
      if (stepTimer.current > PLAYER_PHYSICS.stepInterval) {
        soundManager.playFootstep();
        stepTimer.current = 0;
      }
    } else if (!isGrounded.current) {
      // Jump pose: legs slightly apart and tucked, arms lifted
      const jumpTime = Math.min(1, Math.max(0, verticalVel.current / PLAYER_PHYSICS.jumpStrength));
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = THREE.MathUtils.lerp(leftLegPivot.current.rotation.x, -0.4, delta * 10);
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = THREE.MathUtils.lerp(rightLegPivot.current.rotation.x, 0.4, delta * 10);
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = THREE.MathUtils.lerp(leftArmPivot.current.rotation.x, -0.6, delta * 10);
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = THREE.MathUtils.lerp(rightArmPivot.current.rotation.x, -0.6, delta * 10);
      if (bodyMesh.current) {
        bodyMesh.current.position.y = THREE.MathUtils.lerp(bodyMesh.current.position.y, 0.05, delta * 8);
      }
      stepTimer.current = 0;
    } else {
      // Return smoothly to idle standing pose
      if (leftLegPivot.current) leftLegPivot.current.rotation.x = THREE.MathUtils.lerp(leftLegPivot.current.rotation.x, 0, delta * 12);
      if (rightLegPivot.current) rightLegPivot.current.rotation.x = THREE.MathUtils.lerp(rightLegPivot.current.rotation.x, 0, delta * 12);
      if (leftArmPivot.current) leftArmPivot.current.rotation.x = THREE.MathUtils.lerp(leftArmPivot.current.rotation.x, 0, delta * 12);
      if (rightArmPivot.current) rightArmPivot.current.rotation.x = THREE.MathUtils.lerp(rightArmPivot.current.rotation.x, 0, delta * 12);
      if (bodyMesh.current) {
        bodyMesh.current.position.y = THREE.MathUtils.lerp(bodyMesh.current.position.y, 0, delta * 12);
      }
      stepTimer.current = 0;
    }

    // Apply position and rotation to player root
    if (playerGroup.current) {
      playerGroup.current.position.copy(pos.current);
      playerGroup.current.rotation.y = rotation.current;
    }

    // Third-person smooth follow camera
    const camDist = cameraAngles.current.distance;
    const camX = pos.current.x + Math.sin(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;
    const camY = pos.current.y + Math.sin(cameraAngles.current.phi) * camDist + 1.8;
    const camZ = pos.current.z + Math.cos(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;

    camera.position.lerp(new THREE.Vector3(camX, Math.max(1.2, camY), camZ), delta * 8);
    camera.lookAt(pos.current.x, pos.current.y + 1.4, pos.current.z);

    // Sync position to store
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

    // NPC & Structure Interaction Proximity
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

    // Inside Developer House trigger
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

    // Collectible pickup range
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
    <group ref={playerGroup} position={[0, 0, 2.5]}>
      {/* ── Visual Body Sub-Group with Walk Bobbing ── */}
      <group ref={bodyMesh} position={[0, 0, 0]}>
        {/* Hip / Waist (y = 0.75, height = 0.12, so bottom of hip is y = 0.69) */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.58, 0.12, 0.36]} />
          <meshStandardMaterial color="#1C1917" flatShading />
        </mesh>

        {/* Torso / Modern Developer Hoodie (y = 1.15, height = 0.68) */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.62, 0.68, 0.38]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} flatShading />
        </mesh>
        {/* Hoodie Pocket */}
        <mesh position={[0, 0.98, 0.2]}>
          <boxGeometry args={[0.34, 0.22, 0.04]} />
          <meshStandardMaterial color="#C2410C" flatShading />
        </mesh>
        {/* Laptop Sling Bag Strap across chest */}
        <mesh position={[0, 1.18, 0.2]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.1, 0.72, 0.04]} />
          <meshStandardMaterial color="#292524" flatShading />
        </mesh>

        {/* Head (y = 1.74, height = 0.44) */}
        <mesh position={[0, 1.74, 0]} castShadow>
          <boxGeometry args={[0.42, 0.44, 0.42]} />
          <meshStandardMaterial color="#FCD34D" roughness={0.6} flatShading />
        </mesh>
        {/* Headphones Headband */}
        <mesh position={[0, 1.94, 0]}>
          <torusGeometry args={[0.26, 0.05, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} flatShading />
        </mesh>
        {/* Left Ear Cushion */}
        <mesh position={[-0.24, 1.74, 0]}>
          <boxGeometry args={[0.08, 0.22, 0.22]} />
          <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
        </mesh>
        {/* Right Ear Cushion */}
        <mesh position={[0.24, 1.74, 0]}>
          <boxGeometry args={[0.08, 0.22, 0.22]} />
          <meshStandardMaterial color="#F97316" metalness={0.5} flatShading />
        </mesh>

        {/* ── Left Arm (Pivoted at Shoulder Joint: y = 1.42) ── */}
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

        {/* ── Right Arm (Pivoted at Shoulder Joint: y = 1.42) ── */}
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

        {/* ── Left Leg (Pivoted at Hip Joint: y = 0.72) ── */}
        {/* Leg extends downward by 0.72m total so sneaker bottom reaches exactly y = 0 */}
        <group ref={leftLegPivot} position={[-0.16, 0.72, 0]}>
          {/* Jeans Leg: length = 0.58, centered at y = -0.29 */}
          <mesh position={[0, -0.29, 0]} castShadow>
            <boxGeometry args={[0.22, 0.58, 0.24]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
          </mesh>
          {/* Sneaker: height = 0.14, centered at y = -0.65 (bottom lands exactly at -0.72 from hip = y: 0) */}
          <mesh position={[0, -0.65, 0.05]} castShadow>
            <boxGeometry args={[0.24, 0.14, 0.36]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.5} flatShading />
          </mesh>
        </group>

        {/* ── Right Leg (Pivoted at Hip Joint: y = 0.72) ── */}
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

      {/* ── Ground Contact Shadow Disc (Sits flush right beneath soles at y = 0.015) ── */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}
