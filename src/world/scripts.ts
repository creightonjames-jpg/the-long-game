// Eight season "showrunner" scripts mapping the GM's two-year tenure onto the
// Hero's Journey. The Mentor is a Century Golf regional director whose guidance
// is rooted in the culture card (Quality Standards, HEARD, Team Values,
// Aspirations — "Full with a Wait List").
import type { SeasonScript } from './types'

export const SEASON_SCRIPTS: SeasonScript[] = [
  {
    title: 'The New Hire',
    stage: 'Ordinary World · The Call to Adventure',
    seasonName: 'Spring',
    year: 1,
    mentorIntro:
      '"Cedar Ridge is hurting — resignations up, morale down, a board that\'s lost patience. That\'s why they called you. Walk the property every day. Our standards are Safety, Courtesy, Show, Efficiency — in that order. When you don\'t know what to do, do the one that protects people."',
    goalText: 'Survive your first season: end Spring with Staff Morale at 55 or better.',
    goalStat: 'staffMorale',
    goalValue: 55,
    successBeat:
      'The staff noticed. A line cook tells you it\'s the first spring anyone learned his name. Word reaches the board that the new GM shows up everywhere — the parking lot, the dish pit, the first tee.',
    failBeat:
      'Two servers quit in the same week, and the exit interviews mention "same as it ever was." The board hears about it before you can tell them. The honeymoon is over early.',
    dutyIds: [
      ['duty-preshift', 'duty-course-walk'],
      ['duty-budget-variance', 'duty-one-on-one'],
    ],
  },
  {
    title: 'Trial by Summer',
    stage: 'Crossing the Threshold · Tests, Allies, Enemies',
    seasonName: 'Summer',
    year: 1,
    mentorIntro:
      '"Peak season is where GMs are made or unmade. Everything breaks in July — equipment, tempers, schedules. Remember service recovery: Hear, Empathize, Apologize, Resolve, Diagnose. Members forgive failures. They never forgive not being heard."',
    goalText: 'Hold the line through peak season: end Summer with Member Satisfaction at 60 or better.',
    goalStat: 'memberSatisfaction',
    goalValue: 60,
    successBeat:
      'The club survives its busiest summer in years — and members felt taken care of even when things broke. Grant Osei reports the first waitlist inquiries in eighteen months.',
    failBeat:
      'The summer chewed through the club\'s goodwill. Three families quietly toured the club across town. The board president asks what, exactly, is being done.',
    dutyIds: [
      ['duty-preshift', 'duty-event-tasting'],
      ['duty-course-walk', 'duty-agenda-prep'],
    ],
  },
  {
    title: 'The Numbers Don\'t Lie',
    stage: 'Approach to the Inmost Cave',
    seasonName: 'Fall',
    year: 1,
    mentorIntro:
      '"Budget season. This is where boards decide if you\'re a caretaker or a leader. Bring them data, not vibes — Well Done Beats Well Said. And fund the reserve even when it\'s unpopular; deferred maintenance is a lie you tell the future."',
    goalText: 'Win budget season: end Fall with Financial Health at 58 or better.',
    goalStat: 'financialHealth',
    goalValue: 58,
    successBeat:
      'Your budget passes with a funded reserve line — the first in six years. Dee Calloway, who trusts no one, says "fine" in a tone that almost sounds like respect.',
    failBeat:
      'The budget limps through committee full of asterisks. Nobody said "no confidence," but three directors abstained, and abstentions are how boards whisper.',
    dutyIds: [
      ['duty-budget-variance', 'duty-one-on-one'],
      ['duty-agenda-prep', 'duty-preshift'],
    ],
  },
  {
    title: 'The Ordeal',
    stage: 'The Ordeal — the crisis that defines the tenure',
    seasonName: 'Winter',
    year: 1,
    mentorIntro:
      '"Quiet season is never quiet. Winter is when factions form, when the anonymous letters circulate, when whoever wants your job makes their move. Protect Each Other — that includes protecting your own integrity. Document everything. Stay gracious."',
    goalText: 'Survive the boardroom winter: end the season with Board Confidence at 55 or better.',
    goalStat: 'boardConfidence',
    goalValue: 55,
    successBeat:
      'The whisper campaign dies in committee. When the vote that was never officially a vote doesn\'t happen, you realize you\'ve crossed something — the club is starting to feel like yours.',
    failBeat:
      'An "informal evaluation" appears on the executive-session agenda. You survive it, but barely, and everyone in the building knows how thin the ice is.',
    dutyIds: [
      ['duty-agenda-prep', 'duty-one-on-one'],
      ['duty-budget-variance', 'duty-course-walk'],
    ],
  },
  {
    title: 'Seizing the Sword',
    stage: 'Reward — the turnaround plan',
    seasonName: 'Spring',
    year: 2,
    mentorIntro:
      '"Year two. You know where the bodies are buried and which committee buried them. Now build: a real member-experience plan, a real pipeline. Aspire to be Full with a Wait List — say it out loud to the board. Goals you don\'t say out loud are wishes."',
    goalText: 'Launch the turnaround: end Spring with Member Satisfaction at 65 or better.',
    goalStat: 'memberSatisfaction',
    goalValue: 65,
    successBeat:
      'New-member tours triple. The dining room is loud again on Fridays — the good kind of loud. The board stops asking what you\'re doing and starts asking what you need.',
    failBeat:
      'The plan is right but the execution wobbles. Members sense effort, not results — which buys patience, not enthusiasm.',
    dutyIds: [
      ['duty-preshift', 'duty-event-tasting'],
      ['duty-course-walk', 'duty-one-on-one'],
    ],
  },
  {
    title: 'The Road Back',
    stage: 'The Road Back — executing under pressure',
    seasonName: 'Summer',
    year: 2,
    mentorIntro:
      '"Second summer. The difference between a good season and a great club is systems: pre-shift every day, recovery on every complaint, no silent failures. We Never Lay Up — but we also never skip the fundamentals. Trust your department heads; you built this bench."',
    goalText: 'Prove the machine works: end Summer with Staff Morale at 62 or better.',
    goalStat: 'staffMorale',
    goalValue: 62,
    successBeat:
      'For the first time, a crisis resolves before you even hear about it — your team handled it your way. That\'s the whole job, and it happened without you.',
    failBeat:
      'The systems held, mostly — but held by your hands. You\'re still the load-bearing wall, and everyone can see the fatigue.',
    dutyIds: [
      ['duty-preshift', 'duty-agenda-prep'],
      ['duty-event-tasting', 'duty-course-walk'],
    ],
  },
  {
    title: 'The Final Test',
    stage: 'Resurrection — proving the transformation',
    seasonName: 'Fall',
    year: 2,
    mentorIntro:
      '"One more budget season — except this time they\'re not evaluating the budget, they\'re evaluating the era. Show them the two-year arc: the numbers, the retention, the culture scores. To Be a Good Partner is the mission. Make it impossible to imagine the club without you."',
    goalText: 'Cement the legacy: end Fall with Financial Health at 65 or better.',
    goalStat: 'financialHealth',
    goalValue: 65,
    successBeat:
      'The budget passes unanimously — with applause. Actual applause, in a board meeting. Hal Whitmore mentions a contract extension "before somebody poaches you."',
    failBeat:
      'The numbers are good, not great — and boards grade on trajectory. The extension conversation gets tabled to spring, which is a decision disguised as a delay.',
    dutyIds: [
      ['duty-budget-variance', 'duty-agenda-prep'],
      ['duty-one-on-one', 'duty-preshift'],
    ],
  },
  {
    title: 'Return with the Elixir',
    stage: 'Return with the Elixir — the legacy season',
    seasonName: 'Winter',
    year: 2,
    mentorIntro:
      '"Last season of the contract. Whatever happens in that boardroom, the real verdict is out here — in whether a nineteen-year-old server believes this is a place worth building a career, and whether a member walks in the door and feels known. To Improve the Lives of the People We Serve. That was always the assignment."',
    goalText: 'Finish the journey: end Winter with Board Confidence at 65 or better.',
    goalStat: 'boardConfidence',
    goalValue: 65,
    successBeat:
      'The annual meeting gives you a standing ovation. Somewhere in the crowd, a young assistant manager is watching and thinking: that could be me. The elixir was never the contract — it was the club you\'re handing back.',
    failBeat:
      'The tenure ends respectably — steadier than it started, better than they feared. Not every journey ends in triumph; some end in a club that\'s simply, quietly, healthier. That counts too.',
    dutyIds: [
      ['duty-agenda-prep', 'duty-one-on-one'],
      ['duty-course-walk', 'duty-preshift'],
    ],
  },
]
