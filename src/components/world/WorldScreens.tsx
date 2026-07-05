import { useEffect, useState } from 'react'
import { isVoiceEnabled, speak, stopSpeaking } from '../../engine/speech'
import type { StatKey } from '../../engine/types'
import { STAT_LABELS } from '../../engine/types'
import { earnedBadges } from '../../engine/scoring'
import type { CultureKey, WorldState } from '../../world/types'
import { CULTURE_LABELS, DAYS_PER_SEASON } from '../../world/types'
import { SEASON_SCRIPTS } from '../../world/scripts'
import { cultureAvg } from './WorldUI'

const card = 'bg-cream-50 rounded-xl border border-cream-200 shadow-xl p-8'
const btn =
  'w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-3 transition-colors'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 bg-club-900/85 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className={`${card} mt-8 mb-12`}>{children}</div>
      </div>
    </div>
  )
}

function StatRows({ state }: { state: WorldState }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-2">
      {(Object.keys(state.stats) as StatKey[]).map((k) => (
        <div key={k}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-club-900/70">{STAT_LABELS[k]}</span>
            <span className={`font-bold ${state.stats[k] < 30 ? 'text-red-600' : 'text-club-800'}`}>
              {state.stats[k]}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
            <div
              className={`h-full rounded-full ${state.stats[k] < 30 ? 'bg-red-500' : 'bg-club-700'}`}
              style={{ width: `${state.stats[k]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function CultureRows({ state }: { state: WorldState }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {(Object.keys(state.culture) as CultureKey[]).map((k) => (
        <div key={k} className="text-center">
          <p className="text-[10px] uppercase tracking-wide text-gold-600 font-bold mb-1">
            {CULTURE_LABELS[k]}
          </p>
          <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full" style={{ width: `${state.culture[k]}%` }} />
          </div>
          <p className="text-xs font-bold text-club-800 mt-1">{state.culture[k]}</p>
        </div>
      ))}
    </div>
  )
}

export function IntroScreen({
  hasSave,
  isTouch,
  onStart,
  onResume,
}: {
  hasSave: boolean
  isTouch: boolean
  onStart: (name: string) => void
  onResume: () => void
}) {
  const [name, setName] = useState('')
  return (
    <Shell>
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">⛳</div>
        <h1 className="font-display text-3xl text-club-800 font-bold">Club GM Simulator</h1>
        <p className="font-display italic text-club-700">A Season at Cedar Ridge — World Edition</p>
      </div>
      <p className="text-sm text-club-900/75 leading-relaxed mb-4">
        You're the new GM/COO. The club is yours to walk — clubhouse, kitchen, pool, course,
        maintenance barn. Duties are scheduled; crises are not. When the alert sounds, you have
        limited time to get there before things escalate. You can't be everywhere: triage is the job.
      </p>
      <div className="bg-cream-100 rounded-lg p-4 text-xs text-club-900/70 leading-relaxed mb-6">
        <b>Controls:</b>{' '}
        {isTouch ? (
          <>the on-screen joystick to walk · the <b>HANDLE / TALK</b> button to act (best in landscape)</>
        ) : (
          <>Arrows / WASD to walk · <b>E</b> to handle a situation (or chat)</>
        )}{' '}
        · doors teleport you inside/outside the clubhouse.<br />
        <b>Judged on:</b> the four club stats <i>and</i> the culture card — Safety, Courtesy,
        Show, Efficiency. Choices are shuffled and nothing is free.
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim())}
        placeholder="Your name, General Manager"
        className="w-full rounded-lg border border-cream-200 bg-white px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-club-500"
      />
      <button onClick={() => name.trim() && onStart(name.trim())} disabled={!name.trim()} className={`${btn} disabled:opacity-40`}>
        Walk In
      </button>
      {hasSave && (
        <button onClick={onResume} className="w-full mt-2 border border-club-700 text-club-800 hover:bg-club-100 font-semibold rounded-lg py-3 transition-colors">
          Resume Saved Tenure
        </button>
      )}
      <p className="text-center mt-4">
        <a href="#" className="text-xs text-club-700 hover:underline">← Back to menu</a>
      </p>
    </Shell>
  )
}

export function SeasonScreen({
  state,
  onBeginDay,
  onNextSeason,
}: {
  state: WorldState
  onBeginDay: () => void
  onNextSeason: () => void
}) {
  const script = SEASON_SCRIPTS[state.seasonIndex]
  const reviewing = state.seasonGrades.length === state.seasonIndex + 1
  // Read the mentor's briefing aloud (if read-aloud is on).
  useEffect(() => {
    if (!reviewing) speak(script.mentorIntro.replace(/"/g, ''))
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.seasonIndex, reviewing])
  if (!reviewing) {
    return (
      <Shell>
        <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
          Year {script.year} · {script.seasonName} · {script.stage}
        </p>
        <h2 className="font-display text-3xl text-club-800 font-bold mb-5">{script.title}</h2>
        <div className="bg-cream-100 border-l-4 border-gold-500 rounded-r-lg p-5 mb-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              Your mentor — Century Golf regional director
            </p>
            {isVoiceEnabled() && (
              <button
                onClick={() => speak(script.mentorIntro.replace(/"/g, ''))}
                className="shrink-0 text-gold-600 border border-gold-500/40 rounded-full w-7 h-7 hover:bg-gold-500/10"
                title="Read aloud"
              >
                🔊
              </button>
            )}
          </div>
          <p className="text-sm text-club-900/80 leading-relaxed italic">{script.mentorIntro}</p>
        </div>
        <p className="text-sm text-club-900/80 mb-6">
          <b>Season goal:</b> {script.goalText}
        </p>
        <button onClick={onBeginDay} className={btn}>
          Begin Day 1 of {DAYS_PER_SEASON}
        </button>
      </Shell>
    )
  }
  const grade = state.seasonGrades[state.seasonIndex]
  const goalMet = state.stats[script.goalStat] >= script.goalValue
  return (
    <Shell>
      <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
        Season Review · {script.title}
      </p>
      <div className="text-center my-4">
        <span className={`font-display text-7xl font-bold ${grade === 'A' ? 'text-club-700' : grade === 'B' ? 'text-club-500' : 'text-amber-600'}`}>
          {grade}
        </span>
        <p className={`text-sm font-semibold mt-2 ${goalMet ? 'text-club-700' : 'text-red-600'}`}>
          {goalMet ? '✓ Season goal met' : '✗ Season goal missed'} — {script.goalText}
        </p>
      </div>
      <p className="text-sm text-club-900/80 leading-relaxed mb-6">
        {goalMet ? script.successBeat : script.failBeat}
      </p>
      <div className="mb-6">
        <StatRows state={state} />
      </div>
      <button onClick={onNextSeason} className={btn}>
        {state.seasonIndex + 1 < SEASON_SCRIPTS.length ? 'On to Next Season' : 'The Final Verdict'}
      </button>
    </Shell>
  )
}

export function DayRecap({ state, onContinue }: { state: WorldState; onContinue: () => void }) {
  const script = SEASON_SCRIPTS[state.seasonIndex]
  const lastDay = state.day + 1 >= DAYS_PER_SEASON
  return (
    <Shell>
      <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
        End of Day {state.day + 1} · Y{script.year} {script.seasonName}
      </p>
      <h2 className="font-display text-2xl text-club-800 font-bold mb-5">Locking Up</h2>
      <div className="space-y-2 mb-6">
        {state.resolvedToday.length === 0 && (
          <p className="text-sm text-club-900/50">A quiet day. They exist, apparently.</p>
        )}
        {state.resolvedToday.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg border border-cream-200 px-4 py-2.5">
            <span className="text-club-900/80">
              {r.missed ? '🚫' : r.quality === 2 ? '🟢' : r.quality === 1 ? '🟡' : '🔴'} {r.title}
            </span>
            <span className="text-[11px] text-club-900/50">
              {r.missed ? 'never handled' : r.late ? 'handled late' : `+${r.quality * 50} XP`}
            </span>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <StatRows state={state} />
      </div>
      <div className="mb-7">
        <CultureRows state={state} />
      </div>
      <button onClick={onContinue} className={btn}>
        {lastDay ? 'Face the Board' : `Sleep — Day ${state.day + 2} Awaits`}
      </button>
    </Shell>
  )
}

export function WorldEnd({ state, onReset }: { state: WorldState; onReset: () => void }) {
  const over = state.gameOver
  if (!over) return null
  const terminated = over.reason === 'terminated'
  const badges = earnedBadges(state.competencyScores)
  return (
    <Shell>
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{terminated ? '📦' : '🏆'}</div>
        <h2 className={`font-display text-3xl font-bold ${terminated ? 'text-red-700' : 'text-club-800'}`}>
          {terminated ? 'The Board Has Made a Change' : 'The Journey Complete'}
        </h2>
      </div>
      <p className="text-sm text-club-900/80 leading-relaxed mb-5 text-center">{over.message}</p>
      <p className="text-center text-2xl font-bold text-gold-600 mb-6">{state.xp} XP · Culture {cultureAvg(state.culture)}</p>
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {badges.map((b) => (
            <span key={b} className="bg-gold-500/15 text-gold-600 border border-gold-500/40 text-xs font-bold px-3 py-1.5 rounded-full">
              🎖 {b}
            </span>
          ))}
        </div>
      )}
      <div className="mb-4">
        <StatRows state={state} />
      </div>
      <div className="mb-7">
        <CultureRows state={state} />
      </div>
      <button onClick={onReset} className={btn}>
        New Tenure
      </button>
      <p className="text-center mt-4">
        <a href="#" className="text-xs text-club-700 hover:underline">← Back to menu</a>
      </p>
    </Shell>
  )
}
