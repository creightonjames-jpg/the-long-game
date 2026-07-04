import type { GameState, LeaderboardEntry } from '../engine/types'
import { COMPETENCY_LABELS } from '../engine/types'
import { buildDebrief, earnedBadges } from '../engine/scoring'

export function GameOver({
  state,
  leaderboard,
  onRestart,
}: {
  state: GameState
  leaderboard: LeaderboardEntry[]
  onRestart: () => void
}) {
  const over = state.gameOver
  if (!over) return null
  const debrief = buildDebrief(state.competencyScores)
  const badges = earnedBadges(state.competencyScores)
  const terminated = over.reason === 'terminated'

  return (
    <div className="max-w-2xl mx-auto p-6 pb-16">
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8 mt-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{terminated ? '📦' : '🏆'}</div>
          <h2
            className={`font-display text-3xl font-bold mb-3 ${terminated ? 'text-red-700' : 'text-club-800'}`}
          >
            {terminated ? 'The Board Has Made a Change' : 'Contract Renewed'}
          </h2>
          <p className="text-sm text-club-900/70 leading-relaxed max-w-lg mx-auto">
            {over.message}
          </p>
          <p className="mt-4 text-2xl font-bold text-gold-600">{state.xp} XP</p>
        </div>

        {badges.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-club-900/50 mb-3 text-center">
              Competency badges earned
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="bg-gold-500/15 text-gold-600 border border-gold-500/40 text-xs font-bold px-3 py-1.5 rounded-full"
                >
                  🎖 {b}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="font-display text-lg text-club-800 font-semibold mb-1">
            Competency Debrief
          </h3>
          <p className="text-xs text-club-900/50 mb-4">
            Aligned to the CMAA competency framework — share this with your mentor or manager.
          </p>
          <div className="space-y-4">
            {debrief.map((d) => (
              <div key={d.competency} className="bg-cream-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-club-800">
                    {COMPETENCY_LABELS[d.competency]}
                  </span>
                  <span className="text-xs font-bold text-club-900/60">
                    {Math.round(d.pct * 100)}% · {d.answered} decision{d.answered === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${d.pct >= 0.65 ? 'bg-club-700' : 'bg-amber-500'}`}
                    style={{ width: `${Math.max(4, d.pct * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-club-900/70 leading-relaxed">{d.note}</p>
              </div>
            ))}
          </div>
        </div>

        {leaderboard.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-lg text-club-800 font-semibold mb-3">
              🏆 Clubhouse Leaderboard
            </h3>
            <ol className="space-y-1.5">
              {leaderboard.map((e, i) => (
                <li
                  key={i}
                  className={`flex justify-between text-sm rounded px-2 py-1 ${
                    e.name === state.playerName && e.xp === state.xp ? 'bg-gold-500/10 font-semibold' : ''
                  }`}
                >
                  <span>
                    <span className="text-club-900/50 mr-2">{i + 1}.</span>
                    {e.name}
                    {e.outcome === 'terminated' && (
                      <span className="ml-2 text-xs text-red-500">(terminated)</span>
                    )}
                  </span>
                  <span className="font-semibold text-gold-600">{e.xp} XP</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          Play Again — New Tenure, New Board
        </button>
      </div>
    </div>
  )
}
