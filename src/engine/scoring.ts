import type {
  ChoiceLogEntry,
  CompetencyKey,
  CompetencyScore,
  GameState,
  StatKey,
} from './types'
import { COMPETENCY_BADGES } from './types'

export function clampStat(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)))
}

export function seasonGrade(log: ChoiceLogEntry[]): string {
  if (log.length === 0) return 'C'
  const pct = log.reduce((s, e) => s + e.quality, 0) / (log.length * 2)
  if (pct >= 0.85) return 'A'
  if (pct >= 0.65) return 'B'
  if (pct >= 0.45) return 'C'
  if (pct >= 0.25) return 'D'
  return 'F'
}

/** Season-end bonus XP for keeping the club healthy overall. */
export function seasonBonusXp(stats: Record<StatKey, number>): number {
  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  return Math.max(0, Math.round((total - 240) / 2))
}

export function competencyPct(score: CompetencyScore): number {
  return score.possible === 0 ? 0 : score.earned / score.possible
}

/** Badges earned: >=75% quality across at least two scenarios in a track. */
export function earnedBadges(
  scores: Record<CompetencyKey, CompetencyScore>,
): string[] {
  return (Object.keys(scores) as CompetencyKey[])
    .filter((k) => scores[k].possible >= 4 && competencyPct(scores[k]) >= 0.75)
    .map((k) => COMPETENCY_BADGES[k])
}

export interface DebriefLine {
  competency: CompetencyKey
  pct: number
  answered: number
  note: string
}

const COACHING: Record<CompetencyKey, { strong: string; weak: string }> = {
  governance: {
    strong:
      'You consistently redirected the board toward policy and long-term governance while protecting management’s control of operations — the heart of the GM/COO model.',
    weak: 'Work on the strategy-vs-operations boundary: escalate policy questions to the board so the rule, not you personally, makes the hard calls. Review CMAA’s GM/COO "bridge" model.',
  },
  finance: {
    strong:
      'Strong command of club economics — two-part dues pricing, capital reserves, and reading the P&L before reacting. This is the competency boards increasingly hire for.',
    weak: 'Deepen your financial acumen: understand dues as fixed-cost recovery, benchmark before budgeting, and never treat F&B as a profit center without board-aligned policy.',
  },
  membership: {
    strong:
      'You treated member experience as a retention system, not a complaints queue — acting on sentiment data and protecting the membership pipeline.',
    weak: 'Focus on retention economics: every resignation is a dues annuity lost. Respond to sentiment signals early and visibly, and design onboarding that converts new members into engaged ones.',
  },
  fnb: {
    strong:
      'You balanced F&B cost discipline with its real role as the club’s living room — protecting margins without gutting the member experience.',
    weak: 'Sharpen F&B fundamentals: know your food-cost percentage, staff to demand curves, and frame F&B’s purpose (amenity vs. profit) explicitly with the board.',
  },
  leadership: {
    strong:
      'Department heads trust you: you delegated, developed successors, and defended staff fairness even under member pressure.',
    weak: 'Invest in your team: delegate real authority to department heads, address conflicts directly, and remember that staff morale is a leading indicator of member experience.',
  },
}

export function buildDebrief(
  scores: Record<CompetencyKey, CompetencyScore>,
): DebriefLine[] {
  return (Object.keys(scores) as CompetencyKey[]).map((k) => {
    const pct = competencyPct(scores[k])
    return {
      competency: k,
      pct,
      answered: Math.round(scores[k].possible / 2),
      note: pct >= 0.65 ? COACHING[k].strong : COACHING[k].weak,
    }
  })
}

/** The two competencies with the lowest quality percentage — resurfaced in year 2 (spaced repetition). */
export function weakestCompetencies(state: GameState): CompetencyKey[] {
  const keys = Object.keys(state.competencyScores) as CompetencyKey[]
  return [...keys]
    .sort(
      (a, b) =>
        competencyPct(state.competencyScores[a]) -
        competencyPct(state.competencyScores[b]),
    )
    .slice(0, 2)
}
