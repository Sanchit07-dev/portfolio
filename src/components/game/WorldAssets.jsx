// ─────────────────────────────────────────────
// LOW-POLY 3D WORLD ASSETS & PROCEDURAL MODELS
// Pure Three.js / R3F components matching exact palette:
// Grass: #7BAE79, Dark forest: #426B4A, Sand: #D9C5A1, Stone: #8B8B83, Wood: #936B48
// ─────────────────────────────────────────────

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Low-poly Pine Tree
export function LowPolyTree({ position = [0, 0, 0], scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.4, 2, 6]} />
        <meshStandardMaterial color="#936B48" roughness={0.9} flatShading />
      </mesh>
      {/* Foliage Cone 1 (bottom) */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.6, 2, 7]} />
        <meshStandardMaterial color="#426B4A" roughness={0.8} flatShading />
      </mesh>
      {/* Foliage Cone 2 (middle) */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.3, 1.8, 7]} />
        <meshStandardMaterial color="#55825E" roughness={0.8} flatShading />
      </mesh>
      {/* Foliage Cone 3 (top) */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.9, 1.5, 7]} />
        <meshStandardMaterial color="#6B9A74" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// Low-poly Round Leaf Tree
export function LowPolyRoundTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.45, 2.4, 5]} />
        <meshStandardMaterial color="#7D5836" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.7, 0]} />
        <meshStandardMaterial color="#5F8E53" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.4, 4.2, 0.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#72A464" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// Low-poly Rock
export function LowPolyRock({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8B8B83" roughness={0.85} flatShading />
    </mesh>
  );
}

// Interactive Floating Badge / Relic
export function FloatingBadgeItem({ item, onCollect }) {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 1.5;
      ref.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 2.5) * 0.25;
    }
  });

  if (item.collected) return null;

  return (
    <group ref={ref} position={item.position}>
      {/* Core crystal */}
      <mesh castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={0.6} roughness={0.2} metalness={0.8} flatShading />
      </mesh>
      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.85, 0.05, 6, 16]} />
        <meshStandardMaterial color="#FDBA74" emissive="#F97316" emissiveIntensity={0.4} flatShading />
      </mesh>
      {/* Light aura */}
      <pointLight color="#F97316" intensity={1.5} distance={5} />
    </group>
  );
}

// Interactive Location Beacon
export function WorldBeacon({ position, color = "#F97316", label, category }) {
  const ringRef = useRef();
  
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Light column beam */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.08, 0.4, 12, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      {/* Base ring */}
      <mesh ref={ringRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.2, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      {/* Ground marker circle */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
