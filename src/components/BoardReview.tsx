import type { GameState } from '../engine/types'
import { SEASON_NAMES, SEASONS_PER_YEAR, TOTAL_YEARS } from '../engine/types'

const GRADE_COLORS: Record<string, string> = {
  A: 'text-club-700',
  B: 'text-club-500',
  C: 'text-amber-600',
  D: 'text-clay-500',
  F: 'text-red-600',
}

export function BoardReview({
  state,
  onNext,
}: {
  state: GameState
  onNext: () => void
}) {
  const record = state.history[state.history.length - 1]
  if (!record) return null
  const lastSeasonOfYear = state.seasonIndex === SEASONS_PER_YEAR - 1
  const lastYear = state.year === TOTAL_YEARS

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8 mt-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-2">
          Season-End Board Review
        </p>
        <h2 className="font-display text-2xl text-club-800 font-bold mb-6">
          Year {record.year} · {SEASON_NAMES[record.seasonIndex]}
        </h2>

        <div className={`font-display text-8xl font-bold mb-2 ${GRADE_COLORS[record.grade]}`}>
          {record.grade}
        </div>
        <p className="text-sm text-gold-600 font-semibold mb-8">
          +{record.xpEarned} XP this season
        </p>

        <div className="text-left bg-cream-50 rounded-lg p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-club-900/50 mb-3">
            From the boardroom
          </p>
          <ul className="space-y-2">
            {record.notes.map((n, i) => (
              <li key={i} className="text-sm text-club-900/80 leading-relaxed">
                · {n}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          {lastSeasonOfYear
            ? lastYear
              ? 'Conclude Your Tenure'
              : 'Close Out the Year'
            : `Begin ${SEASON_NAMES[record.seasonIndex + 1]}`}
        </button>
      </div>
    </div>
  )
}
