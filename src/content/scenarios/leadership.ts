import type { Scenario } from '../../engine/types'

export const LEADERSHIP_SCENARIOS: Scenario[] = [
  {
    id: 'pro-vs-super',
    competency: 'leadership',
    pool: 'core',
    title: 'The Aerification War',
    speaker: 'Two voicemails, both furious',
    prompt:
      'Your golf professional scheduled the member-guest invitational the same week your superintendent planned fall aerification — the agronomic window he says the course "cannot skip." Each expects you to overrule the other. They\'re no longer speaking.',
    choices: [
      {
        id: 'side-with-golf',
        label: 'Side with the pro — the member-guest is sacred; push aerification.',
        effects: { memberSatisfaction: 3, staffMorale: -4, financialHealth: -1 },
        quality: 0,
        feedback:
          'You just told your superintendent his expertise loses to event calendars — and delayed aerification compounds into worse greens next season, which members will also blame on you. Picking winners between department heads teaches them to lobby you instead of coordinating with each other.',
      },
      {
        id: 'split-difference',
        label: 'Impose a compromise: aerify nine holes at a time around the event.',
        effects: { memberSatisfaction: 1, staffMorale: -1 },
        quality: 1,
        feedback:
          'Workable — and you solved it FOR them, which means the next calendar collision also lands on your desk. The deeper failure is process: two department heads built calendars in isolation. Fix the system (joint annual calendar review) and this conflict class disappears.',
      },
      {
        id: 'facilitate-fix-system',
        label: 'Put them in one room to solve it together — then institute a joint annual calendar summit so it can\'t recur.',
        effects: { staffMorale: 4, memberSatisfaction: 2, boardConfidence: 1 },
        quality: 2,
        feedback:
          'Leadership is building the machine, not being the machine. Facilitating (rather than dictating) rebuilds the peer relationship they\'ll need for the next twenty conflicts, and the calendar summit turns a recurring collision into a solved system. Interpersonal-relations skill is a named CMAA GM/COO characteristic — this is it.',
      },
    ],
  },
  {
    id: 'member-conduct-report',
    competency: 'leadership',
    pool: 'core',
    title: 'The Complaint About Mr. Harrington',
    speaker: 'Dana, Banquet Captain',
    prompt:
      'Dana reports that a prominent 30-year member made repeated demeaning comments to two young servers at Saturday\'s event — she has specifics and both servers will confirm. "Everyone knows nothing happens when it\'s a member. Prove me wrong."',
    choices: [
      {
        id: 'smooth-over',
        label: 'Thank Dana, coach the servers on "managing difficult personalities," and let it fade.',
        effects: { staffMorale: -7, memberSatisfaction: 1 },
        quality: 0,
        feedback:
          'You confirmed exactly what Dana predicted — and the story is already in the staff group chat. Nothing destroys hospitality culture faster than staff learning management won\'t protect them from members. Turnover, silence on future incidents, and eventual liability all start here.',
      },
      {
        id: 'confront-member-solo',
        label: 'Call Mr. Harrington yourself and tell him to knock it off.',
        effects: { staffMorale: 3, memberSatisfaction: -2, boardConfidence: -2 },
        quality: 1,
        feedback:
          'Courageous — and structurally fragile. A GM freelancing member discipline invites "who do you think you are?" blowback with no institutional backing. Document the incident, follow the club\'s conduct process, and involve the President under the board-adopted policy. The club\'s rules, not your nerve, should carry the weight.',
      },
      {
        id: 'formal-process',
        label: 'Document everything, invoke the member-conduct policy with the President, and personally assure Dana and the servers of the outcome.',
        effects: { staffMorale: 6, boardConfidence: 2, memberSatisfaction: -1 },
        quality: 2,
        feedback:
          'This is the moment staff decide whether the club\'s values are real. Formal process protects the servers, the club, and even the member (due process cuts both ways) — and closing the loop with Dana turns a cynic into a believer. Integrity and accountability are CMAA\'s first-listed GM characteristics because everything else depends on them.',
      },
    ],
  },
  {
    id: 'wage-pressure',
    competency: 'leadership',
    pool: 'core',
    title: 'The Hotel Down the Road',
    speaker: 'Miguel, HR Manager',
    prompt:
      'A new resort hotel is hiring servers at $4/hour more than Cedar Ridge pays. You\'ve lost five line staff in six weeks; three more have interviews. Matching across the board costs $210K a year that isn\'t in the budget.',
    choices: [
      {
        id: 'hold-line',
        label: 'Hold the line on wages — the club "sells culture, not cash."',
        effects: { staffMorale: -6, memberSatisfaction: -3, financialHealth: 1 },
        quality: 0,
        feedback:
          '"Culture" that pays $4 under market is a resignation letter with extra steps. Service quality follows staffing quality with a one-season lag — members will feel this by summer. Wage benchmarking is data work, and right now the data says you\'re losing the auction for your own team.',
      },
      {
        id: 'match-everything',
        label: 'Match the hotel across the board and find the $210K later.',
        effects: { staffMorale: 5, financialHealth: -5, boardConfidence: -2 },
        quality: 1,
        feedback:
          'You stopped the bleeding and opened a budget wound. An unfunded $210K commitment surfaces at the worst moment — budget season — as YOUR variance. The stronger play: targeted increases where turnover risk is acute, funded by a board-approved plan, plus the total-compensation story (meals, scholarships, schedule stability) hotels can\'t match.',
      },
      {
        id: 'targeted-strategy',
        label: 'Bring the board a funded plan: targeted market adjustments for at-risk roles, a total-compensation upgrade, and turnover-cost math that justifies it.',
        effects: { staffMorale: 4, financialHealth: -2, boardConfidence: 4 },
        quality: 2,
        feedback:
          'You treated a wage crisis as a board-level strategy question — which it is, because it prices the member experience. Turnover math (recruiting, training, service errors) almost always favors retention spending, and a board that approves the plan owns it with you. Rosa Delgado just became your strongest ally.',
      },
    ],
  },
  {
    id: 'delegation-test',
    competency: 'leadership',
    pool: 'core',
    title: 'The Bottleneck Is You',
    speaker: 'Your own calendar',
    prompt:
      'It\'s 9 PM again. You personally approved this week\'s flower order, rewrote the newsletter, and re-did the banquet floor plan Danielle had already finished. Your department heads have started asking permission for things you gave them authority over months ago.',
    choices: [
      {
        id: 'keep-grinding',
        label: 'Keep the standards high — nobody sweats details like you do.',
        effects: { staffMorale: -4, boardConfidence: -1, memberSatisfaction: 1 },
        quality: 0,
        feedback:
          'You\'ve become the club\'s chief bottleneck officer. When every decision routes through you, department heads stop deciding — and stop growing. The GM/COO role is accountable for ALL club areas precisely so it can\'t be about doing them all personally. Clubs don\'t scale on a hero; they scale on a bench.',
      },
      {
        id: 'dump-and-run',
        label: 'Delegate everything at once — announce you\'re "out of the weeds" effective Monday.',
        effects: { staffMorale: 1, memberSatisfaction: -2 },
        quality: 1,
        feedback:
          'Whiplash delegation fails as predictably as hoarding. Authority without calibration produces early mistakes, which tempt you to snatch control back — confirming everyone\'s suspicion it was theater. Real delegation is staged: define the decision rights, set the guardrails, review outcomes not methods, and expand as trust compounds.',
      },
      {
        id: 'staged-delegation',
        label: 'Rebuild deliberately: written decision rights per department head, guardrails, and a weekly review of outcomes — not methods.',
        effects: { staffMorale: 5, boardConfidence: 2 },
        quality: 2,
        feedback:
          'Leadership development is a system, not a personality trait. Written decision rights end the permission-asking; outcome-based review keeps standards without hovering. In six months you\'ll have department heads who can run a season without you — which, not coincidentally, is what makes YOU promotable.',
      },
    ],
  },
  {
    id: 'succession-plan',
    competency: 'leadership',
    pool: 'core',
    title: 'The Clubhouse Manager\'s Question',
    speaker: 'Aisha, Clubhouse Manager',
    prompt:
      'Aisha — your best department head, CCM-track, two years of stellar reviews — asks directly: "Am I ever going to grow here, or should I be looking? A club two towns over wants to interview me for their AGM role."',
    choices: [
      {
        id: 'vague-promises',
        label: 'Tell her she\'s valued and "good things take time."',
        effects: { staffMorale: -4 },
        quality: 0,
        feedback:
          'Your best people always have options — vagueness is how clubs lose them politely. High performers don\'t need promises; they need a visible path with dates and skill milestones. She\'ll interview, she\'ll impress, and you\'ll write the congratulations card wishing you\'d had this conversation seriously.',
      },
      {
        id: 'block-reference',
        label: 'Discourage the interview — you can\'t afford to lose her right now.',
        effects: { staffMorale: -6, boardConfidence: -1 },
        quality: 0,
        feedback:
          'Retention by obstruction is the fastest trust-destroyer in management. She will find out, she will leave anyway, and every ambitious staffer will learn that growth requires escaping Cedar Ridge. Great clubs are known as places that PRODUCE GMs — that reputation recruits better than any salary.',
      },
      {
        id: 'build-agm-path',
        label: 'Build her a real path: propose an AGM role to the board, sponsor her CCM coursework, and hand her a P&L to own this year.',
        effects: { staffMorale: 6, boardConfidence: 2, financialHealth: -1 },
        quality: 2,
        feedback:
          'Succession planning is a named element of the CMAA Club Governance competency — and the industry\'s pipeline problem is real. An AGM role with genuine P&L ownership keeps Aisha, de-risks YOUR vacation, and gives the board continuity insurance. GMs who grow GMs never struggle to hire — or to get hired.',
      },
    ],
  },
]
