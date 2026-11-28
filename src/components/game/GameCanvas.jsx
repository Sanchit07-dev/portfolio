// ─────────────────────────────────────────────
// 3D GAME CANVAS & RAPIER PHYSICS INTEGRATION
// Wraps the scene in Rapier Physics, dynamic FPS quality auto-scaler,
// dynamic shadow maps, and directional sun/ambient lighting
// ─────────────────────────────────────────────

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { WorldEnvironment } from './WorldEnvironment';
import { Player } from './Player';
import { useGameStore } from '../../store/gameStore';

function FPSMonitor() {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const recordFPS = useGameStore((state) => state.recordFPS);

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Evaluate average FPS every 1 second
    if (elapsed >= 1000) {
      const currentFPS = Math.round((frameCount.current * 1000) / elapsed);
      recordFPS(currentFPS);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

function WorldLighting() {
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);
  const isHigh = graphicsQuality === 'high';

  return (
    <>
      {/* Warm Ambient Fill */}
      <ambientLight intensity={isHigh ? 0.72 : 0.85} color="#FFFDF5" />

      {/* Directional Sun with Soft Shadow Map */}
      <directionalLight
        position={[65, 85, 45]}
        intensity={isHigh ? 1.4 : 1.2}
        color="#FFF6E0"
        castShadow={isHigh}
        shadow-mapSize-width={isHigh ? 2048 : 512}
        shadow-mapSize-height={isHigh ? 2048 : 512}
        shadow-camera-near={1.0}
        shadow-camera-far={260}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0004}
      />

      {/* Sky Blue & Grass Green Hemisphere Bounce */}
      <hemisphereLight skyColor="#87CEEB" groundColor="#4F7942" intensity={0.45} />

      {/* Natural Atmospheric Distance Fog */}
      <fog attach="fog" args={['#96BFD6', isHigh ? 50 : 35, isHigh ? 250 : 180]} />

      {/* Dynamic Sky Dome */}
      <Sky
        distance={450000}
        sunPosition={[65, 85, 45]}
        inclination={0.52}
        azimuth={0.22}
        turbidity={4}
        rayleigh={0.5}
      />
    </>
  );
}

export function GameCanvas() {
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);
  const isHigh = graphicsQuality === 'high';

  return (
    <div className="absolute inset-0 w-full h-full bg-[#96BFD6] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <Canvas
        shadows={isHigh}
        dpr={isHigh ? [1, 2] : [1, 1]}
        camera={{ position: [0, 8, 12], fov: 50, near: 0.1, far: 380 }}
        gl={{ antialias: isHigh, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <FPSMonitor />
          <WorldLighting />
          <Physics gravity={[0, -25, 0]} timeStep="vary">
            <WorldEnvironment />
            <Player />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
