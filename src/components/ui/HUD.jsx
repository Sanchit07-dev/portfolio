// ─────────────────────────────────────────────
// RPG HUD & FANTASY GAME UI PANELS
// Themed with rich parchment, dark slate borders (#292524), wood accents (#78350F),
// game hotbar slots, real-time quest objective tracker, and sound controls
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { DEVELOPER_PROFILE } from '../../data/gameData';
import { MiniMap } from './MiniMap';
import { Volume2, VolumeX, Menu, BookOpen, Backpack, Sparkles, HelpCircle, Compass, Scroll } from 'lucide-react';

export function HUD() {
  const nearbyInteractable = useGameStore((state) => state.nearbyInteractable);
  const activeQuestId = useGameStore((state) => state.activeQuestId);
  const quests = useGameStore((state) => state.quests);
  const questNotification = useGameStore((state) => state.questNotification);
  const totalXP = useGameStore((state) => state.totalXP);
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const openModal = useGameStore((state) => state.openModal);
  const setPaused = useGameStore((state) => state.setPaused);
  const switchToClassic = useGameStore((state) => state.switchToClassic);

  const activeQuest = quests.find((q) => q.id === activeQuestId);
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none font-sans">
      {/* ─── TOP BAR ─── */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Character Profile Panel (Wood & Gold Border) */}
        <div className="flex items-center gap-3 bg-[#1C1917]/90 text-white backdrop-blur-md border-2 border-[#78350F] rounded-2xl p-2.5 sm:p-3 shadow-2xl pointer-events-auto">
          {/* Avatar Icon */}
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white font-black text-lg border-2 border-amber-300 shadow-md">
            <span>S</span>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1C1917]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-amber-100 tracking-wide">
                {DEVELOPER_PROFILE.name}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40">
                Lv. {DEVELOPER_PROFILE.level}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium">
              {DEVELOPER_PROFILE.role}
            </p>

            {/* XP Bar */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-24 sm:w-32 h-2 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalXP / 750) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-amber-400 font-bold">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Game Hotbar & MiniMap */}
        <div className="flex flex-col items-end gap-2.5">
          {/* RPG Action Hotbar */}
          <div className="flex items-center gap-1.5 bg-[#1C1917]/90 p-1.5 rounded-2xl border-2 border-[#78350F] shadow-2xl pointer-events-auto">
            {/* Classic View Pill */}
            <button
              onClick={switchToClassic}
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white border border-amber-400/50 rounded-xl px-3 py-1.5 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              title="Standard Website Mode"
            >
              <Scroll size={13} />
              <span>Classic View</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 border border-neutral-700 flex items-center justify-center text-amber-300 shadow-sm transition-all"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Inventory Slot */}
            <button
              onClick={() => openModal('inventory')}
              className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 border border-neutral-700 flex items-center justify-center text-amber-300 shadow-sm transition-all"
              title="Adventurer Inventory"
            >
              <Backpack size={15} />
            </button>

            {/* Quest Log Slot */}
            <button
              onClick={() => openModal('quests')}
              className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 border border-neutral-700 flex items-center justify-center text-amber-300 shadow-sm transition-all"
              title="Quest Journal"
            >
              <BookOpen size={15} />
            </button>

            {/* Menu Slot */}
            <button
              onClick={() => setPaused(true)}
              className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 border border-neutral-700 flex items-center justify-center text-amber-300 shadow-sm transition-all"
              title="Pause Menu"
            >
              <Menu size={15} />
            </button>
          </div>

          {/* MiniMap Component */}
          <MiniMap />
        </div>
      </div>

      {/* ─── CENTER: QUEST NOTIFICATIONS & [E] INTERACT PROMPT ─── */}
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Quest Complete / Relic Notification Popup */}
        {questNotification && (
          <div className="animate-bounce bg-[#1C1917]/95 text-white border-2 border-amber-500 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-3 pointer-events-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                {questNotification.title}
              </p>
              <p className="text-xs sm:text-sm font-bold text-neutral-100">
                {questNotification.message}
              </p>
            </div>
          </div>
        )}

        {/* [E] INTERACT PROMPT BANNER */}
        {nearbyInteractable && (
          <div
            onClick={() => useGameStore.getState().triggerInteract()}
            className="cursor-pointer group flex items-center gap-3 bg-[#1C1917]/95 text-white backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-amber-500 shadow-2xl hover:bg-amber-600 transition-all transform hover:scale-105 active:scale-95 pointer-events-auto"
          >
            <span className="w-7 h-7 rounded-lg bg-amber-500 group-hover:bg-white text-white group-hover:text-neutral-900 font-mono font-black text-xs flex items-center justify-center shadow-inner">
              E
            </span>
            <span className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-100 group-hover:text-white">
              {nearbyInteractable.actionText}
            </span>
          </div>
        )}
      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom Left: Controls Legend */}
        <div className="hidden sm:flex flex-col gap-1.5 bg-[#1C1917]/90 text-white backdrop-blur-md border-2 border-[#78350F] rounded-2xl p-3 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-0.5">
            <HelpCircle size={13} className="text-amber-400" />
            <span>Adventurer Controls</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-neutral-300">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">WASD</kbd>
              <span>Move & Slide</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">Space</kbd>
              <span>Jump</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">Shift</kbd>
              <span>Sprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">Mouse</kbd>
              <span>Orbit Cam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">E</kbd>
              <span>Interact / Talk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-300">ESC</kbd>
              <span>Pause Menu</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Active Quest Parchment Scroll */}
        <div className="bg-[#1C1917]/90 text-white backdrop-blur-md border-2 border-[#78350F] rounded-2xl p-3.5 shadow-2xl max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                Active Objective ({completedCount}/{quests.length})
              </span>
            </div>
            <button
              onClick={() => openModal('quests')}
              className="text-[10px] text-neutral-400 hover:text-amber-300 font-semibold underline"
            >
              Log
            </button>
          </div>

          {activeQuest ? (
            <div>
              <p className="text-xs font-bold text-amber-100 mb-0.5">
                {activeQuest.title}
              </p>
              <p className="text-[11px] text-neutral-300 leading-snug">
                {activeQuest.objective}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-medium pt-1.5 border-t border-neutral-800">
                <span>Target: <span className="text-neutral-200 font-bold">{activeQuest.locationName}</span></span>
                <span className="text-amber-400 font-bold">{activeQuest.reward}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-400 font-bold">
              All Quests Accomplished! Realm Master.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
