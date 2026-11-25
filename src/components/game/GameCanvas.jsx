// ─────────────────────────────────────────────
// 3D GAME CANVAS & ENVIRONMENT LIGHTING
// Atmospheric fog, directional sunlight with crisp shadows, sky, clouds
// ─────────────────────────────────────────────

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { WorldEnvironment } from './WorldEnvironment';
import { Player } from './Player';
import { useGameStore } from '../../store/gameStore';

function WorldLighting() {
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);

  return (
    <>
      {/* Warm Ambient Fill Light */}
      <ambientLight intensity={0.65} color="#FFFFFF" />

      {/* Main Directional Sun */}
      <directionalLight
        position={[45, 55, 35]}
        intensity={1.25}
        color="#FFFBEB"
        castShadow={graphicsQuality === 'high'}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-bias={-0.0005}
      />

      {/* Sky Blue Hemisphere Bounce */}
      <hemisphereLight skyColor="#A7C7E7" groundColor="#7BAE79" intensity={0.4} />

      {/* Stylized Atmospheric Fog matching sky */}
      <fog attach="fog" args={['#A7C7E7', 35, 135]} />

      {/* Dynamic Sky Dome */}
      <Sky
        distance={450000}
        sunPosition={[45, 55, 35]}
        inclination={0.48}
        azimuth={0.25}
        turbidity={6}
        rayleigh={0.6}
      />
    </>
  );
}

export function GameCanvas() {
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#A7C7E7] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <Canvas
        shadows={graphicsQuality === 'high'}
        dpr={graphicsQuality === 'high' ? [1, 2] : [1, 1]}
        camera={{ position: [0, 6, 9], fov: 50, near: 0.1, far: 250 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <WorldLighting />
          <WorldEnvironment />
          <Player />
        </Suspense>
      </Canvas>
    </div>
  );
}
