// ─────────────────────────────────────────────
// 3D GAME CANVAS & ENVIRONMENT LIGHTING (REALISTIC LOW-POLY & SHADOWS)
// Atmospheric natural distance fog, directional sun with soft shadow bias,
// hemisphere fill bounce, sky dome
// ─────────────────────────────────────────────

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { WorldEnvironment } from './WorldEnvironment';
import { Player } from './Player';
import { useGameStore } from '../../store/gameStore';
import { SceneErrorBoundary, SceneErrorFallback } from '../ui/GameErrorBoundary';
import { WorldLoadMonitor } from '../ui/WorldLoadMonitor';

function WorldLighting() {
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);

  return (
    <>
      {/* Warm Ambient Fill */}
      <ambientLight intensity={0.7} color="#FFFDF5" />

      {/* Directional Sun with Soft Shadow Map */}
      <directionalLight
        position={[65, 85, 45]}
        intensity={1.35}
        color="#FFF6E0"
        castShadow={graphicsQuality === 'high'}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
      <fog attach="fog" args={['#96BFD6', 45, 240]} />

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
  const sceneError = useGameStore((state) => state.sceneError);
  const sceneNonce = useGameStore((state) => state.sceneNonce);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#96BFD6] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      {sceneError ? (
        <SceneErrorFallback />
      ) : (
        <Canvas
          key={sceneNonce}
          shadows={graphicsQuality === 'high'}
          dpr={graphicsQuality === 'high' ? [1, 2] : [1, 1]}
          camera={{ position: [0, 8, 12], fov: 50, near: 0.1, far: 380 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <SceneErrorBoundary>
              <WorldLighting />
              <WorldEnvironment />
              <Player />
            </SceneErrorBoundary>
          </Suspense>
        </Canvas>
      )}
      <WorldLoadMonitor />
    </div>
  );
}
