// ─────────────────────────────────────────────
// NPC CHARACTERS & QUEST MARKERS (LOW-POLY)
// Interactive non-player guides at Spawn, House, Castle, Skills, Mountain, Tower
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function NPC({ position, name, title, roleColor = '#F97316' }) {
  const groupRef = useRef();
  const markerRef = useRef();

  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.position.y = 2.6 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      markerRef.current.rotation.y = state.clock.elapsedTime * 1.5;
    }
    if (groupRef.current) {
      // Gentle breathing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Floating Quest Exclamation Marker */}
      <group ref={markerRef} position={[0, 2.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.6, 0.22]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Floating 3D Name Tag */}
      <Text
        position={[0, 2.1, 0]}
        fontSize={0.28}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#1C1917"
      >
        {name}
      </Text>

      {/* Low-poly Humanoid NPC Mesh */}
      {/* Head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.42, 0.44, 0.42]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.7} flatShading />
      </mesh>
      {/* Hair / Hat */}
      <mesh position={[0, 1.78, 0]} castShadow>
        <boxGeometry args={[0.46, 0.18, 0.46]} />
        <meshStandardMaterial color={roleColor} roughness={0.6} flatShading />
      </mesh>
      {/* Torso / Robe */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.6, 0.75, 0.4]} />
        <meshStandardMaterial color={roleColor} roughness={0.8} flatShading />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.62, 0.12, 0.42]} />
        <meshStandardMaterial color="#78350F" flatShading />
      </mesh>
      {/* Robe Lower / Legs */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.55, 0.6, 0.38]} />
        <meshStandardMaterial color="#292524" roughness={0.8} flatShading />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.4, 0.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.65, 0.2]} />
        <meshStandardMaterial color={roleColor} flatShading />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.4, 0.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.65, 0.2]} />
        <meshStandardMaterial color={roleColor} flatShading />
      </mesh>

      {/* Aura Base Pad */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshBasicMaterial color={roleColor} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
