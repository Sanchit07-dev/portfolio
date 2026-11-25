// ─────────────────────────────────────────────
// DEVELOPER QUEST — 3D OPEN WORLD RPG PORTFOLIO & CLASSIC VIEW
// Seamlessly merges the 3D low-poly game world with the full existing portfolio
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from './store/gameStore';

// 3D Game components
import { GameCanvas } from './components/game/GameCanvas';
import { GameErrorBoundary } from './components/ui/GameErrorBoundary';
import { HUD } from './components/ui/HUD';
import { MobileControls } from './components/ui/MobileControls';
import { GameModals } from './components/ui/GameModals';
import { CinematicIntro, PauseMenu } from './components/ui/CinematicIntro';

// Existing Portfolio components (100% preserved)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Skills from './sections/Skills.jsx';
import Services from './sections/Services.jsx';
import Projects from './sections/Projects.jsx';
import Process from './sections/Process.jsx';
import Contact from './sections/Contact.jsx';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const gameMode = useGameStore((state) => state.gameMode);
  const startAdventure = useGameStore((state) => state.startAdventure);

  // If in classic portfolio mode, render the full existing portfolio with an RPG launcher pill
  if (gameMode === 'classic') {
    return (
      <div className="relative min-h-screen bg-bg-primary text-text-primary selection:bg-orange-500/20 selection:text-neutral-900">
        {/* Floating Switch to 3D Quest Pill */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={startAdventure}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-accent transition-all transform hover:scale-105 active:scale-95 border border-white/20"
          >
            <Sparkles size={16} />
            <span>Launch 3D RPG World</span>
          </button>
        </div>

        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    );
  }

  // 3D RPG Game Mode ('intro' or 'playing')
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#A7C7E7]">
      {/* 3D Three.js Open World Canvas (guarded by an error boundary) */}
      <GameErrorBoundary>
        <GameCanvas />
      </GameErrorBoundary>

      {/* RPG HUD (MiniMap, Quest Tracker, XP bar, Interactivity) */}
      <HUD />

      {/* Touch controls for smartphones & tablets */}
      <MobileControls />

      {/* Interactive Destination Modals (Developer House, Skills, Castle, Mountain, Tower) */}
      <GameModals />

      {/* Opening Title Sequence */}
      <CinematicIntro />

      {/* Pause Menu (ESC) */}
      <PauseMenu />
    </div>
  );
}
