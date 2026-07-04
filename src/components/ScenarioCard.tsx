import { useMemo } from 'react'
import type { Scenario } from '../engine/types'
import { COMPETENCY_LABELS } from '../engine/types'

const COMPETENCY_COLORS: Record<string, string> = {
  governance: 'bg-sky-100 text-sky-800',
  finance: 'bg-club-100 text-club-800',
  membership: 'bg-amber-100 text-amber-800',
  fnb: 'bg-rose-100 text-rose-800',
  leadership: 'bg-violet-100 text-violet-800',
}

export function ScenarioCard({
  scenario,
  position,
  total,
  onChoose,
}: {
  scenario: Scenario
  position: number
  total: number
  onChoose: (choiceId: string) => void
}) {
  const interference = scenario.pool === 'interference'
  // Display order is shuffled so there's never a positional tell.
  const shuffled = useMemo(() => {
    const a = [...scenario.choices]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }, [scenario.id]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        className={`bg-white rounded-xl border shadow-sm p-8 mt-6 ${
          interference ? 'border-red-300 ring-2 ring-red-100' : 'border-cream-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${COMPETENCY_COLORS[scenario.competency]}`}
          >
            {COMPETENCY_LABELS[scenario.competency]}
          </span>
          <span className="text-xs text-club-900/40">
            Decision {position} of {total}
          </span>
        </div>

        <h2 className={`font-display text-2xl font-bold mb-1 ${interference ? 'text-red-700' : 'text-club-800'}`}>
          {scenario.title}
        </h2>
        {scenario.speaker && (
          <p className="text-sm italic text-club-900/50 mb-4">— {scenario.speaker}</p>
        )}
        <p className="text-club-900/80 leading-relaxed mb-8">{scenario.prompt}</p>

        <div className="space-y-3">
          {shuffled.map((c) => (
            <button
              key={c.id}
              onClick={() => onChoose(c.id)}
              className="w-full text-left border border-cream-200 hover:border-club-500 hover:bg-club-100/40 rounded-lg px-5 py-4 transition-colors text-sm leading-relaxed"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
