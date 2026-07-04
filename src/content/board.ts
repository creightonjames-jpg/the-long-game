import type { BoardMember } from '../engine/types'

/**
 * Cedar Ridge board of directors. Nine seats; one-third rotates each year —
 * the first three names roll off at year end and are replaced from the bench.
 */
export const INITIAL_BOARD: BoardMember[] = [
  { name: 'Hal Whitmore', role: 'President', agenda: 'Fiscal discipline — hates operating deficits' },
  { name: 'Dee Calloway', role: 'Treasurer', agenda: 'Wants monthly variance reporting and a funded capital reserve' },
  { name: 'Bud Reinhart', role: 'Greens Chair', agenda: 'Course conditions above all — and comps for his foursome' },
  { name: 'Marcy Ellison', role: 'House Chair', agenda: 'F&B experience — thinks the dining room "should make money"' },
  { name: 'Grant Osei', role: 'Membership Chair', agenda: 'Growing the young-professional pipeline' },
  { name: 'Sylvia Trent', role: 'Director', agenda: 'Long-range planning and a board policy manual' },
  { name: 'Chip Landry', role: 'Director', agenda: 'Golf program and tournament calendar' },
  { name: 'Rosa Delgado', role: 'Director', agenda: 'Staff culture — believes employees make the club' },
  { name: 'Warren Falk', role: 'Director', agenda: 'Keep dues flat, whatever it takes' },
]

/** Incoming directors available at rotation — each arrives with an agenda to manage. */
export const BOARD_BENCH: BoardMember[] = [
  { name: 'Tripp Vandenberg', role: 'Incoming President', agenda: 'Campaigned on "shaking things up" — wants quick visible wins' },
  { name: 'Nan Okafor', role: 'Director', agenda: 'Data-driven governance — wants benchmarking before every decision' },
  { name: 'Sonny Malone', role: 'Director', agenda: 'Thinks the club should run "like my business" — hands-on instincts' },
  { name: 'Priya Raman', role: 'Director', agenda: 'Family programming and racquet sports expansion' },
  { name: 'Gus Ferraro', role: 'Director', agenda: 'Old guard — resists any change to tradition' },
]
