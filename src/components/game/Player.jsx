// ─────────────────────────────────────────────
// PROCEDURAL LOW-POLY DEVELOPER PLAYER & THIRD-PERSON CAMERA
// Features: Developer casual outfit (hoodie, jeans, headphones, laptop bag),
// smooth velocity, jump gravity, obstacle collision, limb walking animation, follow cam
// ─────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS, COLLECTIBLES } from '../../data/gameData';
import { soundManager } from '../../utils/soundManager';

// Major building obstacle colliders [x, z, radius]
const OBSTACLES = [
  [-28, -18, 5.5],  // Developer House
  [-32, 24, 7.5],   // Skill Grounds
  [30, -26, 9.5],   // Project Castle
  [34, 26, 9.0],    // Achievement Mountain
  [0, -45, 4.8],    // Communication Tower
];

export function Player() {
  const controls = usePlayerControls();
  const playerGroup = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  const { camera } = useThree();

  // Internal physics & movement state
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  const isGrounded = useRef(true);
  const verticalVel = useRef(0);
  const stepTimer = useRef(0);

  // Mouse orbit camera angles
  const cameraAngles = useRef({ theta: 0, phi: 0.35, distance: 8.5 });

  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const setCurrentLocation = useGameStore((state) => state.setCurrentLocation);
  const setNearbyInteractable = useGameStore((state) => state.setNearbyInteractable);
  const collectItem = useGameStore((state) => state.collectItem);
  const collectibles = useGameStore((state) => state.collectibles);
  const isPaused = useGameStore((state) => state.isPaused);

  // Mouse drag camera orbit listener
  useEffect(() => {
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      // Primary mouse button
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
        0.1,
        Math.min(1.2, cameraAngles.current.phi + deltaY * 0.005)
      );
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e) => {
      cameraAngles.current.distance = Math.max(
        4.5,
        Math.min(15, cameraAngles.current.distance + e.deltaY * 0.008)
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

  useFrame((state, delta) => {
    if (isPaused) return;

    // Movement calculation
    const moveSpeed = controls.sprint ? 11 : 6.5;
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
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, moveDir.x * moveSpeed, delta * 10);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, moveDir.z * moveSpeed, delta * 10);

      // Character facing rotation
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      // Smooth angle interpolation
      let angleDiff = targetAngle - rotation.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotation.current += angleDiff * delta * 12;

      // Footstep audio
      stepTimer.current += delta * (controls.sprint ? 1.6 : 1);
      if (stepTimer.current > 0.35 && isGrounded.current) {
        soundManager.playFootstep();
        stepTimer.current = 0;
      }
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, delta * 12);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, delta * 12);
      stepTimer.current = 0;
    }

    // Jump & Gravity physics
    if (controls.jump && isGrounded.current) {
      verticalVel.current = 8.5;
      isGrounded.current = false;
      soundManager.playJump();
    }

    if (!isGrounded.current) {
      verticalVel.current -= 24 * delta; // gravity
      pos.current.y += verticalVel.current * delta;

      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVel.current = 0;
        isGrounded.current = true;
      }
    }

    // Next tentative position
    const nextX = pos.current.x + velocity.current.x * delta;
    const nextZ = pos.current.z + velocity.current.z * delta;

    // Obstacle collision resolution
    let canMoveX = true;
    let canMoveZ = true;

    // Keep within world bounds
    const distFromCenter = Math.hypot(nextX, nextZ);
    if (distFromCenter > 52) {
      canMoveX = false;
      canMoveZ = false;
    }

    // Check building obstacles
    for (const [ox, oz, rad] of OBSTACLES) {
      if (Math.hypot(nextX - ox, nextZ - oz) < rad) {
        // Resolve sliding along axis
        if (Math.hypot(nextX - ox, pos.current.z - oz) < rad) canMoveX = false;
        if (Math.hypot(pos.current.x - ox, nextZ - oz) < rad) canMoveZ = false;
      }
    }

    if (canMoveX) pos.current.x = nextX;
    if (canMoveZ) pos.current.z = nextZ;

    // Apply to mesh
    if (playerGroup.current) {
      playerGroup.current.position.copy(pos.current);
      playerGroup.current.rotation.y = rotation.current;

      // Limb walking animation
      const walkCycle = Math.sin(state.clock.elapsedTime * (controls.sprint ? 14 : 9));
      if (isMoving && isGrounded.current) {
        if (leftLeg.current) leftLeg.current.rotation.x = walkCycle * 0.65;
        if (rightLeg.current) rightLeg.current.rotation.x = -walkCycle * 0.65;
        if (leftArm.current) leftArm.current.rotation.x = -walkCycle * 0.55;
        if (rightArm.current) rightArm.current.rotation.x = walkCycle * 0.55;
      } else {
        if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, delta * 10);
        if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, delta * 10);
        if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, delta * 10);
        if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, delta * 10);
      }
    }

    // Third-person smooth follow camera
    const camDist = cameraAngles.current.distance;
    const camX = pos.current.x + Math.sin(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;
    const camY = pos.current.y + Math.sin(cameraAngles.current.phi) * camDist + 1.6;
    const camZ = pos.current.z + Math.cos(cameraAngles.current.theta) * Math.cos(cameraAngles.current.phi) * camDist;

    camera.position.lerp(new THREE.Vector3(camX, Math.max(1.2, camY), camZ), delta * 8);
    camera.lookAt(pos.current.x, pos.current.y + 1.4, pos.current.z);

    // Sync position to store (throttled)
    setPlayerPos([pos.current.x, pos.current.y, pos.current.z]);

    // Check nearby location
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

    // Check interaction range (< 4.5 units from location beacon)
    if (minLocDist < 4.8 && closestLoc.id !== 'spawn') {
      setNearbyInteractable({
        id: closestLoc.id,
        locationId: closestLoc.id,
        name: closestLoc.name,
        type: 'location',
        actionText: `Inspect ${closestLoc.name}`
      });
    } else {
      setNearbyInteractable(null);
    }

    // Check collectible pickup range (< 2.2 units)
    for (const item of collectibles) {
      if (!item.collected) {
        const d = Math.hypot(pos.current.x - item.position[0], pos.current.z - item.position[2]);
        if (d < 2.2) {
          collectItem(item.id);
        }
      }
    }
  });

  return (
    <group ref={playerGroup} position={[0, 0, 0]}>
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

      {/* Subtle Player Ground Contact Shadow Disc */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
