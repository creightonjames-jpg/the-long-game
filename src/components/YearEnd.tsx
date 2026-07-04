import type { GameState } from '../engine/types'

export function YearEnd({
  state,
  onBeginYear,
}: {
  state: GameState
  onBeginYear: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8 mt-6">
        <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-2">
          Annual Meeting · Board Rotation
        </p>
        <h2 className="font-display text-2xl text-club-800 font-bold mb-4">
          The Board Turns Over
        </h2>
        <p className="text-sm text-club-900/70 leading-relaxed mb-6">
          As at most private clubs, one-third of the Cedar Ridge board rotates each year.
          Three directors you'd learned to work with are gone — three new ones arrive with
          agendas of their own. The trust you built doesn't fully transfer;
          you'll need to win this board over too. This churn is the structural reality
          of the GM/COO role.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-cream-50 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-club-900/50 mb-2">
              Rotating off
            </p>
            <ul className="space-y-1.5">
              {state.outgoingBoard.map((b) => (
                <li key={b.name} className="text-sm text-club-900/60 line-through">
                  {b.name} <span className="text-xs">({b.role})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-club-100/50 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-club-800 mb-2">
              Incoming — learn their agendas
            </p>
            <ul className="space-y-2">
              {state.incomingBoard.map((b) => (
                <li key={b.name} className="text-sm">
                  <span className="font-semibold text-club-800">{b.name}</span>{' '}
                  <span className="text-xs text-club-900/50">({b.role})</span>
                  <p className="text-xs text-club-900/70 mt-0.5">{b.agenda}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xs text-red-600/80 mb-6">
          ⚠ Board Confidence dipped and meddling risk rose — a new board must be won over.
          Year 2 scenarios will also revisit your weakest competencies.
        </p>

        <button
          onClick={onBeginYear}
          className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          Begin Year {state.year + 1}
        </button>
      </div>
    </div>
  )
}
