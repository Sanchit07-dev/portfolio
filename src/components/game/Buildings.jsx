// ─────────────────────────────────────────────
// 3D BUILDINGS & ARCHITECTURE (LOW-POLY)
// Developer House, Skill Grounds, Project Castle, Achievement Mountain, Communication Tower
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. DEVELOPER HOUSE
export function DeveloperHouse({ position = [-28, 0, -18] }) {
  return (
    <group position={position}>
      {/* Stone Foundation */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[9, 0.8, 7.5]} />
        <meshStandardMaterial color="#8B8B83" roughness={0.9} flatShading />
      </mesh>

      {/* Main Wooden Walls */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 3.5, 6.5]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* Wooden corner beams */}
      {[
        [-3.8, 2.5, -3],
        [3.8, 2.5, -3],
        [-3.8, 2.5, 3],
        [3.8, 2.5, 3]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.6, 3.6, 0.6]} />
          <meshStandardMaterial color="#7D5836" roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* Orange/Terracotta Low-poly Roof */}
      <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[6.5, 2.8, 4]} />
        <meshStandardMaterial color="#D97706" roughness={0.7} flatShading />
      </mesh>

      {/* Chimney */}
      <mesh position={[2.5, 5.5, -1.5]} castShadow>
        <boxGeometry args={[0.9, 2.5, 0.9]} />
        <meshStandardMaterial color="#6B7280" roughness={0.9} flatShading />
      </mesh>

      {/* Front Door */}
      <mesh position={[0, 1.8, 3.3]}>
        <boxGeometry args={[1.5, 2.4, 0.2]} />
        <meshStandardMaterial color="#936B48" roughness={0.7} flatShading />
      </mesh>
      {/* Door Handle */}
      <mesh position={[0.5, 1.8, 3.42]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows with warm indoor light */}
      <mesh position={[-2.4, 2.5, 3.3]}>
        <boxGeometry args={[1.4, 1.4, 0.15]} />
        <meshStandardMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[2.4, 2.5, 3.3]}>
        <boxGeometry args={[1.4, 1.4, 0.15]} />
        <meshStandardMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={0.6} />
      </mesh>

      {/* Porch Lamp */}
      <pointLight position={[0, 3.2, 3.8]} color="#FDE047" intensity={1.5} distance={7} />
      
      {/* Front Porch Steps */}
      <mesh position={[0, 0.2, 4.3]} receiveShadow>
        <boxGeometry args={[3, 0.4, 1.6]} />
        <meshStandardMaterial color="#8B8B83" roughness={0.9} flatShading />
      </mesh>

      {/* Signpost */}
      <group position={[3.2, 0, 4.8]}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2, 6]} />
          <meshStandardMaterial color="#936B48" flatShading />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[1.8, 0.6, 0.15]} />
          <meshStandardMaterial color="#D9C5A1" flatShading />
        </mesh>
      </group>
    </group>
  );
}

// 2. SKILL TRAINING GROUNDS
export function SkillGrounds({ position = [-32, 0, 24] }) {
  const pillars = [
    { pos: [-4, 2.5, -4], label: 'Frontend' },
    { pos: [4, 2.5, -4], label: 'Backend' },
    { pos: [-4, 2.5, 4], label: 'Database' },
    { pos: [4, 2.5, 4], label: 'Tools' },
  ];

  return (
    <group position={position}>
      {/* Stone Arena Platform */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[8.5, 9, 0.5, 12]} />
        <meshStandardMaterial color="#8B8B83" roughness={0.8} flatShading />
      </mesh>
      {/* Center Rune Circle */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.5, 8]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
      </mesh>

      {/* 4 Tech Pillars */}
      {pillars.map((pillar, idx) => (
        <group key={idx} position={pillar.pos}>
          {/* Pillar Base */}
          <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.8, 1.6]} />
            <meshStandardMaterial color="#6B7280" flatShading />
          </mesh>
          {/* Pillar Column */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.7, 3.8, 6]} />
            <meshStandardMaterial color="#9CA3AF" roughness={0.85} flatShading />
          </mesh>
          {/* Floating Gem atop pillar */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#A78BFA" emissive="#7C3AED" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#8B5CF6" intensity={1} distance={5} />
        </group>
      ))}

      {/* Weapon & Training Dummies */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 1.8, 6]} />
          <meshStandardMaterial color="#936B48" flatShading />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 6]} />
          <meshStandardMaterial color="#936B48" flatShading />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#D9C5A1" flatShading />
        </mesh>
      </group>
    </group>
  );
}

// 3. PROJECT CASTLE
export function ProjectCastle({ position = [30, 0, -26] }) {
  return (
    <group position={position}>
      {/* Outer Fort Walls */}
      <mesh position={[0, 2, -5]} castShadow receiveShadow>
        <boxGeometry args={[16, 4, 2]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-7, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 4, 10]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[7, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 4, 10]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>

      {/* Main Keep / Citadel */}
      <mesh position={[0, 4.5, -4]} castShadow receiveShadow>
        <boxGeometry args={[10, 9, 8]} />
        <meshStandardMaterial color="#57534E" roughness={0.85} flatShading />
      </mesh>

      {/* Keep Roof */}
      <mesh position={[0, 10.2, -4]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[7.5, 3.5, 4]} />
        <meshStandardMaterial color="#EA580C" roughness={0.6} flatShading />
      </mesh>

      {/* Left Tower */}
      <group position={[-8, 0, -5]}>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.2, 10, 8]} />
          <meshStandardMaterial color="#6B7280" flatShading />
        </mesh>
        <mesh position={[0, 11, 0]} castShadow>
          <coneGeometry args={[2.4, 3, 8]} />
          <meshStandardMaterial color="#C2410C" flatShading />
        </mesh>
      </group>

      {/* Right Tower */}
      <group position={[8, 0, -5]}>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.2, 10, 8]} />
          <meshStandardMaterial color="#6B7280" flatShading />
        </mesh>
        <mesh position={[0, 11, 0]} castShadow>
          <coneGeometry args={[2.4, 3, 8]} />
          <meshStandardMaterial color="#C2410C" flatShading />
        </mesh>
      </group>

      {/* Castle Entrance Arch */}
      <mesh position={[0, 2.5, 1]} castShadow>
        <boxGeometry args={[4, 5, 1.5]} />
        <meshStandardMaterial color="#44403C" flatShading />
      </mesh>
      {/* Archway Cutout / Door */}
      <mesh position={[0, 1.8, 1.2]}>
        <boxGeometry args={[2.4, 3.4, 1.6]} />
        <meshStandardMaterial color="#1C1917" />
      </mesh>

      {/* Glowing Project Chests in Castle Forecourt */}
      <ProjectChest position={[-2.8, 0.5, 3.5]} color="#F97316" />
      <ProjectChest position={[0, 0.5, 4.2]} color="#FB923C" />
      <ProjectChest position={[2.8, 0.5, 3.5]} color="#F97316" />

      {/* Castle Banners */}
      <mesh position={[-3.5, 6, 0.2]} castShadow>
        <boxGeometry args={[0.8, 3, 0.05]} />
        <meshStandardMaterial color="#F97316" flatShading />
      </mesh>
      <mesh position={[3.5, 6, 0.2]} castShadow>
        <boxGeometry args={[0.8, 3, 0.05]} />
        <meshStandardMaterial color="#F97316" flatShading />
      </mesh>
    </group>
  );
}

// Interactive Project Chest
function ProjectChest({ position, color = "#F97316" }) {
  const lidRef = useRef();
  
  useFrame((state) => {
    if (lidRef.current) {
      lidRef.current.position.y = 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    }
  });

  return (
    <group position={position}>
      {/* Chest Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.7, 0.8]} />
        <meshStandardMaterial color="#936B48" roughness={0.8} flatShading />
      </mesh>
      {/* Metal Bands */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.24, 0.74, 0.4]} />
        <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} flatShading />
      </mesh>
      {/* Chest Floating Lid */}
      <mesh ref={lidRef} position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.24, 0.3, 0.84]} />
        <meshStandardMaterial color="#B45309" roughness={0.8} flatShading />
      </mesh>
      {/* Interior Glow */}
      <pointLight position={[0, 0.6, 0]} color={color} intensity={1.8} distance={3} />
    </group>
  );
}

// 4. ACHIEVEMENT MOUNTAIN
export function AchievementMountain({ position = [34, 0, 26] }) {
  return (
    <group position={position}>
      {/* Mountain Massive Base */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[11, 9, 8]} />
        <meshStandardMaterial color="#6B7280" roughness={0.9} flatShading />
      </mesh>
      {/* Mid Peaks */}
      <mesh position={[2, 8, -1]} castShadow receiveShadow>
        <coneGeometry args={[7, 7, 7]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.85} flatShading />
      </mesh>
      {/* Snowy / Crystal High Summit */}
      <mesh position={[1, 12, -0.5]} castShadow>
        <coneGeometry args={[4, 5, 6]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.4} flatShading />
      </mesh>

      {/* Crystal Trophies on summit ledge */}
      <group position={[0, 6.2, 4]}>
        {/* Stone Pedestal */}
        <mesh receiveShadow>
          <boxGeometry args={[3.5, 0.6, 2]} />
          <meshStandardMaterial color="#4B5563" flatShading />
        </mesh>
        {/* Monolith Trophy 1 */}
        <mesh position={[-1, 1.2, 0]} castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#EC4899" emissive="#BE185D" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Monolith Trophy 2 */}
        <mesh position={[1, 1.2, 0]} castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#F43F5E" emissive="#E11D48" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#EC4899" intensity={2} distance={6} />
      </group>
    </group>
  );
}

// 5. COMMUNICATION TOWER
export function CommunicationTower({ position = [0, 0, -45] }) {
  const radarRef = useRef();

  useFrame((_, delta) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group position={position}>
      {/* Octagonal Foundation Base */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 4.8, 2, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.8} flatShading />
      </mesh>

      {/* Lower Lattice Truss */}
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[2, 3.2, 8, 6]} />
        <meshStandardMaterial color="#4B5563" wireframe roughness={0.5} />
      </mesh>

      {/* Middle Observation Deck */}
      <mesh position={[0, 10.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 1, 8]} />
        <meshStandardMaterial color="#1F2937" roughness={0.8} flatShading />
      </mesh>
      {/* Observation Windows */}
      <mesh position={[0, 11.5, 0]}>
        <cylinderGeometry args={[3, 3, 1, 8]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
      </mesh>

      {/* Upper Spire Mast */}
      <mesh position={[0, 17, 0]} castShadow>
        <cylinderGeometry args={[0.3, 1.2, 10, 6]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} flatShading />
      </mesh>

      {/* Rotating Signal Antenna Dish */}
      <group ref={radarRef} position={[0, 16, 0]}>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[1.4, 0.6, 8]} />
          <meshStandardMaterial color="#F97316" metalness={0.6} roughness={0.4} flatShading />
        </mesh>
      </group>

      {/* Pulsing Beacon Sphere at the top */}
      <mesh position={[0, 22.5, 0]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, 22.5, 0]} color="#06B6D4" intensity={3} distance={20} />

      {/* Ground Control Terminal */}
      <mesh position={[0, 1.8, 3.2]} castShadow>
        <boxGeometry args={[1.8, 1.4, 0.8]} />
        <meshStandardMaterial color="#1E293B" flatShading />
      </mesh>
      {/* Hologram Screen */}
      <mesh position={[0, 2.6, 3.2]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
