import type { Scenario } from '../../engine/types'

export const FINANCE_SCENARIOS: Scenario[] = [
  {
    id: 'two-part-dues',
    competency: 'finance',
    pool: 'core',
    title: 'The Dues Cut Crusade',
    speaker: 'Warren Falk, Director',
    prompt:
      'Warren has the votes lining up: cut dues 10% and "make it up on F&B minimums and guest fees." He wants your blessing at Thursday\'s meeting. "Dues are what members complain about. Volume will cover the rest."',
    choices: [
      {
        id: 'back-the-cut',
        label: 'Back the cut — member-friendly and the board wants it.',
        effects: { boardConfidence: 3, memberSatisfaction: 3, financialHealth: -7 },
        quality: 0,
        feedback:
          'This is the classic two-part pricing mistake. Dues are the FIXED-cost engine of a private club — the course, the clubhouse, and insurance cost the same whether anyone dines. Variable revenue like F&B cannot reliably cover fixed costs, and next year\'s deficit will land on your desk, not Warren\'s.',
      },
      {
        id: 'oppose-hard',
        label: 'Oppose it outright as financially reckless.',
        effects: { boardConfidence: -4, financialHealth: 1 },
        quality: 1,
        feedback:
          'Right economics, no coalition. "Reckless" makes it a fight about Warren instead of the model. Bring the two-part pricing framework to the full board — show which costs are fixed, what dues actually fund, and what a 10% cut does to the reserve. Teach, don\'t veto.',
      },
      {
        id: 'teach-the-model',
        label: 'Present the two-part dues model to the board: fixed costs vs. variable revenue, with the 3-year projection.',
        effects: { boardConfidence: 4, financialHealth: 3 },
        micro: -5,
        quality: 2,
        feedback:
          'Exactly the financial leadership boards increasingly hire GMs for. Two-part pricing — dues cover fixed costs, usage fees cover variable costs — is the core economic literacy of club management, and misunderstanding it is a documented driver of club financial distress. You turned a vote into a finance seminar.',
      },
    ],
  },
  {
    id: 'budget-cuts',
    competency: 'finance',
    pool: 'core',
    title: 'The Deficit Budget',
    speaker: 'Dee Calloway, Treasurer',
    prompt:
      'Your draft budget shows a $180K operating deficit. Dee wants it balanced before it goes to the board. Your options aren\'t pretty: across-the-board departmental cuts, a dues increase, or trimming the agronomy plan the members love.',
    choices: [
      {
        id: 'across-the-board',
        label: 'Cut 4% from every department — share the pain equally.',
        effects: { financialHealth: 3, staffMorale: -5, memberSatisfaction: -3 },
        quality: 0,
        feedback:
          'Peanut-butter cuts feel fair and manage nothing. They punish your efficient departments, protect your bloated ones, and signal that analysis doesn\'t matter. Budgeting is a data exercise: benchmark each department, find the actual variances, and cut with a scalpel.',
      },
      {
        id: 'quiet-dues-bump',
        label: 'Propose a modest dues increase with no supporting narrative.',
        effects: { financialHealth: 4, memberSatisfaction: -4, boardConfidence: -2 },
        quality: 1,
        feedback:
          'The math works; the communication fails. A dues increase without a value story reads as "paying more for the same." Members will accept increases they understand — tie the number to what it protects (course conditions, service levels, reserve funding) and let the board champion it.',
      },
      {
        id: 'benchmark-first',
        label: 'Benchmark against comparable clubs first, then bring a targeted package: efficiency cuts + a justified dues adjustment.',
        effects: { financialHealth: 5, boardConfidence: 3, staffMorale: -1 },
        micro: -4,
        quality: 2,
        feedback:
          'Data before decisions — the heart of the CMAA Accounting, Finance & Data Analytics competency. Benchmarking shows the board where Cedar Ridge genuinely over-spends versus where it under-charges, so the fix targets causes instead of symptoms. This is how CFO-caliber GMs are made.',
      },
    ],
  },
  {
    id: 'fnb-purpose',
    competency: 'finance',
    pool: 'core',
    title: '"Why Does the Dining Room Lose Money?"',
    speaker: 'Marcy Ellison, House Chair',
    prompt:
      'Marcy slides the F&B P&L across the table: a $220K annual subsidy. "Any restaurant losing this much would be closed by Friday. I want a plan to get F&B to break even. This is embarrassing."',
    choices: [
      {
        id: 'promise-breakeven',
        label: 'Promise a break-even F&B plan: raise prices, cut hours, trim staff.',
        effects: { financialHealth: 3, memberSatisfaction: -6, staffMorale: -3 },
        quality: 0,
        feedback:
          'You just agreed to shrink the club\'s living room. Club F&B is not a restaurant — it\'s an amenity members already fund through dues, and "profitable" F&B usually means empty dining rooms and resignations. The subsidy isn\'t a failure; the unexamined subsidy is.',
      },
      {
        id: 'defend-subsidy',
        label: 'Tell her club F&B always loses money — that\'s just the industry.',
        effects: { boardConfidence: -3, financialHealth: -1 },
        quality: 1,
        feedback:
          '"That\'s just how it is" is true-ish and fatal to your credibility. Yes, most club F&B operates subsidized — but a strong GM can still tighten food cost, labor scheduling, and menu engineering. Defend the amenity model WITH a plan to run it efficiently, or the board will find someone who will.',
      },
      {
        id: 'reframe-and-tighten',
        label: 'Reframe F&B as a dues-funded amenity with a board-set subsidy target — then show your plan to hit it efficiently.',
        effects: { financialHealth: 3, boardConfidence: 4, memberSatisfaction: 1 },
        micro: -5,
        quality: 2,
        feedback:
          'The sophisticated answer. You moved the debate from "why a loss?" to "what member experience do we want, at what governed cost?" — a policy question the board should own. Then you paired philosophy with operating discipline. That combination is exactly what separates GM/COOs from food-and-beverage managers.',
      },
    ],
  },
  {
    id: 'capital-reserve',
    competency: 'finance',
    pool: 'core',
    title: 'The Roof and the Reserve',
    speaker: 'Dee Calloway, Treasurer',
    prompt:
      'The engineer\'s report is blunt: the clubhouse roof has 3–5 years left, a $900K replacement. The capital reserve holds $310K. Dee asks how you want to fund it. Half the board would rather not talk about it.',
    choices: [
      {
        id: 'defer-again',
        label: 'Defer — "3 to 5 years" means it\'s a future board\'s problem.',
        effects: { financialHealth: -2, boardConfidence: 2 },
        micro: 3,
        quality: 0,
        feedback:
          'Deferred maintenance is a silent tax that compounds. Clubs that skip reserve funding end up with emergency assessments at triple the planned cost — plus the leak damage. Inherited under-funded facilities are a documented structural driver of GM failure; don\'t hand that inheritance forward.',
      },
      {
        id: 'special-assessment-now',
        label: 'Propose an immediate one-time special assessment for the full amount.',
        effects: { financialHealth: 4, memberSatisfaction: -6, boardConfidence: -2 },
        quality: 1,
        feedback:
          'Financially clean, politically explosive. Surprise assessments are the #1 trigger of member revolts and board turnover. With a 3–5 year runway you have better tools: phased reserve contributions built into dues, so the roof is funded by the time it fails — no shock required.',
      },
      {
        id: 'reserve-study',
        label: 'Commission a full reserve study and propose phased annual funding built into the dues line.',
        effects: { financialHealth: 5, boardConfidence: 4, memberSatisfaction: -1 },
        micro: -5,
        quality: 2,
        feedback:
          'This is fiduciary stewardship. A reserve study converts one scary roof into a rational 20-year asset schedule, and phased funding spreads the burden fairly across the members who use the asset. Boards trust GMs who surface bad news early WITH a funding plan attached.',
      },
    ],
  },
  {
    id: 'guest-fee-leak',
    competency: 'finance',
    pool: 'core',
    title: 'The Unbilled Guests',
    speaker: 'Priya at the front desk (via your Controller)',
    prompt:
      'Your controller\'s audit of tee sheets vs. billing finds roughly $40K a year in unbilled guest fees — mostly regulars\' guests being waved through by staff who don\'t want awkward conversations with influential members.',
    choices: [
      {
        id: 'ignore-goodwill',
        label: 'Leave it alone — call it member goodwill, not leakage.',
        effects: { financialHealth: -3, staffMorale: -2 },
        quality: 0,
        feedback:
          '$40K of quiet leakage is a dues increase someone else will eventually pay — and staff learn that controls are optional when members push. Revenue integrity isn\'t stinginess; it\'s fairness to the majority of members who do pay their guest fees.',
      },
      {
        id: 'blame-staff',
        label: 'Tighten enforcement: staff will be written up for unbilled guests.',
        effects: { financialHealth: 3, staffMorale: -5 },
        quality: 1,
        feedback:
          'You fixed the number and broke the people. The root cause isn\'t lazy staff — it\'s that you\'ve asked $16/hour employees to police influential members with no system behind them. Fix the process (tee-sheet-to-billing automation, member-facing policy) before you touch discipline.',
      },
      {
        id: 'fix-the-system',
        label: 'Automate tee-sheet-to-billing, publish the guest policy to members, and give staff a script that puts the policy — not them — in charge.',
        effects: { financialHealth: 4, staffMorale: 3, memberSatisfaction: -1 },
        quality: 2,
        feedback:
          'Data-driven operations plus staff protection — both CMAA competencies in one move. Systems enforce evenly what humans enforce awkwardly. Members grumble for a month and then forget; your staff remember permanently that you built them cover instead of throwing them at the problem.',
      },
    ],
  },
]
