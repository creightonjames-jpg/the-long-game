import type { Scenario } from '../../engine/types'

export const GOVERNANCE_SCENARIOS: Scenario[] = [
  {
    id: 'greens-chair-comp-tab',
    competency: 'governance',
    pool: 'core',
    title: 'The Comped Dinner Tab',
    speaker: 'Bud Reinhart, Greens Chair',
    prompt:
      'Bud catches you outside the grill room. "Take care of my foursome\'s dinner tonight, would you? Put it on the club." It\'s a $340 tab — the third time this quarter. He reminds you, smiling, that he sits on the board.',
    choices: [
      {
        id: 'comp-it',
        label: 'Comp the tab to keep the peace.',
        effects: { boardConfidence: 3, financialHealth: -3, staffMorale: -4 },
        micro: 5,
        quality: 0,
        feedback:
          'Short-term goodwill, long-term precedent. Your servers watched a director eat free while their tip pool shrank — and every future "favor" just got harder to refuse. A strong GM/COO protects consistent policy for ALL members; inconsistent comps erode staff trust and the P&L.',
        followUpId: 'comp-policy-followup',
      },
      {
        id: 'decline-politely',
        label: 'Decline warmly, citing club comp policy.',
        effects: { boardConfidence: -3, financialHealth: 2, staffMorale: 3 },
        quality: 1,
        feedback:
          'You defended policy and staff fairness — but you made yourself the "no," and Bud will remember. The governance-savvy move is to get a comp policy the BOARD approves, so the rule says no next time instead of you. That is the bridge role in action.',
      },
      {
        id: 'escalate-policy',
        label: 'Handle tonight gracefully, then bring a written comp policy to the next board meeting.',
        effects: { boardConfidence: 4, financialHealth: 1, staffMorale: 2 },
        micro: -5,
        quality: 2,
        feedback:
          'Textbook GM/COO. You avoided a public standoff, then moved the question where it belongs — board policy. Once the board owns the comp rules, no director can put you in this spot again, and staff see the standard applied evenly. Policy protects people.',
      },
    ],
  },
  {
    id: 'comp-policy-followup',
    competency: 'governance',
    pool: 'followUp',
    title: 'Word Gets Around',
    speaker: 'Elena Ruiz, F&B Director',
    prompt:
      'Two weeks later, Elena closes your office door. "Three different members asked servers to comp their wine last night — \'like you do for Mr. Reinhart.\' My team doesn\'t know what the rule is anymore. What do I tell them?"',
    choices: [
      {
        id: 'quiet-word',
        label: 'Tell her to use her judgment case-by-case and keep it quiet.',
        effects: { staffMorale: -4, financialHealth: -3 },
        micro: 3,
        quality: 0,
        feedback:
          'Ambiguity is where margins and morale go to die. When frontline staff have to improvise policy under member pressure, every interaction becomes a negotiation. Precedent compounds — that is why the comp decision was never really about $340.',
      },
      {
        id: 'own-it',
        label: 'Own the mistake: issue a written comp procedure today and take a policy proposal to the board.',
        effects: { staffMorale: 4, boardConfidence: 2, financialHealth: 1 },
        micro: -3,
        quality: 2,
        feedback:
          'Accountability is a named CMAA characteristic of successful GM/COOs — and you just modeled it. A written procedure gives staff cover, and moving the policy to the board converts a personal favor into governed process. This is how a GM recovers trust: fast, visible, structural.',
      },
    ],
  },
  {
    id: 'board-directs-staff',
    competency: 'governance',
    pool: 'core',
    title: 'An End-Run Around You',
    speaker: 'Marcy Ellison, House Chair',
    prompt:
      'Your executive chef mentions, awkwardly, that Marcy told him directly to redesign the Sunday brunch menu — "board decision," she said. It wasn\'t. No one told you, and the change would add $6K a month in food cost.',
    choices: [
      {
        id: 'let-it-ride',
        label: 'Let it go — she\'s the House Chair, and brunch is her lane.',
        effects: { boardConfidence: 1, financialHealth: -4, staffMorale: -5 },
        micro: 12,
        quality: 0,
        feedback:
          'You just taught the entire board that the org chart is optional. In the GM/COO model, ALL department heads report to the GM — that line exists so staff get one set of priorities and the club gets one accountable executive. Every end-run you allow invites three more.',
      },
      {
        id: 'confront-publicly',
        label: 'Raise it at the board meeting: directors must not direct staff.',
        effects: { boardConfidence: -5, staffMorale: 3 },
        micro: 5,
        quality: 1,
        feedback:
          'Right principle, costly venue. Correcting a director in open session makes it about her, not the structure — and boards close ranks. The stronger play is a private conversation with Marcy and the President, then a board-adopted communication protocol so the RULE does the enforcing.',
      },
      {
        id: 'private-reset',
        label: 'Meet Marcy privately, loop in the President, and propose a board-to-staff communication protocol.',
        effects: { boardConfidence: 3, staffMorale: 4, financialHealth: 1 },
        micro: -8,
        quality: 2,
        feedback:
          'This is the bridge role: firm on structure, gracious in delivery. You protected your chef, preserved Marcy\'s dignity, and converted a violation into policy the whole board owns. Clear governance separation — board sets strategy, management runs operations — is a top retention driver for GMs.',
      },
    ],
  },
  {
    id: 'committee-sprawl',
    competency: 'governance',
    pool: 'core',
    title: 'The Committee That Wants to Manage',
    speaker: 'Sylvia Trent, Director',
    prompt:
      'The new House Committee wants a standing WEEKLY meeting with you and your F&B Director to review "operations detail" — staffing decisions, vendor choices, menu pricing. Sylvia asks what you think before it goes to the board.',
    choices: [
      {
        id: 'accept-meetings',
        label: 'Accept — more communication with committees can\'t hurt.',
        effects: { boardConfidence: 2, staffMorale: -4, memberSatisfaction: -1 },
        micro: 12,
        quality: 0,
        feedback:
          'You just created a second boss for your F&B Director. Weekly operational review by a committee IS micromanagement — it slows decisions, splits accountability, and burns your best people. Committees advise on policy; they do not manage staff.',
      },
      {
        id: 'refuse-flat',
        label: 'Push back hard: committees have no business in operations.',
        effects: { boardConfidence: -4, staffMorale: 2 },
        micro: 3,
        quality: 1,
        feedback:
          'Structurally correct, politically clumsy. A flat "no" reads as defensiveness. Successful clubs give committees a charter: board-defined goals, policy scope, quarterly cadence. Offer the committee a meaningful advisory role and you get allies instead of adversaries.',
      },
      {
        id: 'charter-counter',
        label: 'Counter-propose: a committee charter with board-set goals, policy scope, and a monthly cadence.',
        effects: { boardConfidence: 4, staffMorale: 3 },
        micro: -8,
        quality: 2,
        feedback:
          'Exactly right. Limited committees with clear, board-defined goals are a documented driver of GM success and retention. A charter redirects committee energy from managing your staff to advising the board — everyone gets a meaningful role, and operations stay with management.',
      },
    ],
  },
  {
    id: 'capital-ambush',
    competency: 'governance',
    pool: 'core',
    title: 'The Boardroom Ambush',
    speaker: 'Chip Landry, Director',
    prompt:
      'Mid-meeting, Chip unveils a slide he made himself: a $450K short-game practice facility, "shovel-ready." It\'s not in the capital plan or the budget. Three directors nod along. All eyes turn to you.',
    choices: [
      {
        id: 'endorse-it',
        label: 'Ride the enthusiasm — endorse it on the spot.',
        effects: { boardConfidence: 4, financialHealth: -6 },
        micro: 6,
        quality: 0,
        feedback:
          'You just let excitement rewrite the capital plan. Unbudgeted projects approved on momentum crowd out funded priorities and teach directors that planning is theater. Fiduciary discipline is part of the Club Governance competency — the GM is its guardian even when it\'s unpopular.',
      },
      {
        id: 'kill-it',
        label: 'Oppose it flatly: "It\'s not in the plan."',
        effects: { boardConfidence: -5 },
        quality: 1,
        feedback:
          'Fiscally right, relationally wrong. You made Chip lose face in front of the board, and "not in the plan" sounds like "no forever." Better: honor the idea, route it through process — feasibility, member demand data, placement against reserve priorities. Process is how you say "not yet" without making enemies.',
      },
      {
        id: 'route-to-process',
        label: 'Welcome the idea and propose a feasibility study, ranked against the capital plan for next cycle.',
        effects: { boardConfidence: 3, financialHealth: 2 },
        micro: -5,
        quality: 2,
        feedback:
          'You protected both the capital plan and the relationship. Strategic planning discipline means every project competes on data — member demand, reserve impact, ROI — not on who brought the best slide. Chip stays engaged, the plan stays intact, and the board sees a GM who takes ideas seriously.',
      },
    ],
  },
  {
    id: 'policy-manual',
    competency: 'governance',
    pool: 'core',
    title: 'Rules Nobody Wrote Down',
    speaker: 'Sylvia Trent, Director',
    prompt:
      'After another meeting derailed by "how did we handle this last time?" debates, Sylvia corners you: "This club runs on folklore. Would a board policy manual help you — or is that just more paper?"',
    choices: [
      {
        id: 'more-paper',
        label: '"Honestly, we\'re too busy — folklore mostly works."',
        effects: { boardConfidence: -2 },
        micro: 8,
        quality: 0,
        feedback:
          'You passed on the single highest-leverage governance tool available. Without written policy, every precedent lives in someone\'s memory and every new board relitigates it — which is exactly how micromanagement starts. A policy manual is armor for the GM.',
      },
      {
        id: 'gm-writes-it',
        label: 'Offer to write it yourself and hand it to the board finished.',
        effects: { boardConfidence: 1, staffMorale: -1 },
        micro: 2,
        quality: 1,
        feedback:
          'Good instinct, wrong author. A manual the GM wrote alone is "the manager\'s rules" — easy for the next board to ignore. Facilitate the drafting, but make the BOARD deliberate and adopt it. Ownership is what makes policy stick through the one-third annual rotation.',
      },
      {
        id: 'facilitate-adoption',
        label: 'Champion it: facilitate a board working group to draft and formally adopt the manual.',
        effects: { boardConfidence: 5, staffMorale: 2 },
        micro: -10,
        quality: 2,
        feedback:
          'This is long-game governance. A board-adopted policy manual survives rotation, converts folklore into precedent, and is documented as a positive driver of GM retention. When next year\'s new directors arrive, the manual — not your persuasion — will hold the boundaries.',
      },
    ],
  },
]
