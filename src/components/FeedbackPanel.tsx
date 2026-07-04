import type { Choice, Scenario, StatKey } from '../engine/types'
import { STAT_LABELS } from '../engine/types'

const VERDICTS = [
  { label: 'Costly Move', cls: 'bg-red-100 text-red-700' },
  { label: 'Defensible', cls: 'bg-amber-100 text-amber-700' },
  { label: 'Strong Call', cls: 'bg-club-100 text-club-800' },
] as const

export function FeedbackPanel({
  scenario,
  choice,
  onContinue,
}: {
  scenario: Scenario
  choice: Choice
  onContinue: () => void
}) {
  const verdict = VERDICTS[choice.quality]
  const deltas = Object.entries(choice.effects) as [StatKey, number][]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${verdict.cls}`}>
            {verdict.label}
          </span>
          <span className="text-xs text-gold-600 font-semibold">+{choice.quality * 50} XP</span>
        </div>

        <p className="text-sm text-club-900/50 mb-1">
          {scenario.title} — you chose:
        </p>
        <p className="font-medium text-club-900 mb-5">“{choice.label}”</p>

        {deltas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {deltas.map(([k, v]) => (
              <span
                key={k}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  (v ?? 0) >= 0 ? 'bg-club-100 text-club-800' : 'bg-red-100 text-red-700'
                }`}
              >
                {STAT_LABELS[k]} {(v ?? 0) >= 0 ? '+' : ''}
                {v}
              </span>
            ))}
          </div>
        )}

        <div className="bg-cream-50 border-l-4 border-gold-500 rounded-r-lg p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600 mb-2">
            Mentor's Note
          </p>
          <p className="text-sm text-club-900/80 leading-relaxed">{choice.feedback}</p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
