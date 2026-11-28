// ─────────────────────────────────────────────
// WORLD ENVIRONMENT & PROCEDURAL TERRAIN (EXPANDED 5X MAP)
// Natural low-poly / Minecraft Earth styling, 6 diverse biome zones,
// instanced nature props, enterable houses, and data-driven structures
// ─────────────────────────────────────────────

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier';
import {
  DeveloperHouse,
  TownHall,
  SkillGrounds,
  ProjectCastle,
  CommunicationTower,
  Windmill,
  VillageWell,
  MarketStall,
  Campfire,
  LakePier
} from './Buildings';
import { LowPolyTree, LowPolyRoundTree, LowPolyRock, FloatingBadgeItem, WorldBeacon } from './WorldAssets';
import { NPC } from './NPC';
import { WORLD_LOCATIONS } from '../../data/gameData';
import { WORLD_BOUNDS, WORLD_NPCS, STATIC_COLLIDERS, generateVegetationAndRocks } from '../../data/worldConfig';
import { useGameStore } from '../../store/gameStore';

export function WorldEnvironment() {
  const collectibles = useGameStore((state) => state.collectibles);
  const collectItem = useGameStore((state) => state.collectItem);

  // Generate 220 procedurally positioned trees & rocks with reproducible seed
  const { trees, rocks, dynamicColliders } = useMemo(() => {
    return generateVegetationAndRocks(220, 108);
  }, []);

  return (
    <group>
      {/* ── 1. MAIN EXPANDED ISLAND TERRAIN (Natural Gradients & Steppes) ── */}
      {/* Upper lush meadow layer */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[WORLD_BOUNDS.radius, WORLD_BOUNDS.radius + 6, 1.4, 48]} />
        <meshStandardMaterial color="#5E8C4A" roughness={0.9} flatShading />
      </mesh>

      {/* Dirt and stone sub-layer */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[WORLD_BOUNDS.radius + 6, WORLD_BOUNDS.radius + 12, 1.2, 48]} />
        <meshStandardMaterial color="#6E563B" roughness={0.92} flatShading />
      </mesh>

      {/* Sandy beach border */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[WORLD_BOUNDS.radius + 12, WORLD_BOUNDS.radius + 18, 1.0, 48]} />
        <meshStandardMaterial color="#C2B280" roughness={0.95} flatShading />
      </mesh>

      {/* ── 2. VAST SURROUNDING OCEAN WATER ── */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[WORLD_BOUNDS.waterRadius, 48]} />
        <meshStandardMaterial color="#2B7A78" roughness={0.08} metalness={0.25} transparent opacity={0.88} />
      </mesh>

      {/* ── 3. AZURE LAKE IN WEST BIOME ── */}
      <mesh position={[-50, -0.1, 40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[22, 28]} />
        <meshStandardMaterial color="#3AAFA9" roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>
      {/* Sandy Lake Shore */}
      <mesh position={[-50, -0.16, 40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[22, 26, 28]} />
        <meshStandardMaterial color="#D9C5A1" roughness={0.9} />
      </mesh>

      {/* ── 4. COBBLESTONE ROAD NETWORK ── */}
      {/* Central Village Circle */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 24]} />
        <meshStandardMaterial color="#8C887B" roughness={0.85} />
      </mesh>
      {/* Inner Decorative Stone Ring */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 7.5, 24]} />
        <meshStandardMaterial color="#A8A29E" roughness={0.8} />
      </mesh>

      {/* West Road: Village to Developer House */}
      <mesh position={[-18, 0.02, -11]} rotation={[-Math.PI / 2, 0, 0.56]}>
        <planeGeometry args={[4.2, 42]} />
        <meshStandardMaterial color="#C2B280" roughness={0.9} />
      </mesh>

      {/* Southwest Road: Village to Skill Grounds */}
      <mesh position={[-28, 0.02, 12]} rotation={[-Math.PI / 2, 0, -0.42]}>
        <planeGeometry args={[4.2, 62]} />
        <meshStandardMaterial color="#C2B280" roughness={0.9} />
      </mesh>

      {/* East Road: Village to Project Castle */}
      <mesh position={[28, 0.02, -26]} rotation={[-Math.PI / 2, 0, -0.76]}>
        <planeGeometry args={[4.4, 75]} />
        <meshStandardMaterial color="#C2B280" roughness={0.9} />
      </mesh>

      {/* Southeast Road: Village to Farmlands & Highlands */}
      <mesh position={[32, 0.02, 24]} rotation={[-Math.PI / 2, 0, 0.64]}>
        <planeGeometry args={[4.4, 80]} />
        <meshStandardMaterial color="#C2B280" roughness={0.9} />
      </mesh>

      {/* North Highway: Village to Signal Spire */}
      <mesh position={[0, 0.02, -42]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 85]} />
        <meshStandardMaterial color="#C2B280" roughness={0.9} />
      </mesh>

      {/* ── 5. MAJOR STRUCTURES ── */}
      <DeveloperHouse position={[-35, 0, -22]} />
      <TownHall position={[0, 0, 16]} />
      <SkillGrounds position={[-55, 0, 24]} />
      <ProjectCastle position={[55, 0, -52]} />
      <CommunicationTower position={[0, 0, -85]} />
      <Windmill position={[68, 0, 42]} />
      {/* Stone Well in village */}
      <VillageWell position={[0, 0, -6]} />
      <MarketStall position={[-10, 0, -7]} rotation={Math.PI / 4} stripeColor="#F97316" />
      <MarketStall position={[10, 0, -7]} rotation={-Math.PI / 4} stripeColor="#0284C7" />
      <Campfire position={[-45, 0, -50]} />
      <LakePier position={[-50, 0, 40]} rotation={0.2} />

      {/* ── 6. ALL INTERACTIVE NPCS ACROSS REALM ── */}
      {WORLD_NPCS.map((npc) => (
        <NPC
          key={npc.id}
          position={npc.position}
          name={npc.name}
          title={npc.title}
          roleColor={npc.roleColor}
        />
      ))}

      {/* ── 7. LOCATION BEACONS (Rendered cleanly only on target quest destinations) ── */}
      {WORLD_LOCATIONS.filter((loc) => loc.showBeacon).map((loc) => (
        <WorldBeacon
          key={`beacon-${loc.id}`}
          position={loc.coordinates}
          color={loc.color}
          label={loc.name}
          category={loc.category}
        />
      ))}

      {/* ── 8. COLLECTIBLE TECH RELICS ── */}
      {collectibles.map((item) => (
        <FloatingBadgeItem
          key={item.id}
          item={item}
          onCollect={() => collectItem(item.id)}
        />
      ))}

      {/* ── 9. PROCEDURAL TREES & ROCKS (220+ INSTANCES) ── */}
      {trees.map((t, idx) =>
        t.type === 'pine' ? (
          <LowPolyTree key={`tree-${idx}`} position={t.pos} scale={t.scale} rotation={t.rot} />
        ) : (
          <LowPolyRoundTree key={`tree-${idx}`} position={t.pos} scale={t.scale} />
        )
      )}

      {rocks.map((r, idx) => (
        <LowPolyRock key={`rock-${idx}`} position={r.pos} scale={r.scale} rotation={r.rot} />
      ))}

      {/* ── 10. RAPIER PHYSICS GROUND & SCENERY COLLIDERS ── */}
      {/* Ground plane collider */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <CuboidCollider args={[WORLD_BOUNDS.radius + 10, 0.5, WORLD_BOUNDS.radius + 10]} />
      </RigidBody>

      {/* Static structures and wall colliders */}
      {STATIC_COLLIDERS.map((col, idx) => (
        <RigidBody key={`sc-col-${idx}`} type="fixed" colliders={false} position={[col.x, 1.8, col.z]}>
          {col.type === 'circle' ? (
            <CylinderCollider args={[2.5, col.r]} />
          ) : (
            <CuboidCollider args={[col.hw, 2.5, col.hd]} />
          )}
        </RigidBody>
      ))}

      {/* Trees & rocks colliders */}
      {dynamicColliders.map((col, idx) => (
        <RigidBody key={`dyn-col-${idx}`} type="fixed" colliders={false} position={[col.x, 1.8, col.z]}>
          <CylinderCollider args={[2.5, col.r]} />
        </RigidBody>
      ))}
    </group>
  );
}
