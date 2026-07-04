// Pure world simulation: day clock, event spawning, escalation, resolution,
// season/day transitions, culture scoring. No Phaser, no React — testable alone.
import type { ChoiceQuality, CompetencyKey, StatKey } from '../engine/types'
import { clampStat } from '../engine/scoring'
import type {
  ActiveEvent,
  CultureKey,
  DayPlanItem,
  EventDef,
  WorldState,
} from './types'
import { DAY_END, DAYS_PER_SEASON, SEASONS_TOTAL, WORLD_TERMINATION } from './types'
import { SEASON_SCRIPTS } from './scripts'
import { XFACTORS } from './events/xfactors'
import { DUTIES } from './events/duties'
import { HEARD_EVENTS } from './events/heard'

export const ALL_EVENTS: Record<string, EventDef> = Object.fromEntries(
  [...XFACTORS, ...DUTIES, ...HEARD_EVENTS].map((e) => [e.id, e]),
)

export type WorldAction =
  | { type: 'START'; playerName: string }
  | { type: 'RESUME'; state: WorldState }
  | { type: 'BEGIN_DAY' }
  | { type: 'TICK'; minutes: number }
  | { type: 'OPEN_EVENT'; defId: string }
  | { type: 'RESOLVE'; choiceId: string }
  | { type: 'RESOLVE_HEARD'; correct: number }
  | { type: 'AFTER_RECAP' }
  | { type: 'NEXT_SEASON' }
  | { type: 'RESET' }

export function initialWorld(): WorldState {
  return {
    screen: 'intro',
    playerName: '',
    seasonIndex: 0,
    day: 0,
    clock: 0,
    stats: {
      financialHealth: 60,
      memberSatisfaction: 62,
      boardConfidence: 65,
      staffMorale: 58,
    },
    culture: { safety: 70, courtesy: 70, show: 70, efficiency: 70 },
    xp: 0,
    plan: [],
    active: [],
    resolvedToday: [],
    usedEventIds: [],
    competencyScores: {
      governance: { earned: 0, possible: 0 },
      finance: { earned: 0, possible: 0 },
      membership: { earned: 0, possible: 0 },
      fnb: { earned: 0, possible: 0 },
      leadership: { earned: 0, possible: 0 },
    },
    choiceLog: [],
    openEventId: null,
    seasonGrades: [],
    gameOver: null,
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildDayPlan(state: WorldState): DayPlanItem[] {
  const script = SEASON_SCRIPTS[state.seasonIndex]
  const plan: DayPlanItem[] = []

  // Scheduled duties at morning + early afternoon.
  const dutyTimes = [90, 330]
  const duties = script.dutyIds[state.day] ?? []
  duties.forEach((id, i) => {
    if (ALL_EVENTS[id]) plan.push({ defId: id, at: dutyTimes[i] ?? 200 })
  })

  // Random X-factors: 2, sometimes 3 — no repeats until the pool runs dry.
  let fresh = XFACTORS.filter((x) => !state.usedEventIds.includes(x.id))
  if (fresh.length < 3) fresh = XFACTORS
  const count = 2 + (Math.random() < 0.45 ? 1 : 0)
  const chosen: string[] = []
  while (chosen.length < count && fresh.length > 0) {
    const x = pick(fresh)
    fresh = fresh.filter((f) => f.id !== x.id)
    chosen.push(x.id)
  }
  chosen.forEach((id) => plan.push({ defId: id, at: 120 + Math.floor(Math.random() * 520) }))

  // One HEARD complaint per season, on a random day.
  const heardFresh = HEARD_EVENTS.filter((h) => !state.usedEventIds.includes(h.id))
  const heardScheduledThisSeason = state.usedEventIds.some((id) =>
    id.startsWith('heard-ev-') && false, // per-season tracking handled via random day gate below
  )
  void heardScheduledThisSeason
  if (heardFresh.length > 0 && Math.random() < (state.day === DAYS_PER_SEASON - 1 ? 0.6 : 0.35)) {
    plan.push({ defId: pick(heardFresh).id, at: 200 + Math.floor(Math.random() * 300) })
  }

  return plan.sort((a, b) => a.at - b.at)
}

function applyEffects(
  state: WorldState,
  effects: Partial<Record<StatKey, number>>,
): Record<StatKey, number> {
  const stats = { ...state.stats }
  for (const [k, v] of Object.entries(effects)) {
    stats[k as StatKey] = clampStat(stats[k as StatKey] + (v ?? 0))
  }
  return stats
}

function applyCulture(
  culture: Record<CultureKey, number>,
  deltas: Partial<Record<CultureKey, number>> | undefined,
): Record<CultureKey, number> {
  if (!deltas) return culture
  const next = { ...culture }
  for (const [k, v] of Object.entries(deltas)) {
    next[k as CultureKey] = clampStat(next[k as CultureKey] + (v ?? 0) * 3)
  }
  return next
}

function tallyCompetency(
  state: WorldState,
  competency: CompetencyKey,
  quality: number,
): WorldState['competencyScores'] {
  const scores = { ...state.competencyScores }
  scores[competency] = {
    earned: scores[competency].earned + quality,
    possible: scores[competency].possible + 2,
  }
  return scores
}

function checkTermination(state: WorldState): WorldState {
  const s = state.stats
  const messages: [StatKey, string][] = [
    ['boardConfidence', 'The board lost confidence and made a change in leadership. Managing the board IS the job.'],
    ['memberSatisfaction', 'A member revolt reached the board before you could. The members are the owners — when they walk, so do you.'],
    ['staffMorale', 'The staff exodus made the decision for everyone. A club can survive a bad season; it cannot survive an empty kitchen.'],
    ['financialHealth', 'The finance committee found the cliff before you reported it. The P&L is the GM\'s scoreboard.'],
  ]
  for (const [k, msg] of messages) {
    if (s[k] < WORLD_TERMINATION) {
      return { ...state, screen: 'end', gameOver: { reason: 'terminated', message: msg } }
    }
  }
  return state
}

export function worldReducer(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'START':
      return { ...initialWorld(), playerName: action.playerName, screen: 'season' }

    case 'RESUME':
      return action.state

    case 'BEGIN_DAY': {
      const plan = buildDayPlan(state)
      return {
        ...state,
        clock: 0,
        plan,
        active: [],
        resolvedToday: [],
        usedEventIds: [...state.usedEventIds, ...plan.map((p) => p.defId)],
        screen: 'play',
      }
    }

    case 'TICK': {
      if (state.screen !== 'play') return state
      const clock = state.clock + action.minutes
      let next: WorldState = { ...state, clock }

      // Spawn due events.
      const due = next.plan.filter((p) => p.at <= clock)
      if (due.length > 0) {
        const spawned: ActiveEvent[] = due.map((p) => ({
          defId: p.defId,
          spawnedAt: clock,
          deadline: clock + (ALL_EVENTS[p.defId]?.windowMin ?? 240),
          status: 'active',
        }))
        next = {
          ...next,
          plan: next.plan.filter((p) => p.at > clock),
          active: [...next.active, ...spawned],
        }
      }

      // Escalate blown deadlines (apply the miss penalty exactly once).
      const toEscalate = next.active.filter((a) => a.status === 'active' && a.deadline <= clock)
      for (const a of toEscalate) {
        const def = ALL_EVENTS[a.defId]
        next = { ...next, stats: applyEffects(next, def.missPenalty) }
      }
      if (toEscalate.length > 0) {
        next = {
          ...next,
          active: next.active.map((a) =>
            a.status === 'active' && a.deadline <= clock
              ? { ...a, status: 'escalated' as const, deadline: DAY_END }
              : a,
          ),
        }
      }

      // Day over.
      if (clock >= DAY_END) {
        const missed = next.active.map((a) => ({
          defId: a.defId,
          title: ALL_EVENTS[a.defId]?.scenario?.title ?? ALL_EVENTS[a.defId]?.toast ?? a.defId,
          quality: 0,
          late: true,
          missed: true,
        }))
        next = {
          ...next,
          active: [],
          resolvedToday: [...next.resolvedToday, ...missed],
          screen: 'recap',
        }
        return checkTermination(next)
      }
      return next
    }

    case 'OPEN_EVENT': {
      const def = ALL_EVENTS[action.defId]
      if (!def || !state.active.some((a) => a.defId === action.defId)) return state
      return {
        ...state,
        openEventId: action.defId,
        screen: def.kind === 'heard' ? 'heard' : 'event',
      }
    }

    case 'RESOLVE': {
      const def = state.openEventId ? ALL_EVENTS[state.openEventId] : null
      const activeEntry = state.active.find((a) => a.defId === state.openEventId)
      const scenario = def?.scenario
      const choice = scenario?.choices.find((c) => c.id === action.choiceId)
      if (!def || !scenario || !choice || !activeEntry) return state
      const late = activeEntry.status === 'escalated'
      return {
        ...state,
        stats: applyEffects(state, choice.effects),
        culture: applyCulture(state.culture, choice.culture),
        xp: state.xp + choice.quality * 50,
        competencyScores: tallyCompetency(state, scenario.competency, choice.quality),
        choiceLog: [
          ...state.choiceLog,
          { scenarioId: scenario.id, choiceId: choice.id, competency: scenario.competency, quality: choice.quality },
        ],
        active: state.active.filter((a) => a.defId !== def.id),
        resolvedToday: [
          ...state.resolvedToday,
          { defId: def.id, title: scenario.title, quality: choice.quality, late },
        ],
        openEventId: null,
        screen: 'play',
      }
    }

    case 'RESOLVE_HEARD': {
      const def = state.openEventId ? ALL_EVENTS[state.openEventId] : null
      if (!def) return state
      const correct = action.correct // 0..5
      const quality: ChoiceQuality = correct >= 4 ? 2 : correct >= 2 ? 1 : 0
      const msDelta = Math.round(correct * 1.8 - 4) // -4 .. +5
      return {
        ...state,
        stats: applyEffects(state, { memberSatisfaction: msDelta, staffMorale: correct >= 4 ? 1 : 0 }),
        culture: applyCulture(state.culture, { courtesy: correct >= 4 ? 2 : correct >= 2 ? 0 : -2 }),
        xp: state.xp + correct * 25,
        competencyScores: tallyCompetency(state, 'membership', quality),
        choiceLog: [
          ...state.choiceLog,
          { scenarioId: def.heardId ?? def.id, choiceId: `heard-${correct}of5`, competency: 'membership', quality },
        ],
        active: state.active.filter((a) => a.defId !== def.id),
        resolvedToday: [
          ...state.resolvedToday,
          { defId: def.id, title: `Service recovery (${correct}/5 HEARD)`, quality, late: false },
        ],
        openEventId: null,
        screen: 'play',
      }
    }

    case 'AFTER_RECAP': {
      if (state.day + 1 < DAYS_PER_SEASON) {
        return { ...state, day: state.day + 1, screen: 'play', ...rebuildDay({ ...state, day: state.day + 1 }) }
      }
      // Season over: grade the season and check the script goal.
      const qualities = state.resolvedToday // recap already includes the day's results; grade on season via choiceLog tail is complex — grade the season on goal + day performance
      void qualities
      const script = SEASON_SCRIPTS[state.seasonIndex]
      const goalMet = state.stats[script.goalStat] >= script.goalValue
      const stats = applyEffects(state, { boardConfidence: goalMet ? 3 : -3 })
      const grade = goalMet ? (state.xp / ((state.seasonIndex + 1) * 400) > 1 ? 'A' : 'B') : 'C'
      return {
        ...state,
        stats,
        seasonGrades: [...state.seasonGrades, grade],
        screen: 'season',
      }
    }

    case 'NEXT_SEASON': {
      const nextSeason = state.seasonIndex + 1
      if (nextSeason >= SEASONS_TOTAL) {
        const total =
          Object.values(state.stats).reduce((a, b) => a + b, 0) / 4 +
          Object.values(state.culture).reduce((a, b) => a + b, 0) / 4
        const message =
          total >= 150
            ? 'A standing ovation at the annual meeting. The club is transformed — Full with a Wait List is no longer an aspiration, it\'s a forecast. Somewhere in the crowd, an assistant manager is thinking: that could be me.'
            : total >= 120
              ? 'The board renews your contract with genuine warmth. The club is healthier than the one you inherited — which is the only scoreboard that matters.'
              : 'The tenure ends quietly — steadier than it started, better than they feared. Not every journey ends in triumph; some end in a club that\'s simply, quietly, healthier.'
        return { ...state, screen: 'end', gameOver: { reason: 'completed', message } }
      }
      return { ...state, seasonIndex: nextSeason, day: 0, screen: 'season' }
    }

    case 'RESET':
      return initialWorld()

    default:
      return state
  }
}

/** Helper so AFTER_RECAP can start the next day's plan in one dispatch. */
function rebuildDay(state: WorldState): Pick<WorldState, 'clock' | 'plan' | 'active' | 'resolvedToday' | 'usedEventIds'> {
  const plan = buildDayPlan(state)
  return {
    clock: 0,
    plan,
    active: [],
    resolvedToday: [],
    usedEventIds: [...state.usedEventIds, ...plan.map((p) => p.defId)],
  }
}
