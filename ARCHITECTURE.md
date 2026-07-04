# Architecture

Two parallel game modes share one content/scoring vocabulary.

## Classic mode (`src/`)

- `src/engine/` — pure state: `types.ts` (domain shapes), `reducer.ts`
  (`useReducer`-based game state machine), `scoring.ts` (grading, badges,
  debrief text), `selection.ts` (season scenario picking), `persistence.ts`
  (localStorage), `remote.ts` (optional Supabase sync), `customScenarios.ts`
  (Scenario Studio storage/merge/validation).
- `src/content/` — all scenario data (`scenarios/*.ts`) and the board
  roster (`board.ts`). Pure data; the engine has no knowledge of specific
  content.
- `src/components/` — screens (`StartScreen`, `ScenarioCard`,
  `FeedbackPanel`, `BoardReview`, `YearEnd`, `GameOver`), plus the
  `AuthorTool` (Scenario Studio) and `ManagerDashboard`.

## World Edition (`src/world/`, `src/components/world/`)

- `src/world/types.ts` — World-mode types (`WorldState`, `EventDef`,
  `HeardComplaint`, `SeasonScript`, culture-card `CultureKey`).
- `src/world/sim.ts` — **pure reducer**, no Phaser/React dependency,
  independently testable: day clock (`TICK`), event spawning/escalation,
  resolution, season transitions, termination checks.
- `src/world/scripts.ts` — the 8 Hero's-Journey season scripts.
- `src/world/events/` — content: `duties.ts` (scheduled), `xfactors.ts`
  (random crises), `heard.ts` (service-recovery mini-mechanic).
- `src/world/art.ts` — procedural NES-style pixel art, baked to data-URL
  spritesheets at load (no external image assets).
- `src/world/map.ts` — the tile grid, zones, NPC placements, door teleports.
- `src/world/scene.ts` — the Phaser `Scene`: movement, collision, camera,
  markers. Talks to React only through `src/world/bus.ts` (a tiny pub/sub
  bridge) — Phaser never imports React and vice versa.
- `src/components/world/WorldGame.tsx` — mounts Phaser, owns the
  `worldReducer` dispatch loop, wires the event bus to React overlays.
- `src/components/world/WorldUI.tsx` / `WorldScreens.tsx` — the overlay
  screens (HUD, alerts, event/HEARD dialogs, season/day recap, ending).

`WorldGame` is lazy-loaded (`React.lazy`) from `App.tsx` so Phaser (~1.7 MB)
never loads for classic-mode/dashboard/authoring users.

### Known constraint: Phaser + Vite HMR

Phaser's `Scene` is stateful and can't hot-swap safely — `scene.ts` calls
`import.meta.hot.accept(() => location.reload())` so an edit there triggers a
full page reload instead of a broken half-updated scene. The
`WorldGame` mount effect also defensively destroys any prior game instance
and clears the host element before creating a new one, to survive React
StrictMode's double-invoke in development.

### Dev debug harness

In dev builds, `window.__worldDebug` exposes `{ state(), dispatch, warp(tx,ty),
fast(multiplier), gmTile() }` for driving the simulation without hand-walking
— useful for testing event escalation, season transitions, and endings
quickly.

## Routing

Hash-based, read in `App.tsx`: `#` (classic), `#world` (World Edition),
`#author` (Scenario Studio), `#dashboard` (Manager Dashboard).
