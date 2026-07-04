import type { CompetencyKey, GameState, Scenario } from './types'
import { INTERFERENCE_THRESHOLD, SCENARIOS_PER_SEASON } from './types'
import { weakestCompetencies } from './scoring'

/**
 * Season theme weighting for year 1 — each season leans on two tracks so the
 * player experiences the full CMAA competency map across the year.
 */
const SEASON_THEMES: CompetencyKey[][] = [
  ['governance', 'finance'],
  ['membership', 'fnb'],
  ['leadership', 'finance'],
  ['governance', 'membership'],
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build the scenario queue for a season.
 * Year 1: themed by season. Year 2: weighted toward the player's weakest
 * competencies (spaced repetition). High micromanagement injects a board
 * interference event in place of one core scenario.
 */
export function buildSeasonQueue(
  state: GameState,
  allScenarios: Record<string, Scenario>,
): string[] {
  const unused = Object.values(allScenarios).filter(
    (s) => s.pool === 'core' && !state.usedScenarioIds.includes(s.id),
  )

  const preferred: CompetencyKey[] =
    state.year === 1
      ? SEASON_THEMES[state.seasonIndex]
      : weakestCompetencies(state)

  const preferredPool = shuffle(unused.filter((s) => preferred.includes(s.competency)))
  const restPool = shuffle(unused.filter((s) => !preferred.includes(s.competency)))

  const picks: Scenario[] = []
  // Two from the preferred tracks, remainder from anywhere — degrade gracefully
  // if content runs thin.
  for (const s of preferredPool) {
    if (picks.length >= 2) break
    picks.push(s)
  }
  for (const s of [...restPool, ...preferredPool.filter((s) => !picks.includes(s))]) {
    if (picks.length >= SCENARIOS_PER_SEASON) break
    picks.push(s)
  }

  const queue = picks.map((s) => s.id)

  // Board interference: an unused interference event replaces the last slot.
  if (state.micromanagement >= INTERFERENCE_THRESHOLD) {
    const interference = shuffle(
      Object.values(allScenarios).filter(
        (s) => s.pool === 'interference' && !state.usedScenarioIds.includes(s.id),
      ),
    )[0]
    if (interference) {
      if (queue.length >= SCENARIOS_PER_SEASON) queue.pop()
      queue.push(interference.id)
    }
  }

  return queue
}
