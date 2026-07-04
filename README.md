# The Long Game ⛳

*A Country Club GM Simulator*

A browser-based training game for the aspiring private-club General Manager pipeline,
built for Century Golf Partners. You play the newly hired GM/COO of **Cedar Ridge
Country Club** — a private, member-owned club — and navigate two years of the
decisions that actually define the job: board governance, club finance, member
retention, F&B operations, and staff leadership. It's called *The Long Game*
because that's the job: no single save, no single crisis — patience and
judgment compounded over two years, eight seasons, one tenure.

Built from the research-backed roadmaps in `../GM-Training-Game-Roadmap.md` (v1)
and `../GM-Training-Game-Roadmap-v2.md` (CMAA competency framework, GM/COO model,
gamification learning science, Century Golf culture card, Hero's Journey).

## 🎮 World Edition (v2) — `/#world`

The v2 MVP (roadmap Phases 5–7): a **walkable, top-down NES-pixel-art club** you
inhabit in real time. All art is original and generated in code (license-clean).

- **Explore the property**: parking lot, pro shop, pool, tennis, golf course,
  driving range, maintenance barn — and step through the clubhouse doors into the
  dining room, kitchen, ballroom, admin offices, fitness room, and facilities office.
- **A day that comes at you**: a live clock (7 AM–9 PM), scheduled duties, and
  random **X-factor crises** (fryer fires, shattered windshields, an impaired
  bartender, lightning with players on the course…). Alert toasts show where
  you're needed and how long you have. Arrive late → the situation **escalates**,
  penalties land, and your best option disappears. You can't be everywhere:
  triage is the job.
- **Genuinely hard choices**: options are shuffled (no positional tells), every
  choice trades something real, and decisions are scored on the four club stats
  **and the Century Golf culture card** (Safety, Courtesy, Show, Efficiency).
- **HEARD service recovery**: member complaints play out as the culture card's
  five-step sequence — Hear, Empathize, Apologize, Resolve, Diagnose.
- **A Hero's Journey tenure**: eight seasons across two years, each with a
  mentor briefing, a season goal, and success/failure story beats — from
  *The New Hire* to *Return with the Elixir*.
- Finished runs feed the same leaderboard and **Manager Dashboard** as classic mode.

Classic mode (v1 text scenarios) remains available from the start screen.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

No backend required — progress and the leaderboard persist in `localStorage`.

## How the game works

- **Four club stats** you steer every decision: Financial Health, Member
  Satisfaction, Board Confidence, Staff Morale. They trade off — there is
  rarely a free win.
- **Seasons & years:** 4 seasons per year × 2 years, 3 scenario decisions per
  season, each ending in a graded board review. Any stat collapsing below 15
  at review time ends your tenure.
- **Board dynamics (the differentiator):** a 9-seat board where one-third
  rotates at year end (trust partially resets), and a **Board Meddling meter** —
  poor governance choices or a struggling club push it up; at 55+ it spawns
  `BOARD INTERFERENCE` events you must defuse.
- **Spaced repetition:** Year 2 scenario selection weights your two weakest
  competencies from Year 1.
- **Feedback:** every choice gets an immediate "Mentor's Note" written in CMAA
  competency language, plus stat deltas and XP (0/50/100 by decision quality).
- **Endgame:** competency badges, a CMAA-aligned debrief report (share it with
  a real mentor/manager), and a local leaderboard.

## Content model

Scenarios are pure data (`src/content/scenarios/*.ts`) — the engine
(`src/engine/`) knows nothing about specific content. To add a scenario, add an
object to the relevant track file:

```ts
{
  id: 'unique-id',
  competency: 'governance',        // governance | finance | membership | fnb | leadership
  pool: 'core',                    // core | interference | followUp
  title: '...',
  speaker: 'Who confronts you',
  prompt: 'The situation...',
  choices: [
    {
      id: 'a', label: 'What you do',
      effects: { boardConfidence: 3, staffMorale: -2 },  // -8..+8 per stat
      micro: 5,                    // optional meddling-meter delta
      quality: 2,                  // 0 costly | 1 defensible | 2 strong call
      feedback: 'The mentor's note...',
      followUpId: 'other-id',      // optional consequence scenario
    },
  ],
}
```

Current content: 25 core scenarios (5 per track), 3 interference events,
1 follow-up chain — ~30 total.

## Views

- **`/#`** — the game
- **`/#author`** — **Scenario Studio**: create/edit scenarios in a form with live
  preview and validation. Custom scenarios persist in the browser and go live in
  the game immediately (editing a built-in creates an override; deleting the
  override restores it). Export/Import JSON to share content or hand it to
  engineering for the permanent content files.
- **`/#dashboard`** — **Manager Dashboard**: cohort stats (runs, completion
  rate, avg XP), average decision quality per CMAA track with a "coach here"
  flag on the weakest, **hardest decisions** (scenarios the cohort scores lowest
  on — classroom discussion candidates), and per-trainee run history + latest
  competency debrief.

## Multi-user sync (Supabase, optional)

Out of the box everything is local (`localStorage`). To share the leaderboard
and dashboard across the whole GM pipeline:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor
3. `cp .env.example .env.local` and fill in the URL + anon key from
   Project Settings → API, then restart the dev server (or rebuild)

Finished runs then sync to Supabase automatically; the leaderboard and manager
dashboard merge remote + local data (the dashboard header shows connection
status). **Note:** the shipped RLS policies allow anonymous read/insert —
fine for an internal cohort, but add auth before any public deployment.

## Roadmap status (vs. the project roadmaps)

- ✅ Phase 0 — scaffold, engine, state model, persistence
- ✅ Phase 1 — MVP core loop (scenario → feedback → board review)
- ✅ Phase 2 — all 5 competency tracks, board rotation, micromanagement/interference
- ✅ Phase 3 — badges, spaced repetition, debrief report, leaderboard,
  Supabase multi-user sync + manager dashboard (needs credentials, see above)
- ✅ Phase 4 — Scenario Studio authoring tool, aggregate decision analytics
- ✅ Phase 5 — walkable Phaser world, GM movement, NPC placement (`#world`)
- ✅ Phase 6 — day clock, timed alerts, escalation, triage
- ✅ Phase 7 — ambiguous culture-scored decisions, HEARD service recovery,
  Hero's Journey season scripts
- ✅ Phase 11 (partial) — public GitHub repo, CI, GitHub Pages deploy
- ⬜ Phase 8 — NPC movement schedules, richer art pass, audio
- ⬜ Phase 9 — deeper narrative threading (choices echo across seasons)
- ⬜ Phase 10 — Scenario Studio v2 for world events, culture analytics on the dashboard

See [`GM-Training-Game-Roadmap-v2.md`](../GM-Training-Game-Roadmap-v2.md) for the full plan.

## Stack

React 18 + TypeScript + Vite, Tailwind CSS v4, `useReducer` state engines
(classic mode) with localStorage persistence, **Phaser 3** (lazy-loaded) for
the World Edition's tile-based movement and rendering. All pixel art is
generated in code at load time — no external image assets.

## License

Code is MIT-licensed (see [LICENSE](LICENSE)). Game content referencing the
Century Golf Partners culture card is used with permission and is **not**
covered by the MIT license — see [CONTENT-LICENSE.md](CONTENT-LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Architecture overview in
[ARCHITECTURE.md](ARCHITECTURE.md).
