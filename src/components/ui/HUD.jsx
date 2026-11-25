// ─────────────────────────────────────────────
// RPG HUD (HEADS-UP DISPLAY) & CONTROLS OVERLAY
// Top Left: Player Level, Name, XP Bar
// Top Right: MiniMap & Audio Mute / Menu Toggles
// Bottom Left: WASD / Mouse Controls Guide
// Bottom Right: Active Quest Tracker
// Center: [E] INTERACT prompt & Quest Notifications
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { DEVELOPER_PROFILE } from '../../data/gameData';
import { MiniMap } from './MiniMap';
import { Volume2, VolumeX, Menu, BookOpen, Backpack, Map, Sparkles, Move, Eye, HelpCircle } from 'lucide-react';

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
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* ─── TOP BAR ─── */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Player Profile Badge */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-2.5 sm:p-3 shadow-card pointer-events-auto">
          {/* Avatar Icon */}
          <div className="relative w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <span>S</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900 tracking-tight">
                {DEVELOPER_PROFILE.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                Lv. {DEVELOPER_PROFILE.level}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              {DEVELOPER_PROFILE.title}
            </p>

            {/* XP Bar */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-24 sm:w-32 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalXP / 750) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-neutral-400 font-semibold">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Radar & Quick Action Buttons */}
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Switch to Classic Web Mode */}
            <button
              onClick={switchToClassic}
              className="bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold shadow-card transition-all flex items-center gap-1.5 hover:border-orange-500/40"
              title="Standard Website Mode"
            >
              <span>Classic View</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleAudio}
              className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-card transition-colors hover:text-orange-600"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Inventory Menu Button */}
            <button
              onClick={() => openModal('inventory')}
              className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-card transition-colors hover:text-orange-600"
              title="Inventory & Badges"
            >
              <Backpack size={16} />
            </button>

            {/* Quests Menu Button */}
            <button
              onClick={() => openModal('quests')}
              className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-card transition-colors hover:text-orange-600"
              title="Quest Log"
            >
              <BookOpen size={16} />
            </button>

            {/* Pause Menu */}
            <button
              onClick={() => setPaused(true)}
              className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-card transition-colors hover:text-orange-600"
              title="Game Menu"
            >
              <Menu size={16} />
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
          <div className="animate-bounce bg-white border-2 border-orange-500 shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-3 pointer-events-auto">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                {questNotification.title}
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {questNotification.message}
              </p>
            </div>
          </div>
        )}

        {/* [E] INTERACT PROMPT */}
        {nearbyInteractable && (
          <div
            onClick={() => useGameStore.getState().triggerInteract()}
            className="cursor-pointer group flex items-center gap-3 bg-neutral-900/90 text-white backdrop-blur-md px-5 py-3 rounded-2xl border border-neutral-700 shadow-2xl hover:bg-orange-600 transition-all transform hover:scale-105 pointer-events-auto"
          >
            <span className="w-7 h-7 rounded-lg bg-orange-500 group-hover:bg-white text-white group-hover:text-neutral-900 font-mono font-bold text-xs flex items-center justify-center shadow-inner">
              E
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {nearbyInteractable.actionText}
            </span>
          </div>
        )}
      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom Left: Controls Guide */}
        <div className="hidden sm:flex flex-col gap-1.5 bg-white/85 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-3 shadow-card pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 mb-0.5">
            <HelpCircle size={13} className="text-orange-500" />
            <span>Controls Guide</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">WASD</kbd>
              <span>Move</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">Space</kbd>
              <span>Jump</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">Shift</kbd>
              <span>Sprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">Mouse</kbd>
              <span>Orbit Cam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">E</kbd>
              <span>Interact</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 font-mono text-[10px]">ESC</kbd>
              <span>Pause</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Active Quest Tracker Card */}
        <div className="bg-white/90 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-3.5 shadow-card max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                Active Quest ({completedCount}/{quests.length})
              </span>
            </div>
            <button
              onClick={() => openModal('quests')}
              className="text-[10px] text-neutral-400 hover:text-neutral-700 font-medium underline"
            >
              Log
            </button>
          </div>

          {activeQuest ? (
            <div>
              <p className="text-xs font-bold text-neutral-900 mb-0.5">
                {activeQuest.title}
              </p>
              <p className="text-[11px] text-neutral-600 leading-snug">
                {activeQuest.objective}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 font-medium pt-1.5 border-t border-neutral-100">
                <span>Target: {activeQuest.locationName}</span>
                <span className="text-orange-600 font-semibold">{activeQuest.reward}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-semibold">
              All Quests Accomplished! Realm Master.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
