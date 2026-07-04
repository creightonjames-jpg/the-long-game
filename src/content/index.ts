import type { Scenario } from '../engine/types'
import { GOVERNANCE_SCENARIOS } from './scenarios/governance'
import { FINANCE_SCENARIOS } from './scenarios/finance'
import { MEMBERSHIP_SCENARIOS } from './scenarios/membership'
import { FNB_SCENARIOS } from './scenarios/fnb'
import { LEADERSHIP_SCENARIOS } from './scenarios/leadership'
import { INTERFERENCE_SCENARIOS } from './scenarios/interference'

export { INITIAL_BOARD, BOARD_BENCH } from './board'

const ALL: Scenario[] = [
  ...GOVERNANCE_SCENARIOS,
  ...FINANCE_SCENARIOS,
  ...MEMBERSHIP_SCENARIOS,
  ...FNB_SCENARIOS,
  ...LEADERSHIP_SCENARIOS,
  ...INTERFERENCE_SCENARIOS,
]

export const SCENARIOS: Record<string, Scenario> = Object.fromEntries(
  ALL.map((s) => [s.id, s]),
)
