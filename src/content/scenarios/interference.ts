import type { Scenario } from '../../engine/types'

/**
 * Board interference events — spawned when the micromanagement meter runs hot.
 * These model the documented failure pattern: boards drifting from governance
 * into operations. The player's job is to redirect without rupturing trust.
 */
export const INTERFERENCE_SCENARIOS: Scenario[] = [
  {
    id: 'green-speeds-order',
    competency: 'governance',
    pool: 'interference',
    title: 'BOARD INTERFERENCE: The Stimpmeter Directive',
    speaker: 'Bud Reinhart, Greens Chair',
    prompt:
      'Bud has been in the maintenance barn — again — this time ordering your superintendent to double-cut and roll the greens daily to hit "13 on the stimp, like a real club." Your superintendent says that speed will scorch the greens by August. Bud says he\'s "handled it."',
    choices: [
      {
        id: 'let-bud-win',
        label: 'Let it ride this season — he\'s the Greens Chair.',
        effects: { staffMorale: -6, memberSatisfaction: -2, boardConfidence: 1 },
        micro: 15,
        quality: 0,
        feedback:
          'Your superintendent now has two bosses and the greens have a death sentence. Every interference you absorb becomes the new normal — this is precisely the micromanagement spiral that drives GM failure. When August burns the greens, Bud will not be the one accountable. You will.',
      },
      {
        id: 'technical-showdown',
        label: 'Arm the superintendent with agronomy data and let him fight it out with Bud.',
        effects: { staffMorale: -2, boardConfidence: -3 },
        micro: 5,
        quality: 1,
        feedback:
          'You outsourced a governance problem to a staff member — the one person with the least standing to win it. Protecting staff from director pressure is the GM\'s job, not theirs. The chain must run: director → GM → superintendent. Take the meeting yourself, with the President if needed.',
      },
      {
        id: 'reassert-chain',
        label: 'Intervene: meet Bud with the agronomy data, reset the communication chain, and brief the President on the pattern.',
        effects: { staffMorale: 5, boardConfidence: 2, memberSatisfaction: 1 },
        micro: -15,
        quality: 2,
        feedback:
          'You put your body between the board and your staff — which is exactly where the GM/COO stands. Data made it about turf science, not ego; involving the President made it structural, not personal. Department heads who see you absorb this pressure will run through walls for you.',
      },
    ],
  },
  {
    id: 'daily-reports-demand',
    competency: 'governance',
    pool: 'interference',
    title: 'BOARD INTERFERENCE: The Daily Report Demand',
    speaker: 'Dee Calloway, Treasurer',
    prompt:
      'Dee, rattled by the club\'s finances, now wants DAILY revenue flash reports, weekly one-on-ones with your controller, and read access to the accounting system. "Just until I\'m comfortable. Trust, but verify."',
    choices: [
      {
        id: 'full-access',
        label: 'Give her everything — transparency can\'t be wrong.',
        effects: { boardConfidence: 2, staffMorale: -4, financialHealth: -1 },
        micro: 15,
        quality: 0,
        feedback:
          'Transparency and unfiltered operational access are different things. Your controller now works for two masters, daily numbers without context will generate weekly panics, and you\'ve normalized a director inside your operations. Oversight runs through governed reporting, not system logins.',
      },
      {
        id: 'stonewall',
        label: 'Refuse — the Treasurer gets the monthly board package like everyone else.',
        effects: { boardConfidence: -4 },
        micro: 8,
        quality: 1,
        feedback:
          'Structurally defensible, strategically deaf. Dee\'s demand is anxiety wearing a process costume — stonewalling treats the symptom and feeds the anxiety. Find what she\'s actually worried about, then design governed reporting that answers it: a richer monthly package beats a daily leak.',
      },
      {
        id: 'governed-reporting',
        label: 'Ask what question keeps her up at night — then propose an enhanced monthly dashboard and a quarterly deep-dive, adopted as board policy.',
        effects: { boardConfidence: 4, staffMorale: 2, financialHealth: 1 },
        micro: -15,
        quality: 2,
        feedback:
          'You converted surveillance into governance. Anxious directors don\'t actually want data — they want confidence, on a defensible cadence. A board-adopted reporting policy gives Dee her assurance, protects your controller, and sets the precedent that oversight is designed, not demanded. Masterful.',
      },
    ],
  },
  {
    id: 'nephew-hire',
    competency: 'leadership',
    pool: 'interference',
    title: 'BOARD INTERFERENCE: The President\'s Nephew',
    speaker: 'Tripp Vandenberg, President',
    prompt:
      'Tripp mentions — casually, at the end of an unrelated call — that his nephew "needs a summer thing" and the golf shop "could use the energy." The kid\'s résumé arrives an hour later. Your head pro has two better candidates and one opening.',
    choices: [
      {
        id: 'just-hire-him',
        label: 'Hire the nephew — it\'s one summer job, cheap goodwill.',
        effects: { boardConfidence: 3, staffMorale: -5 },
        micro: 12,
        quality: 0,
        feedback:
          'Cheap goodwill, expensive precedent. Your head pro just learned hiring authority is negotiable, the passed-over candidates\' families will hear why, and every director now knows the payroll takes referrals. Nepotism pressure is a classic personal-agenda intrusion — the club\'s interest lost to a director\'s.',
      },
      {
        id: 'quiet-no',
        label: 'Quietly have HR reject the application through the normal process.',
        effects: { staffMorale: 1, boardConfidence: -3 },
        micro: 6,
        quality: 1,
        feedback:
          'The process worked and the relationship took shrapnel — Tripp will hear "rejected" with no context and read it as a snub. Awkward conversations delegated to a process stay awkward. Call him yourself: the direct no, delivered with respect and a reason, is what straightforwardness (a named CMAA GM characteristic) looks like.',
      },
      {
        id: 'direct-conversation',
        label: 'Call Tripp directly: the pro shop hires on merit and his nephew is welcome to apply next cycle — then offer to intro the kid to a peer club\'s caddie program.',
        effects: { staffMorale: 4, boardConfidence: 1 },
        micro: -10,
        quality: 2,
        feedback:
          'A respectful no, delivered personally, with an off-ramp that helps the kid — you protected merit hiring AND the relationship. Presidents test new GMs with exactly these small asks; holding the line early, graciously, is what earns you the standing to hold it later on things that matter more.',
      },
    ],
  },
]
