// Physical playground: pushable props, ramps, jump pads, bridge and tunnel.
// Prop motion is stepped by toyPhysics and reset with the world button.

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { soundManager } from '../../utils/soundManager';
import { PLAYGROUND_PROPS, QUALITY_PRESETS, TERRAIN_FEATURES } from '../../config/toyWorld';
import { createProp, staticColliders, stepProps } from '../../physics/toyPhysics';

function letterMaterial(letter, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#3F342C';
  ctx.font = '700 78px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 70);
  const texture = new THREE.CanvasTexture(canvas);
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6 });
}

function TerrainDressing() {
  return (
    <group>
      {TERRAIN_FEATURES.map((feature) => {
        if (feature.kind === 'pad') {
          return (
            <mesh key={feature.id} position={[feature.x, 0.08, feature.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[feature.r, 20]} />
              <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={0.55} />
            </mesh>
          );
        }
        if (feature.kind === 'wall') {
          return (
            <mesh key={feature.id} position={[feature.x, 1.6, feature.z]} castShadow receiveShadow>
              <boxGeometry args={[feature.hw * 2, 3.2, feature.hd * 2]} />
              <meshStandardMaterial color="#CDB4DB" roughness={0.7} />
            </mesh>
          );
        }
        const length = feature.hd * 2;
        const angle = feature.kind === 'ramp' ? Math.atan2(feature.height, length) : 0;
        const lift = feature.kind === 'deck' ? feature.height : feature.height * 0.45;
        return (
          <group key={feature.id} position={[feature.x, lift, feature.z]} rotation={[0, feature.yaw || 0, 0]}>
            <mesh rotation={[feature.kind === 'ramp' ? -angle : 0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[feature.hw * 2, 0.28, length]} />
              <meshStandardMaterial color={feature.kind === 'deck' ? '#E7D3A1' : '#F0D7A8'} roughness={0.85} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[3.6, 2.55, -28]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[2.4, 0.28, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#F6BD60" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Playground() {
  const propsRef = useRef(null);
  const seenReset = useRef(0);
  const seenKonami = useRef(0);
  const bumpLock = useRef(0);
  const meshes = useRef([]);

  const materials = useMemo(() => {
    const map = {};
    PLAYGROUND_PROPS.forEach((def) => {
      if (def.letter) map[def.id] = letterMaterial(def.letter, def.color);
    });
    return map;
  }, []);

  const freshProps = () => PLAYGROUND_PROPS.map((def) => createProp(def));
  if (!propsRef.current) propsRef.current = freshProps();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const state = useGameStore.getState();
    if (state.resetNonce !== seenReset.current) {
      seenReset.current = state.resetNonce;
      propsRef.current = freshProps();
    }
    if (state.konamiNonce !== seenKonami.current) {
      seenKonami.current = state.konamiNonce;
      const player = state.playerPos;
      propsRef.current.push(createProp({
        id: `konami-ball-${state.konamiNonce}`,
        kind: 'sphere',
        x: player[0] + 2,
        z: player[2] + 2,
        y: 2,
        r: 1.4,
        mass: 0.8,
        color: '#F4D35E',
      }));
    }

    if (state.gameMode === 'playing' && !state.isPaused) {
      const treeCount = QUALITY_PRESETS[state.graphicsQuality]?.treeCount || 140;
      const player = state.playerPos;
      stepProps(propsRef.current, { x: player[0], z: player[2], vx: 0, vz: 0 }, dt, staticColliders(treeCount), () => {
        if (performance.now() - bumpLock.current > 120) {
          bumpLock.current = performance.now();
          soundManager.playBump();
        }
      });
    }

    // The car body is not in this solver's velocity, so push from the live vehicle
    // by reading the latest player position delta is weak. Vehicle writes speed via
    // a shared car snapshot below.
    const carSnap = window.__toyCar;
    if (carSnap && state.gameMode === 'playing' && !state.isPaused) {
      const treeCount = QUALITY_PRESETS[state.graphicsQuality]?.treeCount || 140;
      stepProps(propsRef.current, carSnap, 0, staticColliders(treeCount), () => {});
    }

    const pins = propsRef.current.filter((prop) => prop.kind === 'pin');
    if (pins.length && pins.every((pin) => pin.knocked)) state.registerPins();

    propsRef.current.forEach((prop, index) => {
      const mesh = meshes.current[index];
      if (!mesh) return;
      const lift = prop.hh || prop.r || 0.4;
      mesh.position.set(prop.x, prop.y + lift, prop.z);
      mesh.rotation.y = prop.ry;
      mesh.rotation.z = prop.kind === 'pin' && prop.knocked ? 1.1 : prop.ang * 0.02;
    });
  });

  return (
    <group>
      <TerrainDressing />
      {propsRef.current.map((prop, index) => (
        <mesh
          key={prop.id}
          ref={(node) => { meshes.current[index] = node; }}
          castShadow
          material={materials[prop.id]}
        >
          {prop.kind === 'sphere' && <sphereGeometry args={[prop.r, 16, 16]} />}
          {prop.kind === 'cylinder' && <cylinderGeometry args={[prop.r, prop.r, prop.hh * 2, 12]} />}
          {prop.kind === 'cone' && <coneGeometry args={[prop.r, prop.hh * 2, 10]} />}
          {(prop.kind === 'pin') && <cylinderGeometry args={[prop.r, prop.r * 0.45, prop.hh * 2, 8]} />}
          {(prop.kind === 'box' && !materials[prop.id]) && <boxGeometry args={[prop.hw * 2, prop.hh * 2, prop.hd * 2]} />}
          {prop.kind === 'box' && materials[prop.id] && <boxGeometry args={[prop.hw * 2, prop.hh * 2, prop.hd * 2]} />}
          {!materials[prop.id] && prop.kind !== 'sphere' && (
            <meshStandardMaterial color={prop.color} roughness={0.55} />
          )}
          {prop.kind === 'sphere' && <meshStandardMaterial color={prop.color} roughness={0.4} />}
        </mesh>
      ))}
    </group>
  );
}
