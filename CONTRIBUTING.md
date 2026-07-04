# Contributing to The Long Game

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

## Before opening a PR

```bash
npm run build    # runs tsc -b && vite build — must pass clean
```

There's no separate lint/test script yet; the type-check in `build` is the
current bar. If you add automated tests, wire them into CI (see
`.github/workflows/ci.yml`).

## Adding game content

- **Classic-mode scenarios**: add to `src/content/scenarios/*.ts`, or use the
  in-app **Scenario Studio** (`/#author`) and export the JSON.
- **World Edition events** (duties, X-factors, HEARD complaints): add to
  `src/world/events/*.ts` following the existing shape in `src/world/types.ts`.
- Keep every scenario **genuinely ambiguous** — no option should be
  identifiable as "correct" without reading the mentor's feedback. See the
  existing scenarios for the trade-off pattern each choice should follow.
- If your content draws on the Century Golf culture card, see
  [CONTENT-LICENSE.md](CONTENT-LICENSE.md) before contributing it upstream
  from outside Century Golf.

## Code structure

See [ARCHITECTURE.md](ARCHITECTURE.md).

## Commit style

Small, focused commits with a clear one-line summary. No fixed convention is
enforced yet.
