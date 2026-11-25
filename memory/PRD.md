# PRD — Developer Quest 3D Portfolio (Sanchit Baviskar)

## Original problem statement
On the intro screen ("DEVELOPER QUEST"), clicking START ADVENTURE did nothing and the app stayed stuck on the intro overlay with the blurred world behind it. Began after the `bruno-style-redesign` changes. Fix the root cause without breaking Classic View, collisions, NPC interaction, quests/XP, audio/mute, or Drive/Walk mode; run lint/build; test both intro buttons; commit and push.

## Root cause (diagnosed 2026-06, browser-confirmed)
The redesign commit (f868353) called six `soundManager` methods that were never implemented:
`startEngine`, `stopEngine`, `setEngine`, `playHorn`, `playBump`, `playLand`.
- START ADVENTURE → `soundManager.startEngine is not a function` thrown BEFORE `set({gameMode:'playing'})` → intro stuck.
- VIEW PORTFOLIO → same via `stopEngine` in `switchToClassic` → also stuck.
Not pointer-events/z-index, not Suspense/Rapier, not loading flags.
Secondary latent bug found while testing: old-schema localStorage saves (collectibles without `position`) crashed the render loop every frame (`Cannot read properties of undefined (reading '1')` at WorldAssets.jsx `item.position[1]`).

## Architecture
- Vite + React 18 + three.js/@react-three/fiber + drei + zustand + framer-motion + tailwind. Plain Vite app at repo root (no /app/frontend template dir). Dev server runs on port 3000 (`vite.config.js` host/allowedHosts set for the Emergent preview).
- Branches: `main` (pre-redesign, untouched) and `bruno-style-redesign` (active work + fix).

## What was implemented (2026-06)
- `src/utils/soundManager.js`: implemented engine loop (startEngine/setEngine/stopEngine), playHorn (beep/toot/chime), playBump, playLand — all guarded, all optional-failure-safe.
- `src/store/gameStore.js`: startAdventure/switchToClassic wrap audio in try/catch and always set the new mode; versioned save migration (SAVE_VERSION 2, TOY_VERSION 2) that deep-validates quest/collectible shapes, salvages completed-quest/collected-item progress by id, resets corrupt or unknown-future-version keys; sceneError/sceneNonce state.
- `src/components/ui/GameErrorBoundary.jsx` (new): SceneErrorBoundary inside the R3F tree reporting to the store, SceneErrorFallback DOM overlay ("Try Again" / "Switch to Classic View"), GameErrorBoundary around the canvas tree.
- `src/components/ui/WorldLoadMonitor.jsx` (new): real progress from drei useProgress into store `bootProgress`, hard 15s timeout with escape hatch.
- `src/components/game/GameCanvas.jsx`: scene error fallback swap + Canvas remount nonce + load monitor.
- `src/App.jsx`: GameErrorBoundary wrapper. `src/components/ui/CinematicIntro.jsx`: data-testids. `vite.config.js`: port 3000 + preview host allowlist.

## Verified
- START ADVENTURE dismisses intro, game runs, drives (minimap updates), framebuffer pixel probe confirms world renders, 0 console errors.
- VIEW PORTFOLIO loads classic portfolio; HUD/Classic roundtrip works.
- Migration: legacy v1 save → v2 with XP + collectible progress preserved; corrupt fields reset; future-version save wiped safely; game starts after reset.
- `npm run lint` clean, `npm run build` succeeds (only pre-existing chunk-size warning).

## Backlog / next
- P1: mute toggle persists across reloads.
- P2: code-split three.js bundle (1.4MB warning) via manualChunks.
- P2: walk-mode (Player.jsx) still uses old footstep loop; unify with drive-mode audio.
