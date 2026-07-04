// v2 world-mode types. Extends (never replaces) the v1 engine types.
import type {
  ChoiceLogEntry,
  ChoiceQuality,
  CompetencyKey,
  CompetencyScore,
  StatKey,
} from '../engine/types'

/** Century Golf Quality Standards — the four operational culture dimensions. */
export type CultureKey = 'safety' | 'courtesy' | 'show' | 'efficiency'

export const CULTURE_LABELS: Record<CultureKey, string> = {
  safety: 'Safety',
  courtesy: 'Courtesy',
  show: 'Show',
  efficiency: 'Efficiency',
}

export interface WorldChoice {
  id: string
  label: string
  effects: Partial<Record<StatKey, number>>
  /** Culture-card scoring: Quality Standards deltas (-2..+2). */
  culture?: Partial<Record<CultureKey, number>>
  quality: ChoiceQuality
  feedback: string
}

export interface WorldScenario {
  id: string
  title: string
  speaker?: string
  prompt: string
  /** Shown instead of prompt when the GM arrives after the response window. */
  escalatedPrompt?: string
  competency: CompetencyKey
  choices: WorldChoice[]
}

export interface EventDef {
  id: string
  kind: 'duty' | 'xfactor' | 'heard'
  /** Short line for the alert toast, e.g. "Grease fire in the kitchen!" */
  toast: string
  zone: string
  severity: 1 | 2 | 3
  /** Game-minutes to respond before the situation escalates. */
  windowMin: number
  scenario?: WorldScenario
  heardId?: string
  /** Applied once when the response window lapses. */
  missPenalty: Partial<Record<StatKey, number>>
}

export interface ActiveEvent {
  defId: string
  spawnedAt: number
  deadline: number
  status: 'active' | 'escalated'
}

export interface DayPlanItem {
  defId: string
  at: number
}

// --- HEARD service-recovery mini-mechanic (Century Golf culture card) ---

export interface HeardOption {
  label: string
  correct: boolean
  response: string
}

export interface HeardStep {
  key: 'H' | 'E' | 'A' | 'R' | 'D'
  title: string
  prompt: string
  options: HeardOption[]
}

export interface HeardComplaint {
  id: string
  title: string
  speaker: string
  intro: string
  competency: CompetencyKey
  steps: HeardStep[]
}

// --- Season scripts (Hero's Journey) ---

export interface SeasonScript {
  title: string
  stage: string
  seasonName: string
  year: number
  /** The Mentor's guidance at season start, rooted in the culture card. */
  mentorIntro: string
  goalText: string
  goalStat: StatKey
  goalValue: number
  successBeat: string
  failBeat: string
  /** Scheduled duty event ids, one array per day of the season. */
  dutyIds: string[][]
}

// --- World game state ---

export type WorldScreen =
  | 'intro'
  | 'play'
  | 'event'
  | 'heard'
  | 'recap'
  | 'season'
  | 'end'

export interface ResolvedToday {
  defId: string
  title: string
  quality: number
  late: boolean
  missed?: boolean
}

export interface WorldState {
  screen: WorldScreen
  playerName: string
  seasonIndex: number // 0..7 (two years of four seasons)
  day: number // 0-based within season
  clock: number // game-minutes since 7:00 AM (day ends at 840 = 9:00 PM)
  stats: Record<StatKey, number>
  culture: Record<CultureKey, number>
  xp: number
  plan: DayPlanItem[]
  active: ActiveEvent[]
  resolvedToday: ResolvedToday[]
  usedEventIds: string[]
  competencyScores: Record<CompetencyKey, CompetencyScore>
  choiceLog: ChoiceLogEntry[]
  openEventId: string | null
  seasonGrades: string[]
  gameOver: null | { reason: 'terminated' | 'completed'; message: string }
}

export const DAY_END = 840 // 7:00 AM + 840 min = 9:00 PM
export const DAYS_PER_SEASON = 2
export const SEASONS_TOTAL = 8
export const WORLD_TERMINATION = 15

export function formatClock(clock: number): string {
  const total = 7 * 60 + Math.floor(clock)
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h = h24 > 12 ? h24 - 12 : h24
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}
