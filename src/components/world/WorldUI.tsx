import { useEffect, useMemo, useState } from 'react'
import type { StatKey } from '../../engine/types'
import { COMPETENCY_LABELS, STAT_LABELS } from '../../engine/types'
import { sfx } from '../../engine/audio'
import { isVoiceEnabled, speak, stopSpeaking } from '../../engine/speech'
import type {
  ActiveEvent,
  CultureKey,
  EventDef,
  HeardComplaint,
  WorldChoice,
  WorldState,
} from '../../world/types'
import { CULTURE_LABELS, formatClock } from '../../world/types'
import { SEASON_SCRIPTS } from '../../world/scripts'
import { ALL_EVENTS } from '../../world/sim'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const STAT_COLOR: Record<StatKey, string> = {
  financialHealth: 'bg-club-500',
  memberSatisfaction: 'bg-gold-500',
  boardConfidence: 'bg-sky-500',
  staffMorale: 'bg-clay-500',
}

export function cultureAvg(culture: Record<CultureKey, number>): number {
  const v = Object.values(culture)
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length)
}

export function WorldHud({
  state,
  paused,
  sfxOn,
  voiceOn,
  voiceSupported,
  onWait,
  onPause,
  onZoom,
  onToggleSfx,
  onToggleVoice,
}: {
  state: WorldState
  paused: boolean
  sfxOn: boolean
  voiceOn: boolean
  voiceSupported: boolean
  onWait: () => void
  onPause: () => void
  onZoom: (dir: 'in' | 'out') => void
  onToggleSfx: () => void
  onToggleVoice: () => void
}) {
  const script = SEASON_SCRIPTS[state.seasonIndex]
  const cult = cultureAvg(state.culture)
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-club-900/90 backdrop-blur px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-cream-100 font-display text-sm font-semibold">⛳ Cedar Ridge</span>
        <span className="text-cream-200/90 text-xs font-mono">
          Y{script.year} {script.seasonName} · Day {state.day + 1} · {formatClock(state.clock)}
        </span>
        {(Object.keys(state.stats) as StatKey[]).map((k) => (
          <div key={k} className="flex items-center gap-1.5" title={`${STAT_LABELS[k]}: ${state.stats[k]}`}>
            <span className="text-[10px] text-cream-200/70">{STAT_LABELS[k].split(' ')[0]}</span>
            <div className="h-1.5 w-12 rounded-full bg-black/40 overflow-hidden">
              <div
                className={`h-full ${state.stats[k] < 30 ? 'bg-red-500' : STAT_COLOR[k]}`}
                style={{ width: `${state.stats[k]}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5" title={`Culture Alignment: ${cult}`}>
          <span className="text-[10px] text-gold-500 font-semibold">Culture</span>
          <div className="h-1.5 w-12 rounded-full bg-black/40 overflow-hidden">
            <div className="h-full bg-gold-500" style={{ width: `${cult}%` }} />
          </div>
        </div>
        <span className="ml-auto text-gold-500 text-xs font-bold">{state.xp} XP</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoom('out')}
            className="text-[11px] text-cream-200/80 border border-cream-200/30 rounded w-6 h-6 hover:bg-white/10"
            title="Zoom out ( - )"
          >
            −
          </button>
          <button
            onClick={() => onZoom('in')}
            className="text-[11px] text-cream-200/80 border border-cream-200/30 rounded w-6 h-6 hover:bg-white/10"
            title="Zoom in ( + )"
          >
            +
          </button>
          <button
            onClick={onToggleSfx}
            className={`text-[11px] border rounded w-6 h-6 hover:bg-white/10 ${sfxOn ? 'text-cream-200/80 border-cream-200/30' : 'text-cream-200/40 border-cream-200/15'}`}
            title={sfxOn ? 'Sound effects on' : 'Sound effects off'}
          >
            {sfxOn ? '🔊' : '🔇'}
          </button>
          {voiceSupported && (
            <button
              onClick={onToggleVoice}
              className={`text-[11px] border rounded w-6 h-6 hover:bg-white/10 ${voiceOn ? 'text-gold-500 border-gold-500/50' : 'text-cream-200/40 border-cream-200/15'}`}
              title={voiceOn ? 'Read-aloud on' : 'Read-aloud off'}
            >
              🗣
            </button>
          )}
          <button
            onClick={onPause}
            className="text-[10px] text-cream-200/80 border border-cream-200/30 rounded px-2 h-6 hover:bg-white/10"
            title="Pause / resume ( P )"
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={onWait}
            className="text-[10px] text-cream-200/70 border border-cream-200/30 rounded px-2 h-6 hover:bg-white/10"
            title="Let an hour pass"
          >
            ⏩ Wait 1hr
          </button>
        </div>
      </div>
    </div>
  )
}

export function AlertToasts({ state }: { state: WorldState }) {
  if (state.active.length === 0) return null
  return (
    <div className="absolute top-14 right-3 z-20 space-y-2 w-64">
      {state.active.map((a) => {
        const def = ALL_EVENTS[a.defId]
        if (!def) return null
        const remaining = Math.max(0, Math.round(a.deadline - state.clock))
        const escalated = a.status === 'escalated'
        const sevColor = escalated
          ? 'border-red-500 bg-red-950/90'
          : def.severity === 3
            ? 'border-red-400 bg-club-900/90'
            : def.severity === 2
              ? 'border-amber-400 bg-club-900/90'
              : 'border-cream-200/40 bg-club-900/90'
        return (
          <div key={a.defId} className={`border-l-4 ${sevColor} rounded-r-lg px-3 py-2 shadow-lg`}>
            <p className="text-cream-100 text-xs font-semibold leading-snug">{def.toast}</p>
            <p className="text-[10px] text-cream-200/70 mt-0.5">
              📍 {def.zone} ·{' '}
              {escalated ? (
                <span className="text-red-400 font-bold">ESCALATED — get there</span>
              ) : (
                <span>⏱ {Math.floor(remaining / 60)}h {remaining % 60}m to respond</span>
              )}
            </p>
          </div>
        )
      })}
    </div>
  )
}

const VERDICTS = [
  { label: 'Costly Move', cls: 'bg-red-100 text-red-700' },
  { label: 'Defensible', cls: 'bg-amber-100 text-amber-700' },
  { label: 'Strong Call', cls: 'bg-club-100 text-club-800' },
] as const

const COMP_COLORS: Record<string, string> = {
  governance: 'bg-sky-100 text-sky-800',
  finance: 'bg-club-100 text-club-800',
  membership: 'bg-amber-100 text-amber-800',
  fnb: 'bg-rose-100 text-rose-800',
  leadership: 'bg-violet-100 text-violet-800',
}

export function EventOverlay({
  def,
  entry,
  onResolve,
}: {
  def: EventDef
  entry: ActiveEvent
  onResolve: (choiceId: string) => void
}) {
  const scenario = def.scenario!
  const escalated = entry.status === 'escalated'
  const [selected, setSelected] = useState<WorldChoice | null>(null)

  const promptText = escalated && scenario.escalatedPrompt ? scenario.escalatedPrompt : scenario.prompt
  const spokenIntro = `${scenario.speaker ? scenario.speaker + '. ' : ''}${promptText}`

  // Read the situation aloud on open (if read-aloud is on); stop on close.
  useEffect(() => {
    speak(spokenIntro)
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id])

  const choose = (c: WorldChoice) => {
    sfx(c.quality === 2 ? 'good' : c.quality === 1 ? 'mid' : 'bad')
    speak(c.feedback)
    setSelected(c)
  }

  // Late arrival costs you the ideal option (when there's room to degrade),
  // and choice order is always shuffled — no positional tells.
  const choices = useMemo(() => {
    let pool = scenario.choices
    if (escalated && pool.length > 2) {
      const bestIdx = pool.reduce((bi, c, i) => (c.quality > pool[bi].quality ? i : bi), 0)
      pool = pool.filter((_, i) => i !== bestIdx)
    }
    return shuffle(pool)
  }, [scenario, escalated])

  return (
    <div className="absolute inset-0 z-30 bg-club-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className={`bg-cream-50 rounded-xl border shadow-xl p-7 mt-8 ${escalated ? 'border-red-400 ring-2 ring-red-300/50' : 'border-cream-200'}`}>
          {!selected ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${COMP_COLORS[scenario.competency]}`}>
                  {COMPETENCY_LABELS[scenario.competency]}
                </span>
                <span className="text-xs text-club-900/40">📍 {def.zone}</span>
              </div>
              {escalated && (
                <p className="text-xs font-bold text-red-600 mb-2">
                  ⚠ YOU ARRIVED LATE — the situation escalated, and your best option is gone.
                </p>
              )}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="font-display text-2xl font-bold text-club-800">{scenario.title}</h2>
                {isVoiceEnabled() && (
                  <button
                    onClick={() => speak(spokenIntro)}
                    className="shrink-0 text-club-700 border border-club-700/40 rounded-full w-8 h-8 hover:bg-club-100"
                    title="Read aloud"
                  >
                    🔊
                  </button>
                )}
              </div>
              {scenario.speaker && (
                <p className="text-sm italic text-club-900/50 mb-4">— {scenario.speaker}</p>
              )}
              <p className="text-club-900/80 leading-relaxed mb-7">{promptText}</p>
              <div className="space-y-3">
                {choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => choose(c)}
                    className="w-full text-left border border-cream-200 bg-white hover:border-club-500 hover:bg-club-100/40 rounded-lg px-5 py-4 transition-colors text-sm leading-relaxed"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${VERDICTS[selected.quality].cls}`}>
                  {VERDICTS[selected.quality].label}
                </span>
                <span className="text-xs text-gold-600 font-semibold">+{selected.quality * 50} XP</span>
                {escalated && <span className="text-xs text-red-600 font-semibold">(handled late)</span>}
              </div>
              <p className="font-medium text-club-900 mb-4">“{selected.label}”</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(Object.entries(selected.effects) as [StatKey, number][]).map(([k, v]) => (
                  <span
                    key={k}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v >= 0 ? 'bg-club-100 text-club-800' : 'bg-red-100 text-red-700'}`}
                  >
                    {STAT_LABELS[k]} {v >= 0 ? '+' : ''}{v}
                  </span>
                ))}
                {selected.culture &&
                  (Object.entries(selected.culture) as [CultureKey, number][]).map(([k, v]) => (
                    <span
                      key={k}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${v >= 0 ? 'border-gold-500 text-gold-600' : 'border-red-300 text-red-600'}`}
                    >
                      ★ {CULTURE_LABELS[k]} {v >= 0 ? '+' : ''}{v}
                    </span>
                  ))}
              </div>
              <div className="bg-cream-100 border-l-4 border-gold-500 rounded-r-lg p-5 mb-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Mentor's Note</p>
                  {isVoiceEnabled() && (
                    <button
                      onClick={() => speak(selected.feedback)}
                      className="shrink-0 text-gold-600 border border-gold-500/40 rounded-full w-7 h-7 hover:bg-gold-500/10"
                      title="Read aloud"
                    >
                      🔊
                    </button>
                  )}
                </div>
                <p className="text-sm text-club-900/80 leading-relaxed">{selected.feedback}</p>
              </div>
              <button
                onClick={() => { stopSpeaking(); onResolve(selected.id) }}
                className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
              >
                Back to the Club
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function HeardOverlay({
  complaint,
  onDone,
}: {
  complaint: HeardComplaint
  onDone: (correct: number) => void
}) {
  const [stepIdx, setStepIdx] = useState(-1) // -1 = intro
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const step = stepIdx >= 0 && stepIdx < complaint.steps.length ? complaint.steps[stepIdx] : null
  const options = useMemo(() => (step ? shuffle(step.options.map((o, i) => ({ ...o, i }))) : []), [step])
  const finished = stepIdx >= complaint.steps.length

  // Read-aloud: speak the intro, then each step prompt as it appears.
  useEffect(() => {
    if (stepIdx === -1) speak(`${complaint.speaker}. ${complaint.intro}`)
    else if (step) speak(`${step.title}. ${step.prompt}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx])

  useEffect(() => {
    if (finished) sfx(correctCount >= 4 ? 'good' : correctCount >= 2 ? 'mid' : 'bad')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  return (
    <div className="absolute inset-0 z-30 bg-club-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-cream-50 rounded-xl border border-gold-500/50 shadow-xl p-7 mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-600 border border-gold-500/40">
              SERVICE RECOVERY
            </span>
            <div className="flex gap-1">
              {['H', 'E', 'A', 'R', 'D'].map((letter, i) => (
                <span
                  key={letter}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                    i < stepIdx || finished
                      ? 'bg-club-700 text-white'
                      : i === stepIdx
                        ? 'bg-gold-500 text-club-900'
                        : 'bg-cream-200 text-club-900/40'
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {stepIdx === -1 && (
            <>
              <h2 className="font-display text-2xl font-bold text-club-800 mb-1">{complaint.title}</h2>
              <p className="text-sm italic text-club-900/50 mb-4">— {complaint.speaker}</p>
              <p className="text-club-900/80 leading-relaxed mb-6">{complaint.intro}</p>
              <p className="text-xs text-club-900/50 mb-6">
                Service recovery runs on the culture card: <b>H</b>ear · <b>E</b>mpathize · <b>A</b>pologize · <b>R</b>esolve · <b>D</b>iagnose. Five moments, five choices.
              </p>
              <button
                onClick={() => setStepIdx(0)}
                className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
              >
                Step In
              </button>
            </>
          )}

          {step && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-1">
                Step {stepIdx + 1} · {step.title}
              </p>
              <p className="text-club-900/80 leading-relaxed mb-5">{step.prompt}</p>
              {picked === null ? (
                <div className="space-y-3">
                  {options.map((o) => (
                    <button
                      key={o.i}
                      onClick={() => {
                        setPicked(o.i)
                        if (o.correct) setCorrectCount((c) => c + 1)
                        sfx(o.correct ? 'good' : 'bad')
                        speak(o.response)
                      }}
                      className="w-full text-left border border-cream-200 bg-white hover:border-club-500 hover:bg-club-100/40 rounded-lg px-5 py-4 transition-colors text-sm leading-relaxed"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div
                    className={`border-l-4 rounded-r-lg p-5 mb-6 ${
                      step.options[picked].correct
                        ? 'bg-club-100/60 border-club-700'
                        : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide mb-2 text-club-900/60">
                      {step.options[picked].correct ? '✓ That landed' : '✗ That missed'}
                    </p>
                    <p className="text-sm text-club-900/80 leading-relaxed">{step.options[picked].response}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPicked(null)
                      setStepIdx(stepIdx + 1)
                    }}
                    className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
                  >
                    {stepIdx + 1 < complaint.steps.length ? 'Next Moment' : 'See How It Went'}
                  </button>
                </>
              )}
            </>
          )}

          {finished && (
            <>
              <h2 className="font-display text-2xl font-bold text-club-800 mb-3">
                {correctCount >= 4 ? 'Recovered.' : correctCount >= 2 ? 'Salvaged — roughly.' : 'That one got away.'}
              </h2>
              <p className="text-club-900/80 leading-relaxed mb-4">
                You hit <b>{correctCount} of 5</b> HEARD steps.{' '}
                {correctCount >= 4
                  ? 'The member left feeling heard, valued, and — the real prize — more loyal than before the failure. Recovered complainers become advocates.'
                  : correctCount >= 2
                    ? 'The member left calmer, not converted. Partial recovery keeps the relationship alive without healing it — the story they tell will be neutral at best.'
                    : 'The member left angrier than they arrived. A failed recovery is worse than the original failure — it confirms the failure was who you are.'}
              </p>
              <p className="text-xs text-club-900/50 mb-6">
                +{correctCount * 25} XP · Culture card: "Speed is critical to successful recovery… Many times an apology is all the Member desires."
              </p>
              <button
                onClick={() => { stopSpeaking(); onDone(correctCount) }}
                className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors"
              >
                Back to the Club
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
