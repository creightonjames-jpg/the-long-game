// Situations owned by the two clubhouse-officed department heads:
// Renée Marchetti (Membership & Marketing) and Marcus Webb (HR). Same
// ambiguity bar as the rest — no free wins, choices shuffled at render, and
// every one is culture-scored. These join the random event pools in sim.ts.
import type { EventDef } from '../types'

export const DIRECTOR_XFACTORS: EventDef[] = [
  {
    id: 'x-poaching',
    kind: 'xfactor',
    toast: 'Membership crisis — a rival club is poaching families',
    zone: 'Admin Offices',
    severity: 2,
    windowMin: 220,
    missPenalty: { memberSatisfaction: -3, financialHealth: -2 },
    scenario: {
      id: 'x-poaching',
      title: 'The Poaching War',
      speaker: 'Renée Marchetti, Membership & Marketing Director',
      competency: 'membership',
      prompt:
        'Lakeside — the club across town — just mailed our entire roster: initiation waived, first year half off. Three of our best young families suddenly "have a few questions." Renée wants a war chest to match the offer. The board will ask why we\'re paying to keep members we already recruited.',
      escalatedPrompt:
        'You got to it late. Two of the three families have already toured Lakeside, and the story — "Cedar Ridge didn\'t even call" — is making the rounds at school pickup.',
      choices: [
        {
          id: 'match',
          label: 'Authorize a matching discount to anyone who threatens to leave.',
          effects: { memberSatisfaction: 3, financialHealth: -4, boardConfidence: -2 },
          culture: { courtesy: 1, efficiency: -2 },
          quality: 1,
          feedback:
            'You stopped tonight\'s bleeding by starting a price war you can\'t win — Lakeside can always cut one more dollar. Worse, you just taught every member that a resignation threat unlocks a discount. Retention by ransom scales badly.',
        },
        {
          id: 'hold',
          label: 'Hold the line — a club that competes on price isn\'t worth belonging to.',
          effects: { financialHealth: 1, memberSatisfaction: -4 },
          culture: { courtesy: -2 },
          quality: 0,
          feedback:
            'Principled, and passive. "We don\'t compete on price" is only true if you compete on something else — and doing nothing while families walk isn\'t competing at all. The dues annuity you just lost funded more than the phone calls would have cost.',
        },
        {
          id: 'value-play',
          label: 'Skip the discount: you personally call each family, and Renée fast-tracks the experience upgrades Lakeside can\'t match.',
          effects: { memberSatisfaction: 4, staffMorale: 1, financialHealth: -1 },
          culture: { courtesy: 2, show: 1 },
          quality: 2,
          feedback:
            'The retention playbook: a personal call from the GM outweighs a coupon, and you fight on the axis Lakeside can\'t — belonging and experience, not price. Members rarely leave a club where they feel known. The cheapest thing you spent here was money.',
        },
      ],
    },
  },
  {
    id: 'x-referral-surge',
    kind: 'xfactor',
    toast: 'A member\'s viral post triggered a flood of applications',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 300,
    missPenalty: { financialHealth: -2 },
    scenario: {
      id: 'x-referral-surge',
      title: 'The Referral Surge',
      speaker: 'Renée Marchetti, waving her phone',
      competency: 'membership',
      prompt:
        'A member\'s post about the club went viral — 60 membership inquiries in four days, more than we normally see in a year. Renée wants to fast-track them all to blow past the budget. But rushed vetting risks the culture that made the club worth posting about, and the existing members are already asking who all these new faces are.',
      choices: [
        {
          id: 'fast-track',
          label: 'Approve them fast while the iron\'s hot — demand like this doesn\'t come twice.',
          effects: { financialHealth: 4, memberSatisfaction: -4, staffMorale: -1 },
          culture: { efficiency: 1, show: -2 },
          quality: 0,
          feedback:
            'You converted a brand moment into a character risk. The thing that went viral was the club\'s feel — dilute it with 60 rushed admits and you spend the very asset that created the surge. Growth that current members experience as invasion isn\'t growth; it\'s churn on a delay.',
        },
        {
          id: 'ignore-surge',
          label: 'Keep the normal admissions pace — hype fades, standards shouldn\'t.',
          effects: { financialHealth: -1, memberSatisfaction: 1 },
          culture: { show: 1, efficiency: -1 },
          quality: 1,
          feedback:
            'Protecting standards is right; treating a once-a-year demand spike as noise is a missed layup. You don\'t have to choose between rushing and ignoring — a waitlist captures the demand AND the standards. You left the middle option on the table.',
        },
        {
          id: 'structured-intake',
          label: 'Open a vetted waitlist, reward the member who posted, and let scarcity do the marketing.',
          effects: { financialHealth: 2, memberSatisfaction: 2, boardConfidence: 2 },
          culture: { show: 2, courtesy: 1 },
          quality: 2,
          feedback:
            'You turned a flash of demand into a durable asset: a real pipeline, protected standards, and a waitlist that makes membership feel earned. Rewarding the member who posted turns one advocate into a program. This is what "Full with a Wait List" actually looks like being built.',
        },
      ],
    },
  },
  {
    id: 'x-legacy-resign',
    kind: 'xfactor',
    toast: 'A legacy member is threatening to resign in the grill room',
    zone: 'Dining Room',
    severity: 2,
    windowMin: 150,
    missPenalty: { memberSatisfaction: -3, boardConfidence: -1 },
    scenario: {
      id: 'x-legacy-resign',
      title: 'The Legacy Ultimatum',
      speaker: 'a 41-year member, loudly, in a full grill room',
      competency: 'membership',
      prompt:
        'You introduced mobile tee-time booking. A 41-year member is holding court: "In my day you called the pro and he knew your name. This is a country club, not an app." He threatens to resign and "take his foursome." Half the room is old guard nodding along; the other half is the young families you\'ve been recruiting, watching.',
      escalatedPrompt:
        'By the time you arrive he\'s three drinks in and has an audience. Whatever you say now, you\'re saying it to the whole room.',
      choices: [
        {
          id: 'reverse',
          label: 'Announce you\'ll keep phone booking as the "primary" channel — smooth it over.',
          effects: { memberSatisfaction: 1, financialHealth: -1, boardConfidence: -1 },
          culture: { courtesy: 1, show: -1 },
          quality: 1,
          feedback:
            'You bought peace from the loudest man in the room and signaled to every young family watching that tradition has a veto. Sometimes the old guard is right — but caving publicly to a threat teaches the club that volume changes policy. The change wasn\'t the problem; the rollout was.',
        },
        {
          id: 'hold-public',
          label: 'Defend the change on the spot: "The app is here to stay — it\'s what younger members expect."',
          effects: { memberSatisfaction: -2, staffMorale: 1 },
          culture: { courtesy: -2 },
          quality: 0,
          feedback:
            'You won the argument and humiliated a 41-year member in his own grill room, in front of an audience that now has a martyr. Being right about the app doesn\'t make a public showdown the way to prove it. He came for reassurance he still belongs; you handed him a grievance instead.',
        },
        {
          id: 'honor-not-demand',
          label: 'Warmly walk him aside, have the pro personally book his group by phone anytime, and keep the app for everyone else.',
          effects: { memberSatisfaction: 3, staffMorale: 1, boardConfidence: 1 },
          culture: { courtesy: 2, show: 1 },
          quality: 2,
          feedback:
            'You honored the man without obeying the demand. His real fear wasn\'t the app — it was becoming a stranger in his own club, and a personal booking channel says "you still matter here." The young families saw a GM who respects tradition without being ruled by it. Change and belonging, both intact.',
        },
      ],
    },
  },
  {
    id: 'x-anon-complaint',
    kind: 'xfactor',
    toast: 'HR flagged an anonymous complaint about a manager',
    zone: 'Admin Offices',
    severity: 3,
    windowMin: 150,
    missPenalty: { staffMorale: -4 },
    scenario: {
      id: 'x-anon-complaint',
      title: 'The Anonymous Note',
      speaker: 'Marcus Webb, HR Manager, closing the door',
      competency: 'leadership',
      prompt:
        'An unsigned letter landed in Marcus\'s box: it alleges your banquet manager — beloved by members, the reason your events sell out — belittles his team after hours and hands the good shifts to favorites. No name, but specific dates. Marcus wants to know how you want to handle it.',
      escalatedPrompt:
        'While you sat on it, a second anonymous note arrived — angrier, and this time cc\'d to a board member. The delay is now part of the story.',
      choices: [
        {
          id: 'dismiss',
          label: 'Set it aside — anonymous and unsigned isn\'t something you can act on.',
          effects: { staffMorale: -5, boardConfidence: -1 },
          culture: { courtesy: -1, safety: -1 },
          quality: 0,
          feedback:
            'Anonymous doesn\'t mean baseless — it usually means the writer is afraid, which is itself a finding. Filing it teaches your staff that reporting a powerful colleague is pointless, guarantees the next complaint goes straight to a lawyer or a board member, and leaves real exposure unexamined. Fear is data.',
        },
        {
          id: 'confront',
          label: 'Pull the banquet manager in today and put the allegations to him directly.',
          effects: { staffMorale: -1, boardConfidence: -1 },
          culture: { efficiency: -1 },
          quality: 1,
          feedback:
            'Decisive, and premature. Confronting the accused before any fact-finding tips him off, risks retaliation against whoever spoke up, and skips the process that protects everyone — including him, if it\'s false. Take it seriously AND take it carefully; those aren\'t opposites.',
        },
        {
          id: 'careful-inquiry',
          label: 'Run a quiet, documented inquiry with Marcus — talk to the team, protect the reporter, follow the policy.',
          effects: { staffMorale: 4, boardConfidence: 2 },
          culture: { safety: 2, courtesy: 1 },
          quality: 2,
          feedback:
            'This is the moment your staff decide whether the club protects people or protects stars. A careful, confidential process finds the truth without a witch hunt, shields whoever was brave enough to write it, and gives the manager due process too. How you handle the quiet complaint sets the ceiling on how safe anyone feels raising the next one.',
        },
      ],
    },
  },
  {
    id: 'x-overtime',
    kind: 'xfactor',
    toast: 'Payroll shows the grounds crew drowning in overtime',
    zone: 'Facilities Office',
    severity: 2,
    windowMin: 260,
    missPenalty: { staffMorale: -3, financialHealth: -2 },
    scenario: {
      id: 'x-overtime',
      title: 'The Overtime Trap',
      speaker: 'Marcus Webb, payroll report in hand',
      competency: 'leadership',
      prompt:
        'The grounds crew has averaged 14 hours of overtime a week for two months. Labor cost is blowing the budget and two of your best guys look wrecked — one already mentioned a job with "normal hours." Cut the overtime and the course conditions slip (members will notice); add a hire and it\'s unbudgeted; do nothing and you\'re gambling with burnout.',
      choices: [
        {
          id: 'grind',
          label: 'Keep grinding through the season — everyone\'s tired, but the course looks perfect.',
          effects: { memberSatisfaction: 1, staffMorale: -5, financialHealth: -1 },
          culture: { show: 1, safety: -2 },
          quality: 0,
          feedback:
            'Immaculate greens maintained by exhausted people is a resignation — or an injury — waiting to happen, and both cost more than the overtime. You\'re spending your best crew\'s health to protect a number, and when they quit mid-season the course won\'t look perfect for long. Burnout is a slow layoff you didn\'t plan.',
        },
        {
          id: 'slash',
          label: 'Cut overtime to zero immediately — the budget can\'t take it.',
          effects: { financialHealth: 3, memberSatisfaction: -3, staffMorale: -1 },
          culture: { efficiency: 1, show: -1 },
          quality: 1,
          feedback:
            'The bleeding stops and the greens slow down — members will feel it within two weeks. A clean fiscal call that treats a staffing-design problem as a spending problem. Right direction, blunt instrument: the overtime was covering real work that doesn\'t disappear because you stopped paying for it.',
        },
        {
          id: 'funded-plan',
          label: 'Bring the board a funded fix: a seasonal hire, an overtime cap, and the turnover-cost math that justifies it.',
          effects: { financialHealth: -1, staffMorale: 4, boardConfidence: 2 },
          culture: { safety: 1, efficiency: 2 },
          quality: 2,
          feedback:
            'You reframed a payroll overage as what it is — a staffing-design gap — and brought the board a plan they can own with you. Turnover math almost always favors the hire once you count recruiting, training, and lost institutional knowledge. Protect the people and the number by fixing the system that pits them against each other.',
        },
      ],
    },
  },
  {
    id: 'x-reference-check',
    kind: 'xfactor',
    toast: 'A hiring decision just got complicated',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 320,
    missPenalty: { financialHealth: -1 },
    scenario: {
      id: 'x-reference-check',
      title: 'The Reference That Didn\'t Add Up',
      speaker: 'Marcus Webb, HR Manager',
      competency: 'leadership',
      prompt:
        'Your top pick for Assistant GM aced every interview — polished, sharp, everyone loved her. On the final reference call, her former club GM went quiet, then said only: "I\'d just... keep an eye on the expense reports." Nothing concrete. You have two solid-but-unremarkable backups and a seat to fill before the season starts.',
      choices: [
        {
          id: 'hire-anyway',
          label: 'Hire her — the interviews were exceptional and a vague hint isn\'t evidence.',
          effects: { financialHealth: -1, staffMorale: 1 },
          culture: { efficiency: -1 },
          quality: 0,
          feedback:
            'A former GM volunteering "watch the expense reports" about a finance-adjacent hire is not noise you get to round down because you liked her. Ignoring a specific, unprompted red flag from someone with nothing to gain is how clubs end up in an embezzlement postmortem writing "there were signs." Curiosity was free; you skipped it.',
        },
        {
          id: 'drop',
          label: 'Pass on her entirely and take the safe backup — you can\'t risk it.',
          effects: { staffMorale: -1 },
          culture: { efficiency: 1 },
          quality: 1,
          feedback:
            'Defensible caution — but you just ended a strong candidate\'s shot at your club on a sentence with no substance behind it, which is its own kind of unfair (and possibly a story about a rival GM torpedoing talent). Protecting the club doesn\'t require flying blind in either direction. You dodged a maybe-risk by discarding a maybe-star.',
        },
        {
          id: 'dig',
          label: 'Dig: a structured back-channel, a paid working session, and clear financial controls from day one.',
          effects: { staffMorale: 2, financialHealth: 1, boardConfidence: 1 },
          culture: { efficiency: 2, safety: 1 },
          quality: 2,
          feedback:
            'You treated the flag as a question, not a verdict. Back-channel references and a real working session surface far more than an interview, and day-one expense controls are just good governance regardless of who you hire. If she\'s clean, you land your star with confidence; if not, you found out before she found your checkbook.',
        },
      ],
    },
  },
]

export const DIRECTOR_DUTIES: EventDef[] = [
  {
    id: 'duty-pipeline-review',
    kind: 'duty',
    toast: 'Quarterly membership pipeline review',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 300,
    missPenalty: { memberSatisfaction: -2 },
    scenario: {
      id: 'duty-pipeline-review',
      title: 'The Pipeline Review',
      speaker: 'Renée Marchetti, funnel dashboard up',
      competency: 'membership',
      prompt:
        'Leads are up, but conversions are flat and the young-family category — the one you most want to grow — churns fastest, often within 18 months. Renée has budget for exactly ONE push this quarter: a splashy prospecting event, a new-member onboarding and mentorship program, or a win-back campaign aimed at recent resignations.',
      choices: [
        {
          id: 'prospecting',
          label: 'Fund the prospecting event — fill the top of the funnel.',
          effects: { memberSatisfaction: 1, financialHealth: -1 },
          culture: { show: 2, efficiency: -1 },
          quality: 1,
          feedback:
            'More leads into a funnel that already leaks is pouring water into a bucket with a hole. The event will look great and generate applicants who join and quietly quit inside two years — the exact pattern the data just showed you. Top-of-funnel is the fun problem; you have a bottom-of-funnel problem.',
        },
        {
          id: 'onboarding',
          label: 'Build the new-member onboarding + mentorship program — fix the churn.',
          effects: { memberSatisfaction: 3, staffMorale: 1, boardConfidence: 1 },
          culture: { courtesy: 2, efficiency: 1 },
          quality: 2,
          feedback:
            'You spent the dollar on the leak, not the faucet. Members who make a friend and learn the club\'s rhythms in their first 90 days stay for decades; the ones who wander in and never get integrated are your 18-month churn. Retention is cheaper than recruitment, and onboarding is where retention is actually won.',
        },
        {
          id: 'winback',
          label: 'Run the win-back campaign — cheaper to recover a lapsed member than find a new one.',
          effects: { memberSatisfaction: 1, financialHealth: 1 },
          culture: { courtesy: 1 },
          quality: 1,
          feedback:
            'A reasonable instinct — lapsed members are warm — but you\'re courting people back into the same experience that failed to hold them, without fixing why they left. Win-back works best AFTER you\'ve fixed the churn, not instead of it. You\'re re-recruiting into the leak.',
        },
      ],
    },
  },
  {
    id: 'duty-performance-reviews',
    kind: 'duty',
    toast: 'Annual performance review calibration',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 300,
    missPenalty: { staffMorale: -2 },
    scenario: {
      id: 'duty-performance-reviews',
      title: 'Review Season',
      speaker: 'Marcus Webb, review templates ready',
      competency: 'leadership',
      prompt:
        'Annual reviews are due. The easy path is what the club has always done: everyone "meets expectations," small equal raises, no waves. But you have two people quietly carrying their departments, and one long-tenured coaster everyone tiptoes around. Marcus asks how you want to run calibration.',
      choices: [
        {
          id: 'flat',
          label: 'Keep it flat — equal raises, no drama, everyone stays comfortable.',
          effects: { staffMorale: -1, financialHealth: -1 },
          culture: { courtesy: 1, efficiency: -2 },
          quality: 0,
          feedback:
            'Flat reviews feel kind and are quietly corrosive: your two stars just learned that carrying the team earns exactly what coasting earns, and the coaster learned nothing needs to change. "No waves" is a raise for mediocrity paid out of your best people\'s motivation. They notice. Then they leave.',
        },
        {
          id: 'differentiate',
          label: 'Differentiate honestly — reward the stars clearly, and give the coaster a direct, supported improvement plan.',
          effects: { staffMorale: 3, financialHealth: -1, boardConfidence: 1 },
          culture: { efficiency: 2, courtesy: 1 },
          quality: 2,
          feedback:
            'This is where "we treat mistakes as learning opportunities" meets "we never lay up." Recognizing your stars retains them; giving the coaster honest feedback and a real plan is more respectful than the comfortable silence that lets someone stall out for years. Fair isn\'t equal — fair is honest, with support attached.',
        },
        {
          id: 'quiet-bonus',
          label: 'Quietly bonus the two stars, but skip the hard conversation with the coaster.',
          effects: { staffMorale: 1, financialHealth: -1 },
          culture: { courtesy: -1, efficiency: 1 },
          quality: 1,
          feedback:
            'Half a loaf: you protected your stars for now, but "quietly" has a short shelf life — comp talk leaks, and the coaster you avoided is still coasting, still tiptoed around, still teaching everyone what the club tolerates. You did the easy right thing and skipped the hard one. Leadership is mostly the hard one.',
        },
      ],
    },
  },
]
