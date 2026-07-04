import type {
  BoardMember,
  Choice,
  GameState,
  Scenario,
  StatKey,
} from './types'
import {
  SEASONS_PER_YEAR,
  TERMINATION_THRESHOLD,
  TOTAL_YEARS,
} from './types'
import { clampStat, seasonBonusXp, seasonGrade } from './scoring'
import { buildSeasonQueue } from './selection'

export type Action =
  | { type: 'START'; playerName: string }
  | { type: 'RESUME'; state: GameState }
  | { type: 'BEGIN_SEASON' }
  | { type: 'CHOOSE'; choiceId: string }
  | { type: 'CONTINUE' }
  | { type: 'NEXT_SEASON' }
  | { type: 'BEGIN_YEAR' }
  | { type: 'RESTART' }

export interface EngineContent {
  scenarios: Record<string, Scenario>
  initialBoard: BoardMember[]
  boardBench: BoardMember[]
}

export function initialState(): GameState {
  return {
    screen: 'start',
    playerName: '',
    year: 1,
    seasonIndex: 0,
    stats: {
      financialHealth: 60,
      memberSatisfaction: 62,
      boardConfidence: 65,
      staffMorale: 58,
    },
    micromanagement: 20,
    xp: 0,
    competencyScores: {
      governance: { earned: 0, possible: 0 },
      finance: { earned: 0, possible: 0 },
      membership: { earned: 0, possible: 0 },
      fnb: { earned: 0, possible: 0 },
      leadership: { earned: 0, possible: 0 },
    },
    usedScenarioIds: [],
    seasonQueue: [],
    scenarioPos: 0,
    currentScenarioId: null,
    lastChoice: null,
    board: [],
    incomingBoard: [],
    outgoingBoard: [],
    history: [],
    seasonLog: [],
    fullLog: [],
    gameOver: null,
  }
}

function applyChoice(state: GameState, scenario: Scenario, choice: Choice): GameState {
  const stats = { ...state.stats }
  for (const [key, delta] of Object.entries(choice.effects)) {
    stats[key as StatKey] = clampStat(stats[key as StatKey] + (delta ?? 0))
  }

  // Micromanagement: explicit deltas from the choice, plus structural pressure —
  // a weak GM position OR a visibly struggling club invites board meddling.
  let micro = state.micromanagement + (choice.micro ?? 0)
  if (stats.boardConfidence < 40) micro += 5
  if (stats.memberSatisfaction < 40 || stats.staffMorale < 40) micro += 4
  micro = Math.max(0, Math.min(100, micro))

  const scores = { ...state.competencyScores }
  const track = scores[scenario.competency]
  scores[scenario.competency] = {
    earned: track.earned + choice.quality,
    possible: track.possible + 2,
  }

  const logEntry = {
    scenarioId: scenario.id,
    choiceId: choice.id,
    competency: scenario.competency,
    quality: choice.quality,
  }

  return {
    ...state,
    stats,
    micromanagement: micro,
    xp: state.xp + choice.quality * 50,
    competencyScores: scores,
    seasonLog: [...state.seasonLog, logEntry],
    fullLog: [...state.fullLog, logEntry],
    lastChoice: { scenarioId: scenario.id, choiceId: choice.id },
    screen: 'feedback',
  }
}

function endSeason(state: GameState): GameState {
  const grade = seasonGrade(state.seasonLog)
  const bonus = seasonBonusXp(state.stats)

  const notes: string[] = []
  if (state.stats.boardConfidence >= 70) notes.push('The board publicly backed your leadership.')
  if (state.stats.boardConfidence < 40)
    notes.push('Several directors are questioning your judgment in the parking lot.')
  if (state.stats.memberSatisfaction < 45)
    notes.push('Member sentiment is soft — resignation risk is rising.')
  if (state.stats.staffMorale < 40)
    notes.push('Department heads are quietly circulating résumés.')
  if (state.stats.financialHealth < 40)
    notes.push('The finance committee flagged the operating deficit.')
  if (notes.length === 0) notes.push('A steady season — the club is on solid footing.')

  const record = {
    year: state.year,
    seasonIndex: state.seasonIndex,
    grade,
    xpEarned: bonus + state.seasonLog.reduce((s, e) => s + e.quality * 50, 0),
    statsEnd: { ...state.stats },
    notes,
  }

  // Confidence-based meter decay: a trusted GM running a healthy club gets
  // breathing room. A pleased board atop a rotting club does not.
  const clubHealthy =
    state.stats.memberSatisfaction >= 45 && state.stats.staffMorale >= 45
  const micro =
    state.stats.boardConfidence > 60 && clubHealthy
      ? Math.max(0, state.micromanagement - 10)
      : state.micromanagement

  // Any dimension collapsing ends a GM tenure — not just board confidence.
  const terminationMessage = (() => {
    const s = state.stats
    if (s.boardConfidence < TERMINATION_THRESHOLD)
      return 'In executive session, the board voted to make a change in club leadership. Board confidence collapsed — remember: at a private club, managing the board IS the job.'
    if (s.memberSatisfaction < TERMINATION_THRESHOLD)
      return 'A member petition demanding new management reached 240 signatures before the board acted for you. Members are the owners — when they revolt, no board can protect a GM.'
    if (s.staffMorale < TERMINATION_THRESHOLD)
      return 'Three department heads resigned in a single month, and the exit interviews all named the same reason. The board concluded the club could replace one leader more easily than an entire staff.'
    if (s.financialHealth < TERMINATION_THRESHOLD)
      return 'The finance committee discovered the club would miss its loan covenant. The emergency board meeting lasted twenty minutes — and ended your tenure. The P&L is the GM’s scoreboard.'
    return null
  })()

  return {
    ...state,
    xp: state.xp + bonus,
    micromanagement: micro,
    history: [...state.history, record],
    screen: terminationMessage ? 'gameOver' : 'boardReview',
    gameOver: terminationMessage
      ? { reason: 'terminated', message: terminationMessage }
      : null,
  }
}

function rotateBoard(state: GameState, bench: BoardMember[]): GameState {
  // One-third of the board rotates each year — the structural reality of
  // private-club governance. Three directors leave; three arrive with agendas.
  const outgoing = state.board.slice(0, 3)
  const remaining = state.board.slice(3)
  const used = new Set(state.board.map((b) => b.name))
  const incoming = bench.filter((b) => !used.has(b.name)).slice(0, 3)
  return {
    ...state,
    board: [...remaining, ...incoming],
    outgoingBoard: outgoing,
    incomingBoard: incoming,
    // A new board must be won over — trust resets partially, meddling risk rises.
    stats: {
      ...state.stats,
      boardConfidence: clampStat(state.stats.boardConfidence - 8),
    },
    micromanagement: Math.min(100, state.micromanagement + 10),
    screen: 'yearEnd',
  }
}

export function makeReducer(content: EngineContent) {
  return function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
      case 'START': {
        const fresh = initialState()
        const started: GameState = {
          ...fresh,
          playerName: action.playerName,
          board: content.initialBoard,
          screen: 'seasonIntro',
        }
        return { ...started, seasonQueue: buildSeasonQueue(started, content.scenarios) }
      }

      case 'RESUME':
        return action.state

      case 'BEGIN_SEASON': {
        const first = state.seasonQueue[0] ?? null
        return {
          ...state,
          scenarioPos: 0,
          currentScenarioId: first,
          usedScenarioIds: first
            ? [...state.usedScenarioIds, first]
            : state.usedScenarioIds,
          screen: first ? 'scenario' : 'boardReview',
        }
      }

      case 'CHOOSE': {
        const scenario = state.currentScenarioId
          ? content.scenarios[state.currentScenarioId]
          : null
        const choice = scenario?.choices.find((c) => c.id === action.choiceId)
        if (!scenario || !choice) return state
        return applyChoice(state, scenario, choice)
      }

      case 'CONTINUE': {
        // Follow-up branch: consequences echo forward within the season.
        const last = state.lastChoice
        const lastScenario = last ? content.scenarios[last.scenarioId] : null
        const lastChoice = lastScenario?.choices.find((c) => c.id === last?.choiceId)
        const followUpId = lastChoice?.followUpId
        if (followUpId && content.scenarios[followUpId] && !state.usedScenarioIds.includes(followUpId)) {
          return {
            ...state,
            currentScenarioId: followUpId,
            usedScenarioIds: [...state.usedScenarioIds, followUpId],
            lastChoice: null,
            screen: 'scenario',
          }
        }

        const nextPos = state.scenarioPos + 1
        if (nextPos < state.seasonQueue.length) {
          const nextId = state.seasonQueue[nextPos]
          return {
            ...state,
            scenarioPos: nextPos,
            currentScenarioId: nextId,
            usedScenarioIds: [...state.usedScenarioIds, nextId],
            lastChoice: null,
            screen: 'scenario',
          }
        }
        return endSeason(state)
      }

      case 'NEXT_SEASON': {
        const nextSeason = state.seasonIndex + 1
        if (nextSeason < SEASONS_PER_YEAR) {
          const advanced: GameState = {
            ...state,
            seasonIndex: nextSeason,
            seasonLog: [],
            lastChoice: null,
            currentScenarioId: null,
            screen: 'seasonIntro',
          }
          return {
            ...advanced,
            seasonQueue: buildSeasonQueue(advanced, content.scenarios),
          }
        }
        if (state.year < TOTAL_YEARS) {
          return rotateBoard({ ...state, seasonLog: [] }, content.boardBench)
        }
        return {
          ...state,
          screen: 'gameOver',
          gameOver: {
            reason: 'completed',
            message:
              'Two full years at the helm of Cedar Ridge. The board renewed your contract — and the search committee chair called you "the steadiest hand this club has had in a decade."',
          },
        }
      }

      case 'BEGIN_YEAR': {
        const advanced: GameState = {
          ...state,
          year: state.year + 1,
          seasonIndex: 0,
          seasonLog: [],
          lastChoice: null,
          currentScenarioId: null,
          screen: 'seasonIntro',
        }
        return {
          ...advanced,
          seasonQueue: buildSeasonQueue(advanced, content.scenarios),
        }
      }

      case 'RESTART':
        return initialState()

      default:
        return state
    }
  }
}
