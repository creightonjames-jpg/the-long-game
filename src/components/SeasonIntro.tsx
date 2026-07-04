import type { GameState, StatKey } from '../engine/types'
import { SEASON_NAMES, STAT_LABELS } from '../engine/types'

function boardMandate(state: GameState): string {
  const entries = Object.entries(state.stats) as [StatKey, number][]
  const [lowestKey] = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))
  const mandates: Record<StatKey, string> = {
    financialHealth:
      'The finance committee wants the operating picture improved — watch every line.',
    memberSatisfaction:
      'Member sentiment needs visible attention this season. The board is hearing complaints at cocktail parties.',
    boardConfidence:
      'Several directors are uneasy about club leadership. This season, the board itself is your most important constituency.',
    staffMorale:
      'Turnover whispers are reaching the board. They expect you to steady the team.',
  }
  return mandates[lowestKey]
}

export function SeasonIntro({
  state,
  onBegin,
}: {
  state: GameState
  onBegin: () => void
}) {
  const focusMembers = state.board.slice(-3)
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8 mt-6">
        <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-2">
          Year {state.year} · {SEASON_NAMES[state.seasonIndex]}
        </p>
        <h2 className="font-display text-2xl text-club-800 font-bold mb-4">
          {SEASON_NAMES[state.seasonIndex]} Board Mandate
        </h2>
        <p className="text-club-900/80 leading-relaxed mb-6">{boardMandate(state)}</p>

        <div className="bg-cream-50 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-club-900/60 uppercase tracking-wide mb-2">
            Voices around the board table
          </p>
          <ul className="space-y-2">
            {focusMembers.map((b) => (
              <li key={b.name} className="text-sm">
                <span className="font-semibold text-club-800">
                  {b.name}
                </span>{' '}
                <span className="text-club-900/50">({b.role})</span>
                <span className="text-club-900/70"> — {b.agenda}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-club-900/50 mb-6">
          Lowest stat: {STAT_LABELS[
            (Object.entries(state.stats) as [StatKey, number][]).reduce((m, c) =>
              c[1] < m[1] ? c : m,
            )[0]
          ]}{' '}
          — decisions this season will echo into your board review.
        </p>

        <button
          onClick={onBegin}
          className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          Open the Season
        </button>
      </div>
    </div>
  )
}
