// X-factor events: the random texture of a real GM's day. Design rules:
// - No dominant option: every choice trades something real for something real.
// - Culture (Safety/Courtesy/Show/Efficiency) often cuts AGAINST the stat play.
// - Which "style" of answer wins varies by situation — no meta-pattern.
// - Choice display order is shuffled at render.
import type { EventDef } from '../types'

export const XFACTORS: EventDef[] = [
  {
    id: 'x-windshield',
    kind: 'xfactor',
    toast: 'Shattered windshield in the parking lot',
    zone: 'Parking Lot',
    severity: 2,
    windowMin: 210,
    missPenalty: { memberSatisfaction: -4 },
    scenario: {
      id: 'x-windshield',
      title: 'The Windshield',
      speaker: 'Mr. Petrakis, 22-year member, standing beside his new EV',
      competency: 'membership',
      prompt:
        'A slice off the 9th tee put a ball through Mr. Petrakis\'s windshield. He wants the club to pay — today. Club policy (and the sign he parked under) says errant shots are between players, and the golfer who hit it has already driven off. The repair is about $1,400. Six members are watching how this goes.',
      escalatedPrompt:
        'By the time you arrive, Mr. Petrakis has told the story to everyone on the patio — louder each time. The audience is now twenty members, and his position has hardened.',
      choices: [
        {
          id: 'pay-it',
          label: 'Have the club cover the repair as a one-time gesture.',
          effects: { memberSatisfaction: 4, financialHealth: -3, boardConfidence: -2 },
          culture: { courtesy: 2, efficiency: -1 },
          quality: 1,
          feedback:
            'Generous — and precedent-setting. Every future windshield now comes with "you paid for Petrakis." The gesture buys loyalty from one member and an invoice from the next ten. Some GMs make this call deliberately; the mistake is making it without realizing you just wrote policy in the parking lot.',
        },
        {
          id: 'hold-policy',
          label: 'Stand on policy: sympathize, but errant shots are player liability.',
          effects: { financialHealth: 1, memberSatisfaction: -4 },
          culture: { courtesy: -2, efficiency: 1 },
          quality: 1,
          feedback:
            'Defensible on paper, expensive in the dining room. Policy protected the P&L and cost you a 22-year relationship in front of an audience — retention math says that trade is rarely worth $1,400. Right answer at a daily-fee course; riskier at a private club where the member IS the owner.',
        },
        {
          id: 'broker-it',
          label: 'Track down the golfer who hit it, broker the insurance claim personally, and comp Petrakis dinner while it\'s handled.',
          effects: { memberSatisfaction: 3, staffMorale: 1, financialHealth: -1 },
          culture: { courtesy: 1, efficiency: 1 },
          quality: 2,
          feedback:
            'The GM-as-fixer play: policy holds (the golfer pays, as the sign says), but nobody gets abandoned in a parking lot. It costs you an hour and a dinner comp instead of $1,400 and a precedent. The catch: it only works if you actually close the loop — a dropped follow-up here is worse than either clean answer.',
        },
      ],
    },
  },
  {
    id: 'x-bartender',
    kind: 'xfactor',
    toast: 'Concern about the bartender at the member bar',
    zone: 'Dining Room',
    severity: 3,
    windowMin: 150,
    missPenalty: { staffMorale: -3, memberSatisfaction: -3 },
    scenario: {
      id: 'x-bartender',
      title: 'Eighteen Years Behind the Bar',
      speaker: 'Dana, Banquet Captain, quietly at your elbow',
      competency: 'leadership',
      prompt:
        '"Frank\'s slurring. I smelled it when he leaned in." Frank has poured drinks here for eighteen years — members ask for him by name, he knows every kid\'s graduation year. He is also, right now, visibly impaired behind a bar with forty members in the room and a full shift left.',
      escalatedPrompt:
        'You waited too long: Frank just dropped a tray of glasses and laughed it off. The room noticed. Two members exchanged looks. Whatever you do now happens in public.',
      choices: [
        {
          id: 'quiet-pull',
          label: 'Pull him off the floor now — "kitchen emergency" — send him home in a car, deal with it formally tomorrow.',
          effects: { staffMorale: 1, memberSatisfaction: 1 },
          culture: { safety: 2, show: 1, courtesy: 1 },
          quality: 2,
          feedback:
            'Safety first, dignity second, discipline third — in that order. You removed the risk (a impaired employee serving alcohol is a liability event waiting to happen) without a scene, and preserved due process for tomorrow when everyone is sober and documented. The hard part is doing the formal part tomorrow. Skipping it converts compassion into enablement.',
        },
        {
          id: 'ride-out',
          label: 'Watch him closely but let him finish the shift — eighteen years has earned a quiet conversation, not a public hook.',
          effects: { staffMorale: 2, financialHealth: 0 },
          culture: { safety: -2, courtesy: 1 },
          quality: 0,
          feedback:
            'Loyalty pointed the wrong direction. Every minute Frank stays behind that bar, the club is one over-pour from a dram-shop lawsuit and one stumble from an injury — and the staff who reported it learn that seniority buys exemption from safety. Protect the person, yes. Never by leaving the risk on the floor.',
        },
        {
          id: 'formal-now',
          label: 'Suspend him on the spot, document everything, and call HR tonight.',
          effects: { staffMorale: -3, boardConfidence: 1 },
          culture: { safety: 2, courtesy: -2 },
          quality: 1,
          feedback:
            'Procedurally airtight, humanly brutal. The safety call is right; doing it in front of the room he\'s served for eighteen years is the part people will remember — including the rest of your staff, who just learned mistakes here end in public execution. The formal process could have started tomorrow with the same legal standing and half the wreckage.',
        },
      ],
    },
  },
  {
    id: 'x-grease-fire',
    kind: 'xfactor',
    toast: '🔥 Fryer fire in the kitchen!',
    zone: 'Kitchen',
    severity: 3,
    windowMin: 120,
    missPenalty: { staffMorale: -3, financialHealth: -3 },
    scenario: {
      id: 'x-grease-fire',
      title: 'Flash Fire on the Line',
      speaker: 'Chef Laurent, extinguisher in hand, service half-plated',
      competency: 'fnb',
      prompt:
        'A fryer flared; the suppression system did its job. Nobody\'s hurt, the fire\'s out — and the line is coated in retardant with sixty covers on the books tonight and a health-code question hanging over everything. Chef wants to wipe down and push through; the sous chef is pale and shaking; the hood system needs a certified inspection before it legally protects you again.',
      escalatedPrompt:
        'You arrive twenty minutes late to find the debate settled without you: Chef is already cooking on the far line. Whatever you decide now, you\'re overruling something.',
      choices: [
        {
          id: 'push-through',
          label: 'Back Chef: deep-clean the affected station, cook on the far line, keep dinner service alive.',
          effects: { financialHealth: 2, memberSatisfaction: 2, staffMorale: -2 },
          culture: { safety: -2, show: 2 },
          quality: 1,
          feedback:
            'The show went on — over an uninspected suppression system. If anything sparks tonight, the club is operating an uncertified kitchen with knowledge of the deficiency, which is the sentence a plaintiff\'s attorney reads to a jury. Sixty dinners against that exposure is not a trade; it\'s a bet. Some nights you win it. That doesn\'t make it right.',
        },
        {
          id: 'close-kitchen',
          label: 'Close the kitchen: emergency-certify the hood before another burner lights. Offer members a comped cold buffet and honesty.',
          effects: { financialHealth: -3, memberSatisfaction: -1, staffMorale: 2 },
          culture: { safety: 2, show: -1, efficiency: -1 },
          quality: 2,
          feedback:
            'Safety is the first Quality Standard for a reason: it\'s the one you can\'t apologize your way back from. You lost a night of revenue and bought a kitchen full of people who watched the GM choose their safety over the P&L — that story compounds for years. The comped buffet turns a closure into a strangely memorable night. Members forgive candor; they never forgive a coverup that surfaces later.',
        },
        {
          id: 'split-call',
          label: 'Compromise: cold apps and salads only (no open flame), rush the inspector for tonight, full menu the second the hood is certified.',
          effects: { financialHealth: -1, memberSatisfaction: 1, staffMorale: 1 },
          culture: { safety: 1, efficiency: 1 },
          quality: 1,
          feedback:
            'Clever middle ground — no-flame service is genuinely lower risk, and rushing the inspection shows urgency. The exposure is smaller but not zero: "we kept serving after a fire" reads badly in any incident report regardless of what was on the menu. Reasonable operators disagree here; just be sure the sous chef who\'s still shaking gets sent home either way.',
        },
      ],
    },
  },
  {
    id: 'x-pool-slip',
    kind: 'xfactor',
    toast: 'A child slipped on the pool deck',
    zone: 'Pool',
    severity: 3,
    windowMin: 150,
    missPenalty: { memberSatisfaction: -4, boardConfidence: -2 },
    scenario: {
      id: 'x-pool-slip',
      title: 'The Wet Deck',
      speaker: 'Mrs. Ashford, holding her crying eight-year-old',
      competency: 'membership',
      prompt:
        'Her son slipped near the diving well — scraped chin, more scared than hurt. She is furious: "Where was the lifeguard? That deck has been slick all summer!" Your aquatics manager whispers the complicating fact: the deck WAS just hosed, no wet-floor signage out, and the incident log has two near-misses this month nobody escalated.',
      escalatedPrompt:
        'Mrs. Ashford has left — after photographing the deck, the missing signage, and the lifeguard chair. Her husband is an attorney. The moment for a human conversation is gone; what\'s left is damage control.',
      choices: [
        {
          id: 'comfort-first',
          label: 'Drop everything for the family: ice pack, sit with them, comp the cabana, personal follow-up call tonight — then quietly fix the deck protocol.',
          effects: { memberSatisfaction: 4, staffMorale: 0, financialHealth: -1 },
          culture: { courtesy: 2, safety: 1 },
          quality: 1,
          feedback:
            'Warm, human, and it will probably keep the Ashfords — but "quietly fix" is where this answer leaks. Two logged near-misses plus today means the club had notice of a hazard; handling it as a service gesture without a formal incident report and corrective action leaves the club legally naked if the next kid hits his head instead of his chin.',
        },
        {
          id: 'incident-protocol',
          label: 'Run the full protocol: incident report, photos, witness statements, immediate signage fix, and a documented corrective-action plan — while personally staying with the family through all of it.',
          effects: { memberSatisfaction: 2, boardConfidence: 2, staffMorale: -1 },
          culture: { safety: 2, courtesy: 1, efficiency: 1 },
          quality: 2,
          feedback:
            'The AND answer, and this time both halves are mandatory: documentation without warmth reads as lawyering-up against a member; warmth without documentation is negligence with good manners. The near-miss log is the real finding here — two warnings nobody escalated is a system failure, and Diagnose is the step of service recovery clubs skip most.',
        },
        {
          id: 'defend-staff',
          label: 'Defend the operation: accidents happen at pools, the lifeguard responded in seconds, and over-apologizing invites a claim.',
          effects: { staffMorale: 2, memberSatisfaction: -4, boardConfidence: -1 },
          culture: { safety: -1, courtesy: -2 },
          quality: 0,
          feedback:
            'The "don\'t admit fault" instinct is real insurance-industry advice — misapplied. There\'s a difference between not confessing liability and not showing a mother basic care while her child bleeds. And the staff you defended? They\'re the ones who didn\'t escalate two near-misses. You just told them that was fine.',
        },
      ],
    },
  },
  {
    id: 'x-pos-crash',
    kind: 'xfactor',
    toast: 'POS system down during dinner service',
    zone: 'Dining Room',
    severity: 2,
    windowMin: 180,
    missPenalty: { memberSatisfaction: -3, financialHealth: -2 },
    scenario: {
      id: 'x-pos-crash',
      title: 'The Screens Went Dark',
      speaker: 'Elena Ruiz, F&B Director, holding a dead terminal',
      competency: 'fnb',
      prompt:
        'The POS died mid-service — kitchen printers silent, forty tickets in limbo, servers improvising on notepads. Vendor support says "two to four hours." Elena can run paper chits old-school, but member charges will be reconstructed from memory, and the last time that happened the billing disputes ran for a month.',
      choices: [
        {
          id: 'paper-push',
          label: 'Go full paper: chits to the kitchen, handwritten member numbers, reconcile tomorrow. The dining room never blinks.',
          effects: { memberSatisfaction: 2, financialHealth: -2, staffMorale: -1 },
          culture: { show: 2, efficiency: -1 },
          quality: 1,
          feedback:
            'The show went on seamlessly — members never knew. The bill comes later, literally: reconstructed charges leak revenue and spawn disputes that cost more staff hours than the outage. A defensible call on a busy night; just own the reconciliation mess you signed up for, and put someone senior on it tomorrow, not the AP clerk.',
        },
        {
          id: 'comp-night',
          label: 'Turn the outage into theater: announce drinks on the house while the system\'s down, keep food orders simple, make it a story members tell.',
          effects: { memberSatisfaction: 4, financialHealth: -4 },
          culture: { show: 2, courtesy: 1, efficiency: -2 },
          quality: 1,
          feedback:
            'Hospitable and memorable — "the night the computers died and the wine flowed" is genuinely great club lore. It\'s also several thousand dollars of margin converted into vibes, and the finance committee will read this line item without the ambiance. Great clubs make this move occasionally, deliberately, and rarely. Know which night this is.',
        },
        {
          id: 'triage-tech',
          label: 'Split the room: simple paper service continues, but you personally work the vendor escalation chain — supervisor, then account manager — while a manager hand-logs every charge at the pass.',
          effects: { memberSatisfaction: 1, financialHealth: 1, staffMorale: 1 },
          culture: { efficiency: 2, show: 1 },
          quality: 2,
          feedback:
            'Unglamorous and correct: protect the member experience with paper, protect the ledger with a single controlled charge log, and attack the actual bottleneck — vendor queue position — with GM-level escalation. "Two to four hours" almost always means "you\'re in the general queue"; a GM on the phone with the account manager usually isn\'t. Efficiency is a Quality Standard because someone has to mind it during the theater.',
        },
      ],
    },
  },
  {
    id: 'x-cooler',
    kind: 'xfactor',
    toast: 'Walk-in cooler failing — banquet product at risk',
    zone: 'Kitchen',
    severity: 2,
    windowMin: 240,
    missPenalty: { financialHealth: -4 },
    scenario: {
      id: 'x-cooler',
      title: 'Forty-Eight Degrees and Climbing',
      speaker: 'Chef Laurent, thermometer in hand',
      competency: 'fnb',
      prompt:
        'The walk-in is at 48°F and rising — compressor\'s dying. Inside: $9,000 of product for tomorrow\'s 200-person wedding. Refrigeration company can come tonight for a $1,800 emergency call, or first thing tomorrow at standard rate. Chef thinks the food is fine "for now." Food-safety rules say potentially hazardous food above 41°F starts a clock you can\'t un-start.',
      choices: [
        {
          id: 'emergency-call',
          label: 'Pay the $1,800 emergency call tonight and rent a refrigerated trailer as backup.',
          effects: { financialHealth: -3, staffMorale: 1 },
          culture: { safety: 2, efficiency: 1 },
          quality: 2,
          feedback:
            'You spent $2,400 to protect $9,000 of product, a $30,000 wedding, and — the part with no price — 200 guests you won\'t send to the hospital. The food-safety clock is unforgiving and invisible: product that "seems fine" at hour four is the product that ends up in a health-department report at hour twelve. This is the least dramatic correct answer in club management.',
        },
        {
          id: 'ice-and-pray',
          label: 'Bridge it overnight: pack the walk-in with ice, move the most sensitive product to the bar coolers, service call at dawn.',
          effects: { financialHealth: 1, staffMorale: -1 },
          culture: { safety: -1, efficiency: 1 },
          quality: 1,
          feedback:
            'The scrappy answer, and honestly it often works — which is exactly why it\'s dangerous. You\'ve converted a solvable equipment problem into an all-night temperature gamble supervised by whoever drew the short straw. If the ice bridge holds, you saved $1,800. If it doesn\'t, you\'re re-buying $9,000 of product at 6 AM before a 200-top. Ask which headline you can live with.',
        },
        {
          id: 'toss-sensitive',
          label: 'Don\'t gamble with proteins: discard everything potentially hazardous now, re-order at dawn, eat the loss, fix the cooler tomorrow.',
          effects: { financialHealth: -4, memberSatisfaction: -1 },
          culture: { safety: 2, efficiency: -2 },
          quality: 1,
          feedback:
            'Maximum safety, maximum waste — you threw away product that a $1,800 service call could have saved. The instinct (never serve questionable food) is exactly right; the execution skipped the option that protected both the food AND the money. Absolutism is easier than judgment, but the club pays for the difference.',
        },
      ],
    },
  },
  {
    id: 'x-berate',
    kind: 'xfactor',
    toast: 'A member is berating a server in the dining room',
    zone: 'Dining Room',
    severity: 3,
    windowMin: 120,
    missPenalty: { staffMorale: -4 },
    scenario: {
      id: 'x-berate',
      title: 'The Table by the Window',
      speaker: 'You can hear it from the doorway',
      competency: 'leadership',
      prompt:
        'Mr. Callahan — top-tier member, biggest event spender in the club — is dressing down a nineteen-year-old server loudly enough that three tables have gone silent. Her hands are shaking. The infraction: she brought his scotch with one large cube instead of two small ones.',
      escalatedPrompt:
        'The server is crying in the side station and Callahan is holding court about "standards these days." The room watched the club\'s management be absent for it.',
      choices: [
        {
          id: 'extract-server',
          label: 'Walk over, warmly take over the table yourself, and send her on break — deal with Callahan\'s behavior privately after his meal.',
          effects: { staffMorale: 3, memberSatisfaction: 1 },
          culture: { courtesy: 2, show: 1 },
          quality: 2,
          feedback:
            'De-escalation in front of the room, accountability behind closed doors. The staff saw a GM step between them and abuse without humiliating a member publicly — both messages land. The trap: the "privately after" conversation is the load-bearing half. If Callahan doesn\'t hear clearly that staff abuse is a conduct issue regardless of spend, you performed protection without providing it.',
        },
        {
          id: 'confront-table',
          label: 'Address it at the table, now, in earshot: "We don\'t speak to our team that way here."',
          effects: { staffMorale: 4, memberSatisfaction: -3, boardConfidence: -2 },
          culture: { courtesy: 1, show: -2 },
          quality: 1,
          feedback:
            'Your staff will tell this story for a decade — the day the GM chose them over the biggest spender in the club, out loud. It\'s also a public shaming of a member in his own club, which converts a conduct problem into a faction problem: Callahan\'s friends now have a grievance with a face. Courage was right; the venue made it expensive. High-conviction move, real bill.',
        },
        {
          id: 'soothe-both',
          label: 'Smooth it over: apologize to Callahan for the drink, comp his round, give the server a sympathetic look and a quiet word later.',
          effects: { memberSatisfaction: 2, staffMorale: -5 },
          culture: { courtesy: -2, show: 1 },
          quality: 0,
          feedback:
            'You apologized to the aggressor and paid him for the outburst. Every server in the building now knows the exchange rate: member spend buys the right to abuse them, and management will cater the transaction. This is how hospitality staff cultures die — not in one scandal but in one comped scotch at a time.',
        },
      ],
    },
  },
  {
    id: 'x-dress-code',
    kind: 'xfactor',
    toast: 'Dress-code standoff at the pro shop',
    zone: 'Pro Shop',
    severity: 1,
    windowMin: 300,
    missPenalty: { staffMorale: -2 },
    scenario: {
      id: 'x-dress-code',
      title: 'Denim on the First Tee',
      speaker: 'Your Head Pro, on the radio, voice carefully neutral',
      competency: 'governance',
      prompt:
        'Judge Marbury\'s guest showed up in jeans and a t-shirt for their 10:40 tee time. The pro shop offered loaner attire; the guest laughed it off, and the Judge — House Committee member, dress-code author, ironically — said "he\'s with me" and started walking to the tee. Your assistant pro is 24 and not going to win this one alone.',
      choices: [
        {
          id: 'let-it-go',
          label: 'Radio the pro to stand down — one guest, one round, not the hill to die on.',
          effects: { memberSatisfaction: 1, staffMorale: -3 },
          culture: { show: -2 },
          quality: 0,
          feedback:
            'Smallest possible problem, worst possible lesson. Every member on the tee sheet saw the rule bend for the rule\'s own author, and your 24-year-old assistant learned the club won\'t back him on the standards it makes him enforce. Dress codes are trivial; whether staff can enforce standards on the powerful is not. That was the actual question, and "stand down" answered it.',
        },
        {
          id: 'gm-to-tee',
          label: 'Walk to the tee yourself, greet the Judge warmly, and cheerfully walk his guest to the shop: "Let\'s get you kitted out — on me."',
          effects: { staffMorale: 3, memberSatisfaction: 0 },
          culture: { show: 2, courtesy: 1 },
          quality: 2,
          feedback:
            'The rank problem solved with rank: what a 24-year-old can\'t say to a judge, a GM can — especially wrapped in hospitality. The comped polo costs $60 and buys three things: the standard held, the guest un-embarrassed, and an assistant pro who watched the club show up for him. Note the mechanism: you didn\'t argue the rule, you made compliance the gracious path.',
        },
        {
          id: 'paper-trail',
          label: 'Let the round proceed, then email the House Committee tonight asking them to clarify guest-attire enforcement — with today as the case study.',
          effects: { boardConfidence: 1, staffMorale: -1 },
          culture: { efficiency: 1, show: -1 },
          quality: 1,
          feedback:
            'Governance-brain: route the conflict to the body that owns the rule, with the author\'s own exception as Exhibit A — deliciously clean on paper. But the tee sheet watched the rule lose in real time, and process next week doesn\'t un-teach today\'s lesson. Right instrument, wrong tempo. The committee email is a good SECOND move after someone holds the line in person.',
        },
      ],
    },
  },
  {
    id: 'x-inspection',
    kind: 'xfactor',
    toast: 'Health inspector in the lobby — unannounced',
    zone: 'Kitchen',
    severity: 2,
    windowMin: 150,
    missPenalty: { boardConfidence: -3 },
    scenario: {
      id: 'x-inspection',
      title: 'The Clipboard',
      speaker: 'The county health inspector, badge out, at the kitchen door',
      competency: 'fnb',
      prompt:
        'Surprise inspection, mid-prep. The kitchen is 90% tight — but you know about the two soft spots: a walk-in shelf where raw chicken sits over produce when it\'s busy (it\'s busy), and a hand-sink the dish team uses as a dump sink. Chef is moving toward both of them, fast and not subtly. The inspector hasn\'t started yet.',
      choices: [
        {
          id: 'stall-and-scramble',
          label: 'Give Chef ninety seconds: walk the inspector through a slow, gracious welcome while the line quietly fixes what it can.',
          effects: { financialHealth: 1, staffMorale: 0 },
          culture: { show: 1, safety: -1 },
          quality: 1,
          feedback:
            'The universal kitchen play, and inspectors have seen it ten thousand times — most will let a gracious stall slide and score what they find. You\'ll likely dodge the violations today. What you didn\'t fix is that your kitchen only meets code when it has ninety seconds of warning, which means it doesn\'t meet code. The scramble IS the finding, even if it never makes the report.',
        },
        {
          id: 'full-transparency',
          label: 'Walk with the inspector openly, flag the two soft spots yourself, and ask for correction guidance on the record.',
          effects: { financialHealth: -2, boardConfidence: 1, staffMorale: 1 },
          culture: { safety: 2, efficiency: 1 },
          quality: 2,
          feedback:
            'Counterintuitive and correct: self-disclosed issues with a correction plan typically score better than discovered ones, and inspectors extend real goodwill to operators who treat them as partners instead of adversaries. You may take a minor ding today — and you\'ve bought a reputation with the county that pays off for years. Communicate Honestly isn\'t just an internal value; regulators can smell its absence.',
        },
        {
          id: 'lawyer-mode',
          label: 'Be correct and minimal: escort, answer only what\'s asked, volunteer nothing, let the score be the score.',
          effects: { financialHealth: 0, boardConfidence: 0 },
          culture: { efficiency: 1, courtesy: -1 },
          quality: 1,
          feedback:
            'The compliance-department answer: never wrong, never great. You avoided both the scramble\'s dishonesty and transparency\'s risk — and also its upside. Inspectors grade kitchens, but they remember operators. Neutral gets you a fair score today and no relationship equity for the day you need a re-inspection rushed before a wedding.',
        },
      ],
    },
  },
  {
    id: 'x-irrigation',
    kind: 'xfactor',
    toast: 'Irrigation main break flooding the 14th fairway',
    zone: 'Golf Course',
    severity: 2,
    windowMin: 240,
    missPenalty: { financialHealth: -3, memberSatisfaction: -2 },
    scenario: {
      id: 'x-irrigation',
      title: 'The Geyser on Fourteen',
      speaker: 'Your Superintendent, soaked to the knees',
      competency: 'finance',
      prompt:
        'A 40-year-old irrigation main let go under the 14th fairway — there\'s a geyser, then there\'ll be a swamp. The member-guest is in five days. Options are a $12K spot repair on a pipe that will break again, or the superintendent\'s pitch: "Give me $85K and three weeks, and I replace the whole back-nine main we both know is next." The capital budget has neither.',
      choices: [
        {
          id: 'spot-repair',
          label: 'Spot-repair for the member-guest; put the main replacement in next year\'s capital plan properly.',
          effects: { financialHealth: -2, memberSatisfaction: 2 },
          culture: { efficiency: 1, show: 1 },
          quality: 2,
          feedback:
            'Unheroic and disciplined: the tournament is saved, and an $85K unbudgeted emergency became a planned, board-approved, competitively-bid capital project — which will also come in cheaper than crisis pricing. The superintendent isn\'t wrong that the main is dying; he\'s wrong that a geyser is a procurement process. Know the difference between urgent and important; fund each through its proper door.',
        },
        {
          id: 'full-replace',
          label: 'Seize the moment: emergency-approve the $85K replacement — the board will back you with water on the fairway.',
          effects: { financialHealth: -5, boardConfidence: -2, staffMorale: 2 },
          culture: { efficiency: -1 },
          quality: 1,
          feedback:
            'The crisis-as-leverage play — and yes, boards approve things faster with a geyser on the highlight reel. But you just taught your department heads that the way to unlock capital is a spectacular failure, paid emergency prices for a plannable project, and spent $85K of board trust you\'ll want back in budget season. Sometimes right for genuinely-failing infrastructure; here the spot repair buys you a proper process.',
        },
        {
          id: 'patch-and-pray',
          label: 'Cheapest viable: have the crew clamp it in-house, keep the $12K, hope it holds through the tournament.',
          effects: { financialHealth: 1, memberSatisfaction: -1, staffMorale: -1 },
          culture: { efficiency: -1, safety: -1 },
          quality: 0,
          feedback:
            'An in-house clamp on a 40-year-old failed main, five days before the club\'s marquee event, is not thrift — it\'s a coin flip where tails is a flooded fairway DURING the member-guest. The $12K you saved will not be mentioned at that board meeting. Cheap that risks the mission isn\'t efficiency; it\'s deferred catastrophe with good intentions.',
        },
      ],
    },
  },
  {
    id: 'x-lightning',
    kind: 'xfactor',
    toast: '⛈ Storm cell inbound — players still on the course',
    zone: 'Golf Course',
    severity: 3,
    windowMin: 120,
    missPenalty: { boardConfidence: -3, memberSatisfaction: -2 },
    scenario: {
      id: 'x-lightning',
      title: 'Thirty Minutes Out',
      speaker: 'Your Head Pro, radar on his phone, horn button under his thumb',
      competency: 'governance',
      prompt:
        'A cell with lightning is tracking toward the course — maybe it clips you, maybe it slides south. The club championship semifinal is on the 15th hole. The Pro hesitates: "If I blow the horn and it misses, Chip Landry will have my head — he\'s two up with momentum." Strike detection says first strike risk in ~25 minutes.',
      choices: [
        {
          id: 'blow-horn',
          label: 'Blow it now. Clear the course, championship or not.',
          effects: { memberSatisfaction: -2, staffMorale: 1, boardConfidence: 1 },
          culture: { safety: 2, show: -1 },
          quality: 2,
          feedback:
            'The only defensible call, and everyone grumbling on the veranda knows it. Lightning policy exists precisely so that momentum, matches, and Chip Landry\'s mood have zero votes. Here\'s the leadership detail that matters: YOU took the decision (and the heat) rather than leaving the Pro to choose between safety and a board member\'s semifinal. Suspended matches resume; the other outcome doesn\'t.',
        },
        {
          id: 'monitor-close',
          label: 'Hold the horn, watch the radar, and stage carts at 14 and 16 for a fast evacuation if the track holds.',
          effects: { memberSatisfaction: 1 },
          culture: { safety: -2, efficiency: 1 },
          quality: 0,
          feedback:
            'This feels like prudence and is actually a bet that a storm cell will behave. "First strike in 25 minutes" is a model, not a promise — strikes lead cells by miles, and your evacuation plan requires the storm\'s cooperation. No tournament result survives the sentence "the club saw it coming and kept them out there." When the standard is Safety FIRST, "probably fine" is a decision to be unsafe.',
        },
        {
          id: 'delegate-pro',
          label: 'Tell the Pro it\'s his course and his call — you\'ll back whatever he decides.',
          effects: { staffMorale: 2, boardConfidence: -1 },
          culture: { safety: -1, courtesy: 1 },
          quality: 1,
          feedback:
            'Backing your people is usually right — which is what makes this one sneaky. The Pro just told you he\'s afraid of the political cost; handing him the call anyway delegates your accountability along with the decision, to someone who\'s already flinching. Delegation empowers when the delegate is free to choose well. When they\'re compromised, it\'s abdication wearing trust\'s jacket.',
        },
      ],
    },
  },
  {
    id: 'x-double-book',
    kind: 'xfactor',
    toast: 'Ballroom double-booked for Saturday',
    zone: 'Ballroom',
    severity: 2,
    windowMin: 240,
    missPenalty: { memberSatisfaction: -3, financialHealth: -2 },
    scenario: {
      id: 'x-double-book',
      title: 'Two Parties, One Ballroom',
      speaker: 'Danielle, Catering Director, two contracts in hand',
      competency: 'fnb',
      prompt:
        'A software glitch (and a resignation in her department) means Saturday holds both the Hendersons\' 50th-anniversary dinner for 60 — booked eleven months ago, members for three decades — and a $38K non-member corporate gala for 180, contracted, deposits cleared. Both have the ballroom in writing. It\'s Wednesday.',
      choices: [
        {
          id: 'members-first',
          label: 'The members keep the ballroom. Relocate the corporate gala with a discount and profuse apologies — eat the difference.',
          effects: { memberSatisfaction: 3, financialHealth: -4 },
          culture: { courtesy: 2, show: 1 },
          quality: 1,
          feedback:
            'The pure private-club answer: members are the owners; outside revenue rents THEIR house. A 30-year membership and a 50th anniversary outrank any single contract. The cost is real though — $38K events fund the amenities members enjoy, and a burned corporate client talks to other corporate clients. Right values; make sure the board hears the why before they see the number.',
        },
        {
          id: 'revenue-first',
          label: 'The gala\'s contract and deposit stand. Move the Hendersons to the private dining room — elevated, intimate, heavily comped.',
          effects: { financialHealth: 3, memberSatisfaction: -4 },
          culture: { courtesy: -2, efficiency: 1 },
          quality: 0,
          feedback:
            'Contractually tidy and culturally tone-deaf: you bumped 30-year members from their own ballroom, on their anniversary, for strangers\' money. However elegant the private dining room, the story the membership hears is "we got outbid in our own club." That sentence costs more than $38K in resignations — and it will be retold at every table for a year.',
        },
        {
          id: 'reinvent-both',
          label: 'Get creative: offer the Hendersons a reimagined celebration — tented terrace, sunset, string quartet, the GM as personal host — and keep the gala inside.',
          effects: { memberSatisfaction: 2, financialHealth: 2, staffMorale: -2 },
          culture: { show: 2, courtesy: 1, efficiency: 1 },
          quality: 2,
          feedback:
            'The hospitality jailbreak: refuse the either/or. IF the Hendersons feel upgraded rather than displaced — and that hinges entirely on how it\'s offered, by whom, with what sincerity — you keep the revenue, the relationship, and gain a legend. Note the honest costs: your ops team just inherited a build-out in three days (that\'s the morale hit), and if the family senses spin instead of care, this collapses into the worst version of option two. High ceiling, real floor.',
        },
      ],
    },
  },
  {
    id: 'x-vip-walkin',
    kind: 'xfactor',
    toast: 'A high-profile prospect is touring the club — unannounced',
    zone: 'Clubhouse Lobby',
    severity: 1,
    windowMin: 240,
    missPenalty: { memberSatisfaction: -1 },
    scenario: {
      id: 'x-vip-walkin',
      title: 'The Unannounced Tour',
      speaker: 'Your Membership Director, texting from the lobby: "HE\'S HERE. NOW."',
      competency: 'membership',
      prompt:
        'A recently relocated pro athlete — exactly the profile the young-member strategy dreams about — walked in unannounced with his agent, "just looking around." Your afternoon is stacked, the club is mid-shift-change scruffy, and half the membership will have opinions about celebrity members. He\'s standing in the lobby right now.',
      choices: [
        {
          id: 'drop-everything',
          label: 'Clear your afternoon and give the tour personally — this is the pipeline\'s biggest fish.',
          effects: { memberSatisfaction: 1, financialHealth: 2, staffMorale: -1 },
          culture: { show: 2, courtesy: 1 },
          quality: 1,
          feedback:
            'Nobody sells the club like the GM, and prospects remember being received by the top. Two quiet costs: the afternoon of operational work you dropped lands on someone, and a celebrity courted personally by the GM arrives with expectations of GM-level access forever. Great when it closes; just know you\'re pricing the relationship at signing.',
        },
        {
          id: 'best-team-play',
          label: 'Greet him warmly for five minutes, hand him to your Membership Director with a visible show of confidence, and rejoin for a drink at the turn.',
          effects: { memberSatisfaction: 1, financialHealth: 1, staffMorale: 2 },
          culture: { show: 1, courtesy: 1, efficiency: 1 },
          quality: 2,
          feedback:
            'The bracketed tour: GM warmth at the front, GM close at the back, and the professional whose actual job is membership running the middle. The prospect gets the full treatment; your Membership Director gets the biggest at-bat of her year WITH the GM\'s public endorsement; the club looks like a place with a deep bench rather than a one-man show. That\'s the institution selling itself — which is the product, really.',
        },
        {
          id: 'protocol-please',
          label: 'Politely schedule a proper tour for later this week — the club shows best by appointment, and today it\'s mid-shift-change.',
          effects: { financialHealth: -1, staffMorale: 1 },
          culture: { show: 1, courtesy: -1 },
          quality: 0,
          feedback:
            'You asked momentum to make an appointment. The instinct (show the club at its best) misreads what he\'s shopping for — athletes with agents can get polish anywhere; the walk-in was the test of how the place FEELS unstaged. "Come back Thursday" answers: like a place with a velvet rope pointing outward. The scruffy-but-warm tour beats the perfect-but-postponed one every time.',
        },
      ],
    },
  },
]
