// ─────────────────────────────────────────────
// DEVELOPER QUEST — 3D OPEN WORLD RPG PORTFOLIO & CLASSIC VIEW
// Seamlessly merges the 3D low-poly game world with the full existing portfolio
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from './store/gameStore';

// 3D Game components
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { MobileControls } from './components/ui/MobileControls';
import { GameModals } from './components/ui/GameModals';
import { CinematicIntro, PauseMenu } from './components/ui/CinematicIntro';
import { LoadingScreen } from './components/ui/LoadingScreen';

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
import { Sparkles, Info } from 'lucide-react';

export default function App() {
  const gameState = useGameStore((state) => state.gameState);
  const gameMode = useGameStore((state) => state.gameMode);
  const startAdventure = useGameStore((state) => state.startAdventure);
  const toasts = useGameStore((state) => state.toasts);

  // If in classic portfolio mode, render the full existing portfolio with an RPG launcher pill
  if (gameState === 'classic' || gameMode === 'classic') {
    return (
      <div className="relative min-h-screen bg-bg-primary text-text-primary selection:bg-orange-500/20 selection:text-neutral-900">
        {/* Floating Switch to 3D Quest Pill */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={startAdventure}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-accent transition-all transform hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
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

  // 3D RPG Game Mode ('loading', 'menu'/'intro', 'playing', 'paused', 'modal')
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#96BFD6]">
      {/* Real Asset Loading Screen */}
      <LoadingScreen />

      {/* 3D Three.js Open World Canvas with Rapier Physics */}
      <GameCanvas />

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

      {/* Dynamic Toast Notifications (Respawn / Quality / Milestones) */}
      {toasts.length > 0 && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-neutral-900/90 text-amber-200 border border-amber-500/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in"
            >
              <Info size={14} className="text-orange-400 shrink-0" />
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
