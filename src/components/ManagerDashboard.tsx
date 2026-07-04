import { useEffect, useMemo, useState } from 'react'
import type { CompetencyKey, RunRecord, Scenario } from '../engine/types'
import { COMPETENCY_LABELS } from '../engine/types'
import { buildDebrief, competencyPct } from '../engine/scoring'
import { loadRuns } from '../engine/persistence'
import { fetchRemoteRuns, remoteEnabled } from '../engine/remote'

function CompetencyBars({ scores }: { scores: RunRecord['competencyScores'] }) {
  const debrief = buildDebrief(scores)
  return (
    <div className="space-y-3">
      {debrief.map((d) => (
        <div key={d.competency}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-club-800">
              {COMPETENCY_LABELS[d.competency]}
            </span>
            <span className="text-club-900/60">
              {Math.round(d.pct * 100)}% · {d.answered} decision{d.answered === 1 ? '' : 's'}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden mb-1">
            <div
              className={`h-full rounded-full ${d.pct >= 0.65 ? 'bg-club-700' : 'bg-amber-500'}`}
              style={{ width: `${Math.max(4, d.pct * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-club-900/60 leading-relaxed">{d.note}</p>
        </div>
      ))}
    </div>
  )
}

export function ManagerDashboard({
  scenarios,
}: {
  scenarios: Record<string, Scenario>
}) {
  const [localRuns] = useState<RunRecord[]>(loadRuns)
  const [remoteRuns, setRemoteRuns] = useState<RunRecord[]>([])
  const [remoteState, setRemoteState] = useState<'off' | 'loading' | 'ok' | 'error'>(
    remoteEnabled ? 'loading' : 'off',
  )
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (!remoteEnabled) return
    fetchRemoteRuns()
      .then((runs) => {
        setRemoteRuns(runs)
        setRemoteState('ok')
      })
      .catch(() => setRemoteState('error'))
  }, [])

  // Remote is the source of truth when connected; local runs fill the gaps
  // (e.g. runs finished before Supabase was configured).
  const runs = useMemo(() => {
    const all = [...remoteRuns, ...localRuns]
    const seen = new Set<string>()
    return all.filter((r) => {
      const key = `${r.name}|${r.xp}|${r.date}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [remoteRuns, localRuns])

  const trainees = useMemo(() => {
    const names = [...new Set(runs.map((r) => r.name))]
    return names.sort((a, b) => a.localeCompare(b))
  }, [runs])

  const cohort = useMemo(() => {
    if (runs.length === 0) return null
    const completed = runs.filter((r) => r.outcome === 'completed').length
    const avgXp = Math.round(runs.reduce((s, r) => s + r.xp, 0) / runs.length)
    // Cohort-weakest competency: mean pct across runs.
    const keys = Object.keys(COMPETENCY_LABELS) as CompetencyKey[]
    const byCompetency = keys.map((k) => {
      const pcts = runs
        .filter((r) => r.competencyScores?.[k]?.possible > 0)
        .map((r) => competencyPct(r.competencyScores[k]))
      const avg = pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : 0
      return { k, avg, n: pcts.length }
    })
    const weakest = [...byCompetency].filter((c) => c.n > 0).sort((a, b) => a.avg - b.avg)[0]
    return { completed, avgXp, byCompetency, weakest }
  }, [runs])

  // Aggregate decision analytics: which scenarios does the cohort get wrong?
  const hardestDecisions = useMemo(() => {
    const agg = new Map<string, { total: number; n: number }>()
    for (const r of runs) {
      for (const e of r.choiceLog ?? []) {
        const cur = agg.get(e.scenarioId) ?? { total: 0, n: 0 }
        agg.set(e.scenarioId, { total: cur.total + e.quality, n: cur.n + 1 })
      }
    }
    return [...agg.entries()]
      .filter(([, v]) => v.n >= 1)
      .map(([id, v]) => ({
        id,
        title: scenarios[id]?.title ?? id,
        competency: scenarios[id]?.competency,
        avg: v.total / (v.n * 2),
        n: v.n,
      }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 6)
  }, [runs, scenarios])

  const selectedRuns = selected
    ? runs
        .filter((r) => r.name === selected)
        .sort((a, b) => b.date.localeCompare(a.date))
    : []

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 border-b border-cream-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-display text-club-800 font-semibold">
            ⛳ Club GM Simulator · Manager Dashboard
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                remoteState === 'ok'
                  ? 'bg-club-100 text-club-800'
                  : remoteState === 'loading'
                    ? 'bg-amber-100 text-amber-700'
                    : remoteState === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-cream-100 text-club-900/60'
              }`}
            >
              {remoteState === 'ok'
                ? '● Supabase connected'
                : remoteState === 'loading'
                  ? '● Connecting…'
                  : remoteState === 'error'
                    ? '● Supabase error — showing local data'
                    : '● Local data only (see .env.example to connect Supabase)'}
            </span>
            <a href="#" className="text-sm text-club-700 hover:underline">
              ← Back to game
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {runs.length === 0 ? (
          <div className="bg-white rounded-xl border border-cream-200 p-10 text-center text-club-900/60">
            No completed runs yet. The dashboard fills in as trainees finish playthroughs.
          </div>
        ) : (
          <>
            {cohort && (
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total runs', value: String(runs.length) },
                  { label: 'Trainees', value: String(trainees.length) },
                  {
                    label: 'Completion rate',
                    value: `${Math.round((cohort.completed / runs.length) * 100)}%`,
                  },
                  { label: 'Avg XP', value: String(cohort.avgXp) },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-xl border border-cream-200 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-club-900/50 mb-1">
                      {c.label}
                    </p>
                    <p className="font-display text-2xl font-bold text-club-800">{c.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-cream-200 p-6">
                <h2 className="font-display text-lg text-club-800 font-semibold mb-1">
                  Cohort competency profile
                </h2>
                <p className="text-xs text-club-900/50 mb-4">
                  Average decision quality by CMAA track — use this to focus real-world coaching.
                </p>
                <div className="space-y-3">
                  {cohort?.byCompetency.map((c) => (
                    <div key={c.k}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-club-800">
                          {COMPETENCY_LABELS[c.k]}
                          {cohort.weakest?.k === c.k && (
                            <span className="ml-2 text-amber-600 font-bold">← coach here</span>
                          )}
                        </span>
                        <span className="text-club-900/60">{Math.round(c.avg * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.avg >= 0.65 ? 'bg-club-700' : 'bg-amber-500'}`}
                          style={{ width: `${Math.max(4, c.avg * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-cream-200 p-6">
                <h2 className="font-display text-lg text-club-800 font-semibold mb-1">
                  Hardest decisions
                </h2>
                <p className="text-xs text-club-900/50 mb-4">
                  Scenarios the cohort scores lowest on — candidates for classroom discussion.
                </p>
                {hardestDecisions.length === 0 ? (
                  <p className="text-sm text-club-900/50">
                    Decision-level data appears for runs finished after this update.
                  </p>
                ) : (
                  <ol className="space-y-2.5">
                    {hardestDecisions.map((d) => (
                      <li key={d.id} className="flex justify-between items-baseline gap-3 text-sm">
                        <span className="text-club-900/80">
                          {d.title}
                          {d.competency && (
                            <span className="ml-2 text-[10px] text-club-900/40 uppercase">
                              {COMPETENCY_LABELS[d.competency]}
                            </span>
                          )}
                        </span>
                        <span
                          className={`font-bold shrink-0 ${d.avg < 0.5 ? 'text-red-600' : 'text-amber-600'}`}
                        >
                          {Math.round(d.avg * 100)}%
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-cream-200 p-6">
              <h2 className="font-display text-lg text-club-800 font-semibold mb-4">
                Trainee reports
              </h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {trainees.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelected(selected === t ? null : t)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      selected === t
                        ? 'bg-club-800 text-white border-club-800'
                        : 'border-cream-200 hover:border-club-500 text-club-900/80'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {selected && selectedRuns.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-club-900/50 mb-3">
                      Run history — {selected}
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] uppercase text-club-900/40">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Outcome</th>
                          <th className="pb-2 text-right">XP</th>
                          <th className="pb-2 text-right">Badges</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRuns.map((r, i) => (
                          <tr key={i} className="border-t border-cream-100">
                            <td className="py-2">{r.date}</td>
                            <td className="py-2">
                              {r.outcome === 'completed' ? (
                                <span className="text-club-700 font-semibold">Renewed</span>
                              ) : (
                                <span className="text-red-600 font-semibold">Terminated</span>
                              )}
                            </td>
                            <td className="py-2 text-right font-semibold text-gold-600">{r.xp}</td>
                            <td className="py-2 text-right">{r.badges.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-club-900/50 mb-3">
                      Latest competency debrief
                    </p>
                    <CompetencyBars scores={selectedRuns[0].competencyScores} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
