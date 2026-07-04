// Core domain types for the Club GM Simulator engine.
// Scenario content is pure data (see src/content) — the engine only knows these shapes.

export type StatKey =
  | 'financialHealth'
  | 'memberSatisfaction'
  | 'boardConfidence'
  | 'staffMorale'

export type CompetencyKey =
  | 'governance'
  | 'finance'
  | 'membership'
  | 'fnb'
  | 'leadership'

export const STAT_LABELS: Record<StatKey, string> = {
  financialHealth: 'Financial Health',
  memberSatisfaction: 'Member Satisfaction',
  boardConfidence: 'Board Confidence',
  staffMorale: 'Staff Morale',
}

export const COMPETENCY_LABELS: Record<CompetencyKey, string> = {
  governance: 'Club Governance',
  finance: 'Finance & Analytics',
  membership: 'Membership & Marketing',
  fnb: 'Food & Beverage',
  leadership: 'Leadership',
}

export const COMPETENCY_BADGES: Record<CompetencyKey, string> = {
  governance: 'Governance Steward',
  finance: 'Financial Strategist',
  membership: 'Membership Champion',
  fnb: 'F&B Operator',
  leadership: 'People Leader',
}

/** 0 = costly move, 1 = defensible, 2 = what a strong GM/COO would do */
export type ChoiceQuality = 0 | 1 | 2

export interface Choice {
  id: string
  label: string
  effects: Partial<Record<StatKey, number>>
  /** Delta to the board micromanagement meter (0–100). */
  micro?: number
  quality: ChoiceQuality
  /** Immediate coaching feedback, written in CMAA competency language. */
  feedback: string
  /** If set, this scenario is inserted next in the season queue. */
  followUpId?: string
}

export type ScenarioPool = 'core' | 'interference' | 'followUp'

export interface Scenario {
  id: string
  competency: CompetencyKey
  pool: ScenarioPool
  title: string
  /** Who confronts you — flavor line, e.g. "Hal Whitmore, Board President". */
  speaker?: string
  prompt: string
  choices: Choice[]
}

export interface BoardMember {
  name: string
  role: string
  agenda: string
}

export interface SeasonRecord {
  year: number
  seasonIndex: number
  grade: string
  xpEarned: number
  statsEnd: Record<StatKey, number>
  notes: string[]
}

export interface ChoiceLogEntry {
  scenarioId: string
  choiceId: string
  competency: CompetencyKey
  quality: ChoiceQuality
}

export type Screen =
  | 'start'
  | 'seasonIntro'
  | 'scenario'
  | 'feedback'
  | 'boardReview'
  | 'yearEnd'
  | 'gameOver'

export interface CompetencyScore {
  earned: number
  possible: number
}

export interface GameState {
  screen: Screen
  playerName: string
  year: number // 1-based
  seasonIndex: number // 0..3
  stats: Record<StatKey, number>
  /** Board micromanagement meter, 0–100. High values spawn interference events. */
  micromanagement: number
  xp: number
  competencyScores: Record<CompetencyKey, CompetencyScore>
  usedScenarioIds: string[]
  /** Scenario ids queued for the current season. */
  seasonQueue: string[]
  scenarioPos: number
  currentScenarioId: string | null
  lastChoice: { scenarioId: string; choiceId: string } | null
  board: BoardMember[]
  /** Board members who rotated in at the most recent year end (for the transition screen). */
  incomingBoard: BoardMember[]
  outgoingBoard: BoardMember[]
  history: SeasonRecord[]
  seasonLog: ChoiceLogEntry[]
  /** Cumulative log of every decision across the whole run (seasonLog resets each season). */
  fullLog: ChoiceLogEntry[]
  gameOver: null | { reason: 'completed' | 'terminated'; message: string }
}

export interface LeaderboardEntry {
  name: string
  xp: number
  badges: string[]
  outcome: 'completed' | 'terminated'
  date: string
}

/** Full record of a finished run — powers the leaderboard, manager dashboard, and remote sync. */
export interface RunRecord {
  name: string
  xp: number
  outcome: 'completed' | 'terminated'
  badges: string[]
  competencyScores: Record<CompetencyKey, CompetencyScore>
  /** Every decision made during the run, for aggregate "hardest decisions" analytics. */
  choiceLog: ChoiceLogEntry[]
  date: string
}

export const SEASON_NAMES = ['Spring', 'Summer', 'Fall', 'Winter'] as const
export const SEASONS_PER_YEAR = 4
export const TOTAL_YEARS = 2
export const SCENARIOS_PER_SEASON = 3
/** Board confidence below this at a season-end review means the board terminates you. */
export const TERMINATION_THRESHOLD = 15
/** Micromanagement at or above this injects an interference scenario next season. */
export const INTERFERENCE_THRESHOLD = 55
