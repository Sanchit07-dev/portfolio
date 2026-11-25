// ─────────────────────────────────────────────
// WORLD ENVIRONMENT & PROCEDURAL TERRAIN
// Master landscape: Low-poly undulating islands, river, bridges, pathways, forests
// ─────────────────────────────────────────────

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { LowPolyTree, LowPolyRoundTree, LowPolyRock, FloatingBadgeItem, WorldBeacon } from './WorldAssets';
import { DeveloperHouse, SkillGrounds, ProjectCastle, AchievementMountain, CommunicationTower } from './Buildings';
import { NPC } from './NPC';
import { WORLD_LOCATIONS } from '../../data/gameData';
import { useGameStore } from '../../store/gameStore';

export function WorldEnvironment() {
  const collectibles = useGameStore((state) => state.collectibles);
  const collectItem = useGameStore((state) => state.collectItem);

  // Generate scenic natural trees and boulders across coordinates
  const naturalScenery = useMemo(() => {
    const trees = [];
    const rocks = [];
    
    // Seeded pseudo-random positioning for reproducible aesthetic layout
    const rng = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 75; i++) {
      const x = (rng(i * 1.3) - 0.5) * 90;
      const z = (rng(i * 2.7) - 0.5) * 90;
      
      // Avoid placing right on major buildings or spawn center
      const distSpawn = Math.sqrt(x * x + z * z);
      const distHouse = Math.hypot(x - (-28), z - (-18));
      const distCastle = Math.hypot(x - 30, z - (-26));
      const distSkills = Math.hypot(x - (-32), z - 24);
      const distMountain = Math.hypot(x - 34, z - 26);
      const distTower = Math.hypot(x - 0, z - (-45));

      if (
        distSpawn > 7 &&
        distHouse > 8 &&
        distCastle > 12 &&
        distSkills > 9 &&
        distMountain > 11 &&
        distTower > 8
      ) {
        if (i % 3 === 0) {
          trees.push({ type: 'round', pos: [x, 0, z], scale: 0.8 + rng(i) * 0.5 });
        } else if (i % 3 === 1) {
          trees.push({ type: 'pine', pos: [x, 0, z], scale: 0.8 + rng(i) * 0.6, rot: rng(i * 4) * Math.PI });
        } else {
          rocks.push({
            pos: [x, 0.4 * rng(i), z],
            scale: [0.8 + rng(i), 0.6 + rng(i * 2), 0.8 + rng(i * 3)],
            rot: [rng(i), rng(i * 5), rng(i * 7)]
          });
        }
      }
    }
    return { trees, rocks };
  }, []);

  return (
    <group>
      {/* 1. MAIN ISLAND GROUND (Low-poly Grass) */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[55, 58, 1.2, 32]} />
        <meshStandardMaterial color="#7BAE79" roughness={0.88} flatShading />
      </mesh>

      {/* Dark Forest outer perimeter rim */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[58, 62, 1, 32]} />
        <meshStandardMaterial color="#426B4A" roughness={0.92} flatShading />
      </mesh>

      {/* Sandy Beach Shore */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[62, 66, 0.8, 28]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.95} flatShading />
      </mesh>

      {/* 2. SURROUNDING OCEAN WATER */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[140, 32]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* 3. COBBLESTONE PATHWAYS CONNECTING DESTINATIONS */}
      {/* Path: Spawn to House */}
      <mesh position={[-14, 0.02, -9]} rotation={[-Math.PI / 2, 0, 0.58]}>
        <planeGeometry args={[4, 34]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>
      {/* Path: Spawn to Skills */}
      <mesh position={[-16, 0.02, 12]} rotation={[-Math.PI / 2, 0, -0.62]}>
        <planeGeometry args={[4, 38]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>
      {/* Path: Spawn to Castle */}
      <mesh position={[15, 0.02, -13]} rotation={[-Math.PI / 2, 0, -0.72]}>
        <planeGeometry args={[4.2, 40]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>
      {/* Path: Spawn to Mountain */}
      <mesh position={[17, 0.02, 13]} rotation={[-Math.PI / 2, 0, 0.65]}>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>
      {/* Path: Spawn to Tower */}
      <mesh position={[0, 0.02, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 45]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>

      {/* 4. CENTRAL SPAWN PLAZA */}
      <group position={[0, 0.05, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[5, 5.4, 0.2, 16]} />
          <meshStandardMaterial color="#8B8B83" roughness={0.85} flatShading />
        </mesh>
        {/* Decorative inner compass ring */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3.2, 16]} />
          <meshBasicMaterial color="#F97316" transparent opacity={0.4} />
        </mesh>
        {/* Center Fountain */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.8, 1, 10]} />
          <meshStandardMaterial color="#6B7280" flatShading />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 10]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} />
        </mesh>
        {/* Fountain Jet Pillar */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 1.2, 6]} />
          <meshStandardMaterial color="#9CA3AF" flatShading />
        </mesh>
      </group>

      {/* 5. MEANDERING RIVER & WOODEN BRIDGES */}
      {/* River Bed Cut */}
      <mesh position={[-6, 0.01, 10]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <planeGeometry args={[5, 28]} />
        <meshStandardMaterial color="#0284C7" roughness={0.2} transparent opacity={0.8} />
      </mesh>
      {/* Wooden Arch Bridge over river */}
      <group position={[-10, 0.35, 8]} rotation={[0, 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.4, 7]} />
          <meshStandardMaterial color="#936B48" roughness={0.8} flatShading />
        </mesh>
        {/* Bridge Side Rails */}
        <mesh position={[-2, 0.7, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 7]} />
          <meshStandardMaterial color="#78350F" flatShading />
        </mesh>
        <mesh position={[2, 0.7, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 7]} />
          <meshStandardMaterial color="#78350F" flatShading />
        </mesh>
      </group>

      {/* 6. MAJOR RPG BUILDINGS */}
      <DeveloperHouse />
      <SkillGrounds />
      <ProjectCastle />
      <AchievementMountain />
      <CommunicationTower />

      {/* 7. LOCATION GUIDES & BEACONS */}
      {WORLD_LOCATIONS.map((loc) => (
        <group key={loc.id}>
          <WorldBeacon position={loc.coordinates} color={loc.color} label={loc.name} category={loc.category} />
          {/* NPC for this location positioned nearby */}
          <NPC
            position={[
              loc.coordinates[0] + (loc.id === 'spawn' ? 2.5 : 3.2),
              0,
              loc.coordinates[2] + (loc.id === 'spawn' ? 1.5 : 2.5)
            ]}
            name={loc.npcName}
            title={loc.npcTitle}
            roleColor={loc.color}
          />
        </group>
      ))}

      {/* 8. COLLECTIBLE RELICS / TECH BADGES */}
      {collectibles.map((item) => (
        <FloatingBadgeItem
          key={item.id}
          item={item}
          onCollect={() => collectItem(item.id)}
        />
      ))}

      {/* 9. SCENIC VEGETATION & ROCKS */}
      {naturalScenery.trees.map((t, idx) =>
        t.type === 'round' ? (
          <LowPolyRoundTree key={`tree-${idx}`} position={t.pos} scale={t.scale} />
        ) : (
          <LowPolyTree key={`tree-${idx}`} position={t.pos} scale={t.scale} rotation={t.rot} />
        )
      )}
      {naturalScenery.rocks.map((r, idx) => (
        <LowPolyRock key={`rock-${idx}`} position={r.pos} scale={r.scale} rotation={r.rot} />
      ))}
    </group>
  );
}
