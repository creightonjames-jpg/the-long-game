// Scheduled duties: the planned rhythm of the GM's day, assigned by season
// scripts. Written to the same ambiguity standard as X-factors.
import type { EventDef } from '../types'

export const DUTIES: EventDef[] = [
  {
    id: 'duty-preshift',
    kind: 'duty',
    toast: 'Morning pre-shift lineup',
    zone: 'Kitchen',
    severity: 1,
    windowMin: 300,
    missPenalty: { staffMorale: -3 },
    scenario: {
      id: 'duty-preshift',
      title: 'The Lineup',
      speaker: 'Fourteen staff in a half-circle, coffee in hand',
      competency: 'leadership',
      prompt:
        'Pre-shift, and you\'ve got five minutes of their attention. Last night had two service stumbles a member noticed; tonight has a 40-top; and corporate just sent the new upsell program every club is supposed to push. You can land ONE message before the day scatters them.',
      choices: [
        {
          id: 'fix-stumbles',
          label: 'Rerun last night\'s stumbles — walk through exactly what happened and how tonight goes differently.',
          effects: { memberSatisfaction: 2, staffMorale: -1 },
          culture: { show: 2, efficiency: 1 },
          quality: 1,
          feedback:
            'Service surgery in the morning meeting: specific, actionable, and slightly deflating at 8 AM. Post-mortems work best when the team dissects the play, not when the coach reruns the fumble — the information lands either way, but ownership only grows one of those ways. Fair call; watch whether the room leaves sharper or smaller.',
        },
        {
          id: 'tonight-forward',
          label: 'All energy forward: build the 40-top like a game plan — stations, timing, who\'s got what — and end on a high.',
          effects: { memberSatisfaction: 1, staffMorale: 2 },
          culture: { show: 1, efficiency: 1 },
          quality: 2,
          feedback:
            'Pre-shift is theater, and the show is confidence: a team that walks out with a plan and a pulse beats a team that walks out corrected. Last night\'s lessons fold into tonight\'s assignments without the autopsy ("Maria, you own the pass tonight" fixes yesterday without naming it). The corporate upsell? It\'ll keep a day. Momentum won\'t.',
        },
        {
          id: 'corporate-line',
          label: 'Deliver the upsell program — corporate tracks compliance, and the margin genuinely helps the club.',
          effects: { financialHealth: 2, staffMorale: -2 },
          culture: { efficiency: 1, show: -1 },
          quality: 0,
          feedback:
            'You spent your five minutes of human attention on a memo. The program matters — margins fund raises — but pre-shift is where culture happens, and the message "corporate wants" lands as noise from a team about to run a 40-top. Great GMs translate: bury the upsell inside the game plan ("feature the reserve cab tonight — it drinks beautifully with the short rib") and it becomes craft instead of compliance.',
        },
      ],
    },
  },
  {
    id: 'duty-course-walk',
    kind: 'duty',
    toast: 'Weekly course walk with the Superintendent',
    zone: 'Golf Course',
    severity: 1,
    windowMin: 300,
    missPenalty: { staffMorale: -2 },
    scenario: {
      id: 'duty-course-walk',
      title: 'The Range Question',
      speaker: 'Your Superintendent, kicking at a worn patch of turf',
      competency: 'finance',
      prompt:
        '"The range tee is dying. I need it closed two full weekends to reseed and recover — or it\'s dirt by August." The range does $4K of guest revenue a weekend, the pros teach there Saturdays, and the members who\'ll howl loudest are the ones who practice most. He\'s right about the agronomy. He\'s always right about the agronomy.',
      choices: [
        {
          id: 'close-weekends',
          label: 'Give him the two weekends. Eat the revenue, mats-only for lessons, over-communicate the why.',
          effects: { financialHealth: -2, staffMorale: 2, memberSatisfaction: -2 },
          culture: { efficiency: 1 },
          quality: 1,
          feedback:
            'You trusted the expert and paid retail for it: $8K of revenue plus two weekends of member grumbling. It\'s a defensible trade — dead turf costs more in reputation than reseeding costs in revenue — but check the assumption inside his ask: experts request ideal conditions, and "two full weekends" is his ideal, not necessarily his minimum. The question you didn\'t ask is the one that saves half the cost.',
        },
        {
          id: 'split-range',
          label: 'Counter: close HALF the range at a time — reseed in sections, keep revenue and lessons limping along.',
          effects: { financialHealth: 0, memberSatisfaction: 1, staffMorale: 0 },
          culture: { efficiency: 2 },
          quality: 2,
          feedback:
            'The negotiated middle that operations usually hides inside itself: most "full closure" requests decompose into phases if someone asks. Half-range keeps the pros teaching, the guests paying, and the seed growing — slower recovery, but August arrives with turf either way. The craft here isn\'t agronomy; it\'s knowing that the first version of any expert ask is the comfortable version, and the second version usually exists.',
        },
        {
          id: 'defer-fall',
          label: 'Push the reseed to fall — peak season revenue is sacred, and the tee just has to survive till September.',
          effects: { financialHealth: 2, staffMorale: -2, memberSatisfaction: 1 },
          culture: { efficiency: -1, show: -1 },
          quality: 0,
          feedback:
            'You just told your expert "I hear you, but no" on the thing he\'s expert in. If the tee is dirt by August — his exact prediction — the range revenue you protected disappears anyway, into a summer of mats and a superintendent who learns his forecasts don\'t move decisions. Deferring maintenance to protect the revenue the maintenance protects: the club-management ouroboros.',
        },
      ],
    },
  },
  {
    id: 'duty-budget-variance',
    kind: 'duty',
    toast: 'Monthly variance review with the Controller',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 300,
    missPenalty: { financialHealth: -2, boardConfidence: -2 },
    scenario: {
      id: 'duty-budget-variance',
      title: 'Three Lines in the Red',
      speaker: 'Your Controller, spreadsheet turned toward you',
      competency: 'finance',
      prompt:
        'The month closed with three ugly variances: F&B labor +11% (Elena says the wage adjustments you approved), utilities +18% (the old HVAC drinking electricity), and golf-shop merchandise sitting at 140 days of inventory. The board package goes out Friday. Your controller asks the loaded question: "How do you want to present this?"',
      choices: [
        {
          id: 'full-story',
          label: 'Present all three raw, each with cause and corrective action, in the main package.',
          effects: { boardConfidence: 2, financialHealth: 0 },
          culture: { efficiency: 1 },
          quality: 2,
          feedback:
            'Variances with causes and fixes attached aren\'t bad news — they\'re evidence of a management team that reads its own numbers. Boards punish surprises, not variances; the labor line even carries a story you WANT told (the wage plan the board approved, working as designed). The GM who narrates the red ink owns the narrative. The GM who buries it rents the narrative until someone else finds it.',
        },
        {
          id: 'smooth-quarter',
          label: 'Contextualize: fold the variances into quarter-to-date figures where they wash out, with a footnote.',
          effects: { boardConfidence: -1, financialHealth: 1 },
          culture: { efficiency: -1 },
          quality: 0,
          feedback:
            'Quarter-to-date is where monthly problems go to hide, and treasurers know it — Dee Calloway has been reading footnotes since before you were hired. When (not if) someone drills into the monthly detail, the question changes from "why is labor up?" to "why didn\'t you want us to see it?" The first question has a good answer. The second one never does.',
        },
        {
          id: 'fix-first',
          label: 'Hold the merchandise problem back one cycle — you want to arrive with the clearance plan already executing, not just promised.',
          effects: { financialHealth: 1, boardConfidence: 0 },
          culture: { efficiency: 1, show: 1 },
          quality: 1,
          feedback:
            'The "arrive with solutions" school: real logic, real risk. Showing up with a fix already moving is genuinely stronger than showing up with a promise — unless a board member wanders the golf shop this month, does shelf math, and wonders what else gets held back for staging. One cycle is probably survivable; the habit isn\'t. Transparency delayed for execution is a loan against trust — fine occasionally, ruinous on revolving credit.',
        },
      ],
    },
  },
  {
    id: 'duty-agenda-prep',
    kind: 'duty',
    toast: 'Board agenda prep with the President',
    zone: 'Admin Offices',
    severity: 1,
    windowMin: 300,
    missPenalty: { boardConfidence: -3 },
    scenario: {
      id: 'duty-agenda-prep',
      title: 'What Makes the Agenda',
      speaker: 'Hal Whitmore, President, reviewing the draft with a pen',
      competency: 'governance',
      prompt:
        'Thursday\'s agenda has room for one discussion item beyond the routine. Competing for the slot: Chip Landry\'s practice-facility pitch (again, now with renderings), your capital-reserve funding proposal (unsexy, overdue), and a member petition about pool hours with 80 signatures. Hal looks up: "Your call. What are we actually talking about Thursday?"',
      choices: [
        {
          id: 'reserve-slot',
          label: 'The reserve proposal. It\'s the most important and the least fun — which is exactly why it needs the slot.',
          effects: { financialHealth: 2, boardConfidence: 1, memberSatisfaction: -1 },
          culture: { efficiency: 2 },
          quality: 2,
          feedback:
            'Governance discipline: the agenda is the club\'s attention, and attention spent on renderings and pool hours is attention the roof never gets. Landing the boring-but-vital item takes stagecraft — lead with the engineer\'s photos, not the spreadsheet — but a reserve funded in calm is a special assessment avoided in crisis. The petition gets a written response; Chip gets a feasibility process. Everything gets handled; only one thing gets the hour.',
        },
        {
          id: 'chip-slot',
          label: 'Give Chip his moment — he\'s brought it three times, he has votes, and stonewalling a director has its own costs.',
          effects: { boardConfidence: 2, financialHealth: -2 },
          culture: { courtesy: 1, efficiency: -1 },
          quality: 1,
          feedback:
            'Reading the room is a real skill: a director with votes and momentum doesn\'t evaporate because you keep him off the agenda — he organizes in the parking lot instead. Giving Chip a structured hearing (with your feasibility framework attached) beats an ambush later. The cost: your reserve proposal ages another month, and capital priorities set by persistence rather than analysis is exactly how clubs end up with beautiful short-game facilities and forty-year-old irrigation.',
        },
        {
          id: 'petition-slot',
          label: 'The petition. Eighty signatures is the membership talking — ignoring it for internal priorities is how boards drift from members.',
          effects: { memberSatisfaction: 2, boardConfidence: -1, financialHealth: -1 },
          culture: { courtesy: 2, efficiency: -1 },
          quality: 1,
          feedback:
            'Honoring member voice is good instinct with a scale problem: pool hours are an OPERATIONS question — you could adjust them Tuesday with a memo — and elevating operations to the board table teaches members that petitions outrank management, and teaches the board to manage. The governance-clean play: fix the hours yourself, announce it warmly, and spend Thursday\'s hour on something only the board can do. The signatures deserved a response, not an agenda slot.',
        },
      ],
    },
  },
  {
    id: 'duty-one-on-one',
    kind: 'duty',
    toast: 'One-on-one with a struggling manager',
    zone: 'Facilities Office',
    severity: 1,
    windowMin: 300,
    missPenalty: { staffMorale: -3 },
    scenario: {
      id: 'duty-one-on-one',
      title: 'The Gray Zone',
      speaker: 'Gus, Facilities Manager, 22 years at the club',
      competency: 'leadership',
      prompt:
        'Gus knows every pipe and breaker on the property — and his preventive-maintenance program has quietly collapsed. Work orders sit for weeks, the HVAC variance traces to filters nobody changed, and two of his techs have hinted they\'re looking. He\'s 61, proud, four years from the retirement he talks about. This is the one-on-one where something has to be said.',
      choices: [
        {
          id: 'direct-plan',
          label: 'Name it directly: the program has slipped, here\'s the data, and here\'s a 90-day plan we build together — with real check-ins.',
          effects: { staffMorale: 1, financialHealth: 1 },
          culture: { efficiency: 2, courtesy: 1 },
          quality: 2,
          feedback:
            'Respect is honesty with a plan attached. The kind lie ("everything\'s fine, Gus") costs him his techs, the club its equipment, and eventually Gus the dignified exit he\'s earned — because year four of slippage ends in a termination, not a retirement party. A 90-day plan built WITH him treats him as the professional he\'s been for 22 years. Whether he climbs back or chooses the off-ramp, he does it with the truth in hand. Educate is a team value precisely for conversations like this.',
        },
        {
          id: 'restructure-around',
          label: 'Don\'t break him — restructure around him: promote his best tech to "operations lead" under Gus\'s title, and let the new energy carry the program.',
          effects: { staffMorale: -1, financialHealth: 1 },
          culture: { courtesy: 1, efficiency: 1 },
          quality: 1,
          feedback:
            'The org-chart workaround: it fixes the filters and dodges the conversation. Sometimes it even works. But everyone in the maintenance barn can read the new boxes — including Gus, who now reports to a fiction, and the promoted tech, who has responsibility without authority. You\'ve traded one honest hard conversation for a permanent diplomatic ambiguity. Occasionally that\'s wisdom. Usually it\'s a hard conversation with compound interest.',
        },
        {
          id: 'ride-to-retirement',
          label: 'He\'s four years out and owed some grace — cover the gaps quietly, backfill with contractors, let a good man land softly.',
          effects: { staffMorale: -2, financialHealth: -2 },
          culture: { courtesy: 1, efficiency: -2 },
          quality: 0,
          feedback:
            'Loyalty misspelled: four YEARS is not a soft landing, it\'s a fifth of a career on autopilot — and everyone watching. The techs eyeing the door will take it (why grow where slippage is tenured?), the contractor spend becomes a permanent line item, and the kindness meant for Gus lands as unfairness to everyone carrying his slack. Grace and standards aren\'t opposites; grace WITHOUT standards is just deferred cruelty distributed to bystanders.',
        },
      ],
    },
  },
  {
    id: 'duty-event-tasting',
    kind: 'duty',
    toast: 'Wedding tasting — the couple, the mother, and Chef',
    zone: 'Ballroom',
    severity: 1,
    windowMin: 300,
    missPenalty: { memberSatisfaction: -2, financialHealth: -1 },
    scenario: {
      id: 'duty-event-tasting',
      title: 'The Tasting',
      speaker: 'Danielle, intercepting you at the ballroom door',
      competency: 'fnb',
      prompt:
        '"Small situation." The bride (member\'s daughter) loves Chef\'s menu. The mother of the bride — who is paying, and who is a member of the wine committee — wants half the menu replaced with dishes from a restaurant in the city, recipes attached. Chef has read the recipes and gone quiet in the way that precedes either resignation or arson.',
      choices: [
        {
          id: 'back-chef',
          label: 'Back Chef\'s menu with the couple\'s blessing as the trump card — the bride loves it, and the bride outranks the checkbook.',
          effects: { staffMorale: 3, memberSatisfaction: -2 },
          culture: { show: 1, courtesy: -1 },
          quality: 1,
          feedback:
            'Artistically righteous: you defended your chef\'s craft and the actual client\'s preference. But "the bride outranks the checkbook" is a lovely sentiment the checkbook doesn\'t share — and this checkbook sits on the wine committee and dines here weekly. The wedding will be wonderful; the eleven months of pointed committee comments afterward, less so. Winning the menu and losing the member is a trade worth making consciously, not triumphantly.',
        },
        {
          id: 'collab-menu',
          label: 'Reframe it as a collaboration: Chef "interprets" two of the city dishes in his own style, the rest of his menu stands, and the mother gets billing as the inspiration.',
          effects: { staffMorale: 1, memberSatisfaction: 2, financialHealth: 1 },
          culture: { show: 2, courtesy: 2 },
          quality: 2,
          feedback:
            'The hospitality translation layer: the mother\'s real order wasn\'t those recipes — it was significance. "Chef\'s interpretation, inspired by Madame\'s discovery" gives her authorship, gives Chef creative control (interpretation is his domain), and gives the couple their menu. Almost every "impossible demand" in events is a status need wearing a logistics costume. Solve the status, and the logistics get shockingly flexible.',
        },
        {
          id: 'customer-is-right',
          label: 'She\'s paying and she\'s a member: tell Chef to execute the city recipes as written, professionally.',
          effects: { memberSatisfaction: 2, staffMorale: -4 },
          culture: { courtesy: 1, show: -2 },
          quality: 0,
          feedback:
            'You just told a chef his kitchen is a copy machine. He\'ll execute the recipes — competently, joylessly, while updating his resume — and the dishes will be worse than either menu, because executing another kitchen\'s food from paper never captures it. The mother wins nothing she\'ll remember; the club loses something it will: the belief, in its best craftsman, that this is a place where craft matters. Some customers are right. The transaction where your talent learns its worth is not the one to spend.',
        },
      ],
    },
  },
]
