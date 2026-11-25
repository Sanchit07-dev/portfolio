// ─────────────────────────────────────────────
// REAL-TIME RADAR & MINIMAP
// Renders 2D top-down overview showing player icon, orientation, and quest location markers
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS } from '../../data/gameData';
import { Compass, MapPin } from 'lucide-react';

export function MiniMap() {
  const playerPos = useGameStore((state) => state.playerPos);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const activeQuestId = useGameStore((state) => state.activeQuestId);
  const quests = useGameStore((state) => state.quests);

  const activeQuest = quests.find((q) => q.id === activeQuestId);

  // Map scale conversion: 3D world is approx -50 to 50
  // Map size: 140px x 140px (70px center)
  const mapSize = 130;
  const center = mapSize / 2;
  const scale = (mapSize * 0.42) / 50;

  const toMapX = (worldX) => center + worldX * scale;
  const toMapY = (worldZ) => center + worldZ * scale;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-2.5 shadow-card pointer-events-auto">
      {/* Location label */}
      <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <MapPin size={13} className="text-orange-500 shrink-0" />
          <span className="text-[11px] font-semibold text-neutral-800 truncate">
            {currentLocation?.name || 'Open Realm'}
          </span>
        </div>
        <Compass size={13} className="text-neutral-400 shrink-0" />
      </div>

      {/* MiniMap Canvas SVG */}
      <div className="relative w-[130px] h-[130px] rounded-xl overflow-hidden bg-emerald-50/60 border border-neutral-200">
        <svg width={mapSize} height={mapSize} className="absolute inset-0">
          {/* Island border circle */}
          <circle cx={center} cy={center} r={mapSize * 0.44} fill="#7BAE79" opacity="0.35" />
          <circle cx={center} cy={center} r={mapSize * 0.44} fill="none" stroke="#426B4A" strokeWidth="1" strokeDasharray="2,2" />

          {/* Paths */}
          {WORLD_LOCATIONS.map((loc) => (
            <line
              key={`path-${loc.id}`}
              x1={center}
              y1={center}
              x2={toMapX(loc.coordinates[0])}
              y2={toMapY(loc.coordinates[2])}
              stroke="#D9C5A1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}

          {/* Location Destination Markers */}
          {WORLD_LOCATIONS.map((loc) => {
            const isTarget = activeQuest?.targetLocation === loc.id;
            return (
              <g key={loc.id}>
                {isTarget && (
                  <circle
                    cx={toMapX(loc.coordinates[0])}
                    cy={toMapY(loc.coordinates[2])}
                    r="6.5"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={toMapX(loc.coordinates[0])}
                  cy={toMapY(loc.coordinates[2])}
                  r={isTarget ? "4.5" : "3.5"}
                  fill={isTarget ? "#F97316" : loc.color}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Player marker */}
          <circle
            cx={toMapX(playerPos[0])}
            cy={toMapY(playerPos[2])}
            r="4.5"
            fill="#EA580C"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>

        {/* Cardinal North tag */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-neutral-400">
          N
        </span>
      </div>
    </div>
  );
}
