// ─────────────────────────────────────────────
// REAL-TIME RADAR & MINIMAP (EXPANDED 120M WORLD)
// Displays full island radius, roads, zone markers, destination blips, and player location
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { WORLD_LOCATIONS } from '../../data/gameData';
import { WORLD_BOUNDS, WORLD_ZONES } from '../../data/worldConfig';
import { Compass, MapPin } from 'lucide-react';

export function MiniMap() {
  const playerPos = useGameStore((state) => state.playerPos);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const activeQuestId = useGameStore((state) => state.activeQuestId);
  const quests = useGameStore((state) => state.quests);

  const activeQuest = quests.find((q) => q.id === activeQuestId);

  // Scaled for expanded 120m world
  const mapSize = 138;
  const center = mapSize / 2;
  const scale = (mapSize * 0.42) / WORLD_BOUNDS.radius;

  const toMapX = (worldX) => center + worldX * scale;
  const toMapY = (worldZ) => center + worldZ * scale;

  return (
    <div className="bg-[#292524]/95 text-white border-2 border-[#78350F] rounded-2xl p-2.5 shadow-2xl pointer-events-auto">
      {/* Location label */}
      <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <MapPin size={13} className="text-orange-400 shrink-0" />
          <span className="text-[11px] font-bold text-amber-100 truncate">
            {currentLocation?.name || 'Open Realm'}
          </span>
        </div>
        <Compass size={13} className="text-amber-400 shrink-0" />
      </div>

      {/* MiniMap Canvas SVG */}
      <div className="relative w-[138px] h-[138px] rounded-xl overflow-hidden bg-[#2D5A27]/40 border border-[#78350F]/70">
        <svg width={mapSize} height={mapSize} className="absolute inset-0">
          {/* Island perimeter circle */}
          <circle cx={center} cy={center} r={mapSize * 0.44} fill="#5E8C4A" opacity="0.45" />
          <circle cx={center} cy={center} r={mapSize * 0.44} fill="none" stroke="#78350F" strokeWidth="1.2" strokeDasharray="3,2" />

          {/* Azure Lake */}
          <circle cx={toMapX(-50)} cy={toMapY(40)} r="12" fill="#3AAFA9" opacity="0.6" />

          {/* Major Roads */}
          {WORLD_LOCATIONS.map((loc) => (
            <line
              key={`path-${loc.id}`}
              x1={center}
              y1={center}
              x2={toMapX(loc.coordinates[0])}
              y2={toMapY(loc.coordinates[2])}
              stroke="#D9C5A1"
              strokeWidth="2.0"
              strokeLinecap="round"
              opacity="0.8"
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
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
        </svg>

        {/* Cardinal North tag */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-300">
          N
        </span>
      </div>
    </div>
  );
}
