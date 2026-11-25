// ─────────────────────────────────────────────
// 3D BUILDINGS & ARCHITECTURE (ENTERABLE & EXPANDED)
// Enterable Developer House (with open doorway, desk, interior),
// Town Hall, Project Castle, Skill Grounds, Communication Tower,
// Windmill, Village Well, Market Stalls, Lake Pier, Campfire
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. ENTERABLE DEVELOPER HOUSE
// Total footprint: width 10 (x: -5 to +5), depth 8 (z: -4 to +4)
// Front wall has open doorway at center (x: -1.2 to +1.2, z: 4)
export function DeveloperHouse({ position = [-35, 0, -22] }) {
  return (
    <group position={position}>
      {/* ── Floor / Foundation ── */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.2, 8.2]} />
        <meshStandardMaterial color="#8B8B83" roughness={0.9} flatShading />
      </mesh>
      {/* Interior Wood Plank Flooring */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[9.6, 0.05, 7.6]} />
        <meshStandardMaterial color="#936B48" roughness={0.7} />
      </mesh>

      {/* ── Back Wall (z = -4) ── */}
      <mesh position={[0, 2, -4]} castShadow receiveShadow>
        <boxGeometry args={[10, 3.8, 0.4]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* ── Left Wall (x = -5) ── */}
      <mesh position={[-5, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 3.8, 8]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* ── Right Wall (x = 5) ── */}
      <mesh position={[5, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 3.8, 8]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* ── Front Wall Left Section (x = -3.2, z = 4) ── */}
      <mesh position={[-3.2, 2, 4]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 3.8, 0.4]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* ── Front Wall Right Section (x = 3.2, z = 4) ── */}
      <mesh position={[3.2, 2, 4]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 3.8, 0.4]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.8} flatShading />
      </mesh>

      {/* ── Doorway Lintel / Header (Above open door, x = 0, z = 4, y = 3.3) ── */}
      <mesh position={[0, 3.4, 4]} castShadow>
        <boxGeometry args={[2.8, 1.0, 0.42]} />
        <meshStandardMaterial color="#7D5836" roughness={0.9} flatShading />
      </mesh>

      {/* ── Wooden Corner Pillars ── */}
      {[
        [-5, 2, -4],
        [5, 2, -4],
        [-5, 2, 4],
        [5, 2, 4]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.6, 4.0, 0.6]} />
          <meshStandardMaterial color="#7D5836" roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* ── Roof (pitched over the house) ── */}
      <mesh position={[0, 4.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[7.8, 2.8, 4]} />
        <meshStandardMaterial color="#C2410C" roughness={0.7} flatShading />
      </mesh>

      {/* Chimney */}
      <mesh position={[3.2, 5.2, -2]} castShadow>
        <boxGeometry args={[1, 2.6, 1]} />
        <meshStandardMaterial color="#6B7280" roughness={0.9} flatShading />
      </mesh>

      {/* ── INTERIOR WORKSHOP FURNITURE (Walk inside to see) ── */}
      {/* Developer Desk against back wall */}
      <group position={[0, 0.22, -2.6]}>
        {/* Table Top */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.12, 1.4]} />
          <meshStandardMaterial color="#78350F" roughness={0.6} />
        </mesh>
        {/* Table Legs */}
        {[-1.2, 1.2].map((x) =>
          [-0.5, 0.5].map((z, j) => (
            <mesh key={`${x}-${j}`} position={[x, 0.55, z]} castShadow>
              <boxGeometry args={[0.1, 1.0, 0.1]} />
              <meshStandardMaterial color="#451A03" />
            </mesh>
          ))
        )}

        {/* Laptop */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.65, 0.04, 0.45]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Laptop Screen (glowing) */}
        <mesh position={[0, 1.45, -0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.65, 0.45, 0.04]} />
          <meshStandardMaterial color="#0284C7" emissive="#38BDF8" emissiveIntensity={0.8} />
        </mesh>

        {/* Coffee Mug */}
        <mesh position={[0.7, 1.22, 0.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 8]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>

        {/* Warm Desk Lamp */}
        <pointLight position={[0, 2.2, -1.8]} color="#FEF08A" intensity={1.5} distance={8} />
      </group>

      {/* Bookshelf against left interior wall */}
      <group position={[-4.2, 0.22, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 2.6, 2.2]} />
          <meshStandardMaterial color="#5C2C16" />
        </mesh>
        {/* Books on shelf */}
        <mesh position={[0.2, 1.6, 0]}>
          <boxGeometry args={[0.3, 0.4, 1.8]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        <mesh position={[0.2, 2.2, 0]}>
          <boxGeometry args={[0.3, 0.4, 1.6]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Cozy Rug on the floor */}
      <mesh position={[0, 0.25, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 2.4]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.9} />
      </mesh>

      {/* Porch Welcome Mat outside open doorway */}
      <mesh position={[0, 0.12, 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshStandardMaterial color="#78350F" roughness={0.95} />
      </mesh>

      {/* Porch Lantern */}
      <pointLight position={[1.6, 2.8, 4.4]} color="#FDE047" intensity={1.2} distance={6} />
    </group>
  );
}

// 2. VILLAGE TOWN HALL / SHOWCASE BUILDING
export function TownHall({ position = [0, 0, 16] }) {
  return (
    <group position={position}>
      {/* Foundation Platform */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[13, 0.6, 10]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>

      {/* Main Stone Walls */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 5.2, 9]} />
        <meshStandardMaterial color="#A8A29E" roughness={0.8} flatShading />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 6.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[10, 3.2, 4]} />
        <meshStandardMaterial color="#1E3A8A" roughness={0.6} flatShading />
      </mesh>

      {/* Grand Columns in front */}
      {[-4.5, -1.8, 1.8, 4.5].map((x, i) => (
        <mesh key={i} position={[x, 3, 5]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 5.2, 8]} />
          <meshStandardMaterial color="#E7E5E4" roughness={0.7} flatShading />
        </mesh>
      ))}

      {/* Clock / Crest Tower on roof */}
      <mesh position={[0, 9.2, 0]} castShadow>
        <boxGeometry args={[2.5, 3.5, 2.5]} />
        <meshStandardMaterial color="#78716C" flatShading />
      </mesh>
      <mesh position={[0, 11.6, 0]} castShadow>
        <coneGeometry args={[2, 2.2, 4]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.4} flatShading />
      </mesh>

      {/* Large Front Archway Door */}
      <mesh position={[0, 2.2, 4.6]}>
        <boxGeometry args={[2.8, 3.8, 0.2]} />
        <meshStandardMaterial color="#1C1917" />
      </mesh>
    </group>
  );
}

// 3. SKILL TRAINING GROUNDS
export function SkillGrounds({ position = [-55, 0, 24] }) {
  const pillars = [
    { pos: [-5, 2.5, -5], label: 'Frontend' },
    { pos: [5, 2.5, -5], label: 'Backend' },
    { pos: [-5, 2.5, 5], label: 'Database' },
    { pos: [5, 2.5, 5], label: 'Tools' },
  ];

  return (
    <group position={position}>
      {/* Stone Arena Platform */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[10, 10.6, 0.5, 16]} />
        <meshStandardMaterial color="#78716C" roughness={0.8} flatShading />
      </mesh>

      {/* Center Rune Ring */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 4.2, 12]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
      </mesh>

      {/* 4 Tech Pillars */}
      {pillars.map((pillar, idx) => (
        <group key={idx} position={pillar.pos}>
          <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.8, 1.8]} />
            <meshStandardMaterial color="#57534E" flatShading />
          </mesh>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.8, 4.2, 6]} />
            <meshStandardMaterial color="#A8A29E" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color="#A78BFA" emissive="#7C3AED" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 2.8, 0]} color="#8B5CF6" intensity={1.2} distance={6} />
        </group>
      ))}

      {/* Center Training Target Dummy */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 1.8, 6]} />
          <meshStandardMaterial color="#936B48" flatShading />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2.0, 6]} />
          <meshStandardMaterial color="#936B48" flatShading />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow>
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#D9C5A1" flatShading />
        </mesh>
      </group>
    </group>
  );
}

// 4. PROJECT CASTLE
export function ProjectCastle({ position = [55, 0, -52] }) {
  return (
    <group position={position}>
      {/* Outer Fort Walls */}
      <mesh position={[0, 2.5, -6]} castShadow receiveShadow>
        <boxGeometry args={[18, 5, 2.5]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-8, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 5, 12]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[8, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 5, 12]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>

      {/* Main Keep */}
      <mesh position={[0, 5.5, -5]} castShadow receiveShadow>
        <boxGeometry args={[12, 10, 10]} />
        <meshStandardMaterial color="#57534E" roughness={0.85} flatShading />
      </mesh>

      {/* Keep Roof */}
      <mesh position={[0, 11.5, -5]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[9, 4.2, 4]} />
        <meshStandardMaterial color="#EA580C" roughness={0.6} flatShading />
      </mesh>

      {/* Left Tower */}
      <group position={[-9, 0, -6]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.6, 12, 8]} />
          <meshStandardMaterial color="#6B7280" flatShading />
        </mesh>
        <mesh position={[0, 13, 0]} castShadow>
          <coneGeometry args={[2.8, 3.5, 8]} />
          <meshStandardMaterial color="#C2410C" flatShading />
        </mesh>
      </group>

      {/* Right Tower */}
      <group position={[9, 0, -6]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.6, 12, 8]} />
          <meshStandardMaterial color="#6B7280" flatShading />
        </mesh>
        <mesh position={[0, 13, 0]} castShadow>
          <coneGeometry args={[2.8, 3.5, 8]} />
          <meshStandardMaterial color="#C2410C" flatShading />
        </mesh>
      </group>

      {/* Castle Entrance Arch */}
      <mesh position={[0, 3, 1]} castShadow>
        <boxGeometry args={[5, 6, 2]} />
        <meshStandardMaterial color="#44403C" flatShading />
      </mesh>
      {/* Archway Cutout */}
      <mesh position={[0, 2.2, 1.2]}>
        <boxGeometry args={[3, 4.2, 2.2]} />
        <meshStandardMaterial color="#1C1917" />
      </mesh>

      {/* Glowing Project Chests in Castle Forecourt */}
      <ProjectChest position={[-3.5, 0.5, 4.5]} color="#F97316" />
      <ProjectChest position={[0, 0.5, 5.2]} color="#FB923C" />
      <ProjectChest position={[3.5, 0.5, 4.5]} color="#F97316" />
    </group>
  );
}

function ProjectChest({ position, color = "#F97316" }) {
  const lidRef = useRef();
  
  useFrame((state) => {
    if (lidRef.current) {
      lidRef.current.position.y = 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    }
  });

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.75, 0.9]} />
        <meshStandardMaterial color="#936B48" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.34, 0.79, 0.45]} />
        <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} flatShading />
      </mesh>
      <mesh ref={lidRef} position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.34, 0.32, 0.94]} />
        <meshStandardMaterial color="#B45309" roughness={0.8} flatShading />
      </mesh>
      <pointLight position={[0, 0.7, 0]} color={color} intensity={2} distance={4} />
    </group>
  );
}

// 5. COMMUNICATION TOWER (WITH ACCESSIBLE SIGNAL TERMINAL)
export function CommunicationTower({ position = [0, 0, -85] }) {
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
        <cylinderGeometry args={[4, 5, 2, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.8} flatShading />
      </mesh>

      {/* Lower Lattice Truss */}
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[2, 3.4, 8, 6]} />
        <meshStandardMaterial color="#4B5563" wireframe roughness={0.5} />
      </mesh>

      {/* Middle Observation Deck */}
      <mesh position={[0, 10.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.8, 3.8, 1, 8]} />
        <meshStandardMaterial color="#1F2937" roughness={0.8} flatShading />
      </mesh>
      {/* Observation Windows */}
      <mesh position={[0, 11.5, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 1, 8]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
      </mesh>

      {/* Spire Mast */}
      <mesh position={[0, 17, 0]} castShadow>
        <cylinderGeometry args={[0.3, 1.2, 10, 6]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} flatShading />
      </mesh>

      {/* Rotating Signal Antenna Dish */}
      <group ref={radarRef} position={[0, 16, 0]}>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[1.5, 0.6, 8]} />
          <meshStandardMaterial color="#F97316" metalness={0.6} roughness={0.4} flatShading />
        </mesh>
      </group>

      {/* Top Beacon Sphere */}
      <mesh position={[0, 22.5, 0]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={1.8} />
      </mesh>
      <pointLight position={[0, 22.5, 0]} color="#06B6D4" intensity={3.5} distance={25} />

      {/* Ground Control Terminal Console (placed at comfortable interaction distance) */}
      <group position={[0, 0, 3.8]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.4, 1.0]} />
          <meshStandardMaterial color="#1E293B" flatShading />
        </mesh>
        <mesh position={[0, 1.95, 0]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[1.8, 1.1]} />
          <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0, 2.2, 0.5]} color="#06B6D4" intensity={1.5} distance={5} />
      </group>
    </group>
  );
}

// 6. FARMLAND WINDMILL
export function Windmill({ position = [68, 0, 42] }) {
  const sailsRef = useRef();

  useFrame((_, delta) => {
    if (sailsRef.current) {
      sailsRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Stone / Timber Base */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.8, 8, 8]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} flatShading />
      </mesh>
      {/* Conical Roof Cap */}
      <mesh position={[0, 9.2, 0]} castShadow>
        <coneGeometry args={[3.2, 2.6, 8]} />
        <meshStandardMaterial color="#78350F" flatShading />
      </mesh>

      {/* Rotating Sails Hub */}
      <group position={[0, 8, 3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
        {/* 4 Blades */}
        <group ref={sailsRef}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <group key={idx} rotation={[0, 0, angle]}>
              <mesh position={[0, 3.2, 0]} castShadow>
                <boxGeometry args={[0.7, 5.5, 0.08]} />
                <meshStandardMaterial color="#FAFAFA" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Fenced Farm Crops Field */}
      <mesh position={[-6, 0.05, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#A16207" roughness={0.9} />
      </mesh>
      {/* Crop Rows */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[-6 + x, 0.25, 0]}>
          <boxGeometry args={[0.6, 0.4, 8]} />
          <meshStandardMaterial color="#84CC16" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 7. VILLAGE STONE WELL
export function VillageWell({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Stone Rim */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 1.2, 10]} />
        <meshStandardMaterial color="#78716C" roughness={0.85} flatShading />
      </mesh>
      {/* Water Surface inside */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.1, 10]} />
        <meshStandardMaterial color="#0284C7" roughness={0.1} />
      </mesh>
      {/* Wooden Roof Support Posts */}
      <mesh position={[-1.2, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      <mesh position={[1.2, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      {/* Gabled Roof */}
      <mesh position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2, 1.2, 4]} />
        <meshStandardMaterial color="#C2410C" flatShading />
      </mesh>
    </group>
  );
}

// 8. VILLAGE MARKET STALL
export function MarketStall({ position = [0, 0, 0], rotation = 0, stripeColor = "#F97316" }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wooden Counter */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.2, 1.4]} />
        <meshStandardMaterial color="#936B48" roughness={0.8} flatShading />
      </mesh>
      {/* Roof Canopy */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[3.2, 0.15, 1.8]} />
        <meshStandardMaterial color={stripeColor} roughness={0.6} />
      </mesh>
      {/* Posts */}
      {[-1.3, 1.3].map((x) =>
        [-0.6, 0.6].map((z, j) => (
          <mesh key={`${x}-${j}`} position={[x, 1.5, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        ))
      )}
    </group>
  );
}

// 9. WOODLAND CAMPFIRE
export function Campfire({ position = [-45, 0, -50] }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Circle of Stones */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <torusGeometry args={[0.8, 0.18, 6, 8]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} flatShading />
      </mesh>
      {/* Logs */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 5]} rotation={[0, 0, Math.PI / 4]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 5]} rotation={[0, 0, -Math.PI / 4]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
      {/* Animated Low-Poly Fire Core */}
      <mesh ref={flameRef} position={[0, 0.6, 0]}>
        <coneGeometry args={[0.4, 0.8, 5]} />
        <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 0.8, 0]} color="#F97316" intensity={2.2} distance={8} />
    </group>
  );
}

// 10. LAKE PIER
export function LakePier({ position = [-50, 0, 40], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Boardwalk Planks */}
      <mesh position={[0, 0.35, 4]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.3, 10]} />
        <meshStandardMaterial color="#936B48" roughness={0.8} flatShading />
      </mesh>
      {/* Pilings in water */}
      {[-1.3, 1.3].map((x) =>
        [1, 5, 8].map((z, j) => (
          <mesh key={`${x}-${j}`} position={[x, -0.4, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 1.8, 6]} />
            <meshStandardMaterial color="#451A03" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}
