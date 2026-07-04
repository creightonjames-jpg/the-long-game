import type { Scenario } from '../../engine/types'

export const MEMBERSHIP_SCENARIOS: Scenario[] = [
  {
    id: 'resignation-spike',
    competency: 'membership',
    pool: 'core',
    title: 'Twelve Letters',
    speaker: 'Grant Osei, Membership Chair',
    prompt:
      'Twelve resignation letters this quarter — double the normal rate. Most cite "value." Grant is rattled: "That\'s $150K in dues walking out the door. What are we doing about it?"',
    choices: [
      {
        id: 'shrug-churn',
        label: 'Reassure him: some churn is normal, the waitlist will backfill.',
        effects: { memberSatisfaction: -3, boardConfidence: -3, financialHealth: -2 },
        quality: 0,
        feedback:
          'Resignations are a lagging indicator — by the time members quit, they disengaged 18 months ago. Waving at the waitlist ignores the signal: every resignation is a dues annuity lost plus a story told at dinner parties. Retention is the cheapest revenue in club management.',
      },
      {
        id: 'discount-saves',
        label: 'Offer departing members a discounted "legacy" rate to stay.',
        effects: { memberSatisfaction: 1, financialHealth: -4, boardConfidence: -1 },
        quality: 1,
        feedback:
          'You bought back a few resignations and quietly repriced the whole membership — wait until paying members hear about the discount. Rate concessions treat the symptom. Exit interviews, usage data, and early-warning outreach treat the disease.',
      },
      {
        id: 'exit-data-program',
        label: 'Launch exit interviews + a usage-data early-warning system flagging disengaging members for personal outreach.',
        effects: { memberSatisfaction: 4, boardConfidence: 4, financialHealth: 1 },
        quality: 2,
        feedback:
          'Retention as a system, not a scramble — the core of the CMAA Membership & Marketing competency. Members whose usage drops are savable for months before they write the letter; a call from the GM at the right moment is astonishingly effective. Measure disengagement, then intervene early.',
      },
    ],
  },
  {
    id: 'initiation-timing',
    competency: 'membership',
    pool: 'core',
    title: 'The Waitlist Windfall',
    speaker: 'Grant Osei, Membership Chair',
    prompt:
      'The waitlist has grown to 40 families — the strongest demand in a decade. Grant wants to raise the initiation fee 50% immediately. "Strike while the iron\'s hot. The market is telling us we\'re underpriced."',
    choices: [
      {
        id: 'raise-max',
        label: 'Agree — raise it 50% effective immediately.',
        effects: { financialHealth: 5, memberSatisfaction: -2, boardConfidence: 1 },
        quality: 1,
        feedback:
          'Directionally right, execution risky. A sudden 50% jump with no grandfathering torches goodwill with families mid-application and invites a demand cliff if the economy turns. Price to the market — but stage it, honor the pipeline, and check the number against comparable-club benchmarks first.',
      },
      {
        id: 'keep-flat',
        label: 'Keep the fee flat — the waitlist is a nice cushion, don\'t spook it.',
        effects: { financialHealth: -2, boardConfidence: -2 },
        quality: 0,
        feedback:
          'A 40-family waitlist at a flat price means you\'re transferring value from the club to lucky applicants. Underpricing initiation starves the capital reserve that current members subsidize. Demand data is telling you something; a GM\'s job is to read it.',
      },
      {
        id: 'staged-increase',
        label: 'Benchmark comparable clubs, then stage the increase with a grandfather window for current applicants.',
        effects: { financialHealth: 4, memberSatisfaction: 1, boardConfidence: 3 },
        quality: 2,
        feedback:
          'Pricing discipline with hospitality manners. Benchmarking anchors the number in data the board can defend; the grandfather window converts would-be resentment into urgency (applications will surge before the deadline). You captured the demand signal without burning the pipeline.',
      },
    ],
  },
  {
    id: 'social-media-complaint',
    competency: 'membership',
    pool: 'core',
    title: 'The Facebook Post',
    speaker: 'Your phone, at 9:40 PM',
    prompt:
      'A longtime member posts in the unofficial members\' Facebook group: a photo of a cold entrée, a three-paragraph takedown of "declining standards," and a tag: "Maybe management can explain." 47 comments and climbing. Several are worse than the original.',
    choices: [
      {
        id: 'post-rebuttal',
        label: 'Post a factual rebuttal in the thread tonight.',
        effects: { memberSatisfaction: -4, boardConfidence: -3 },
        quality: 0,
        feedback:
          'You just turned a complaint into a public debate with a member — one you cannot win, because the audience scores it on tone, not facts. GMs don\'t litigate in comment threads. Take it offline, always.',
      },
      {
        id: 'ignore-thread',
        label: 'Ignore it — engaging only feeds the fire.',
        effects: { memberSatisfaction: -2, staffMorale: -1 },
        quality: 1,
        feedback:
          'Half right: don\'t fight in the thread. But silence reads as indifference, and the thread becomes the club\'s narrative. The move is direct, personal, and fast — call the member tomorrow morning, fix the underlying issue, and let THEM update the thread. Recovered complainers become your loudest advocates.',
      },
      {
        id: 'call-and-recover',
        label: 'Call the member personally in the morning, host them for a re-do dinner, and quietly fix the kitchen issue behind the complaint.',
        effects: { memberSatisfaction: 5, staffMorale: 2, boardConfidence: 2 },
        quality: 2,
        feedback:
          'Service recovery is a membership-retention weapon. A personal call from the GM says "you matter" louder than any post; the re-do visit converts the critic; and fixing the root cause means the next table gets a hot entrée. Watch: the member will amend the thread themselves — earned advocacy beats any rebuttal.',
      },
    ],
  },
  {
    id: 'survey-results',
    competency: 'membership',
    pool: 'core',
    title: 'The Survey Nobody Wants to Read',
    speaker: 'Your inbox — annual member survey results',
    prompt:
      'The annual survey lands: dining satisfaction down 14 points, "value for dues" at a five-year low, and a bruising open-comment section. The board meets in two weeks. Your name is in some of those comments.',
    choices: [
      {
        id: 'soften-deck',
        label: 'Present a summary deck that leads with the positives and buries the trend lines.',
        effects: { boardConfidence: 2, memberSatisfaction: -3 },
        micro: 4,
        quality: 0,
        feedback:
          'Boards eventually see raw data — and a GM caught curating bad news loses the only currency that matters: trust. Worse, sanitized results kill the mandate for fixes. Honesty and straightforwardness are named CMAA characteristics of successful GM/COOs for exactly this moment.',
      },
      {
        id: 'raw-dump',
        label: 'Forward the full raw results to the board without commentary.',
        effects: { boardConfidence: -3, memberSatisfaction: 1 },
        micro: 5,
        quality: 1,
        feedback:
          'Transparent but leaderless. Raw data without analysis invites nine directors to form nine diagnoses — and some will start "helping" operationally. The GM\'s job is to bring the data AND the interpretation AND the plan, so the board reacts to a strategy instead of inventing one.',
      },
      {
        id: 'own-with-plan',
        label: 'Present the full results honestly, with root-cause analysis and a 90-day response plan you\'ll report against monthly.',
        effects: { boardConfidence: 5, memberSatisfaction: 3, staffMorale: 1 },
        micro: -6,
        quality: 2,
        feedback:
          'This is executive maturity: bad news, delivered early, owned completely, attached to a plan. Data-driven decision-making is a core CMAA competency — but so is the accountability to stand in front of the numbers. Boards forgive bad quarters; they don\'t forgive surprises or spin.',
      },
    ],
  },
  {
    id: 'young-exec-category',
    competency: 'membership',
    pool: 'core',
    title: 'The Age Cliff',
    speaker: 'Grant Osei, Membership Chair',
    prompt:
      'The demographics slide is stark: average member age 63, and only 8% under 45. Grant proposes a discounted "Young Executive" category. Gus Ferraro growls that discounts "cheapen the club" and the dining room "will fill with strangers."',
    choices: [
      {
        id: 'side-with-gus',
        label: 'Side with tradition — protect the current membership experience.',
        effects: { boardConfidence: 1, memberSatisfaction: 1, financialHealth: -3 },
        quality: 0,
        feedback:
          'Demographics are destiny in club economics. An age-63 average with no pipeline means a dues cliff in ten years — and the eventual fix (desperate discounting) will be far more "cheapening" than a designed program today. Protecting the present at the expense of the pipeline is how proud clubs hollow out.',
      },
      {
        id: 'deep-discount',
        label: 'Back an aggressive discount — fill the pipeline fast.',
        effects: { financialHealth: 2, memberSatisfaction: -3, boardConfidence: -1 },
        quality: 1,
        feedback:
          'Right problem, blunt instrument. Deep discounts risk two-tier resentment and attract price-shoppers over future full members. Stronger designs use a dues RAMP (stepping to full rate by 45), modest initiation deferral, and programming that integrates young families — growth that current members experience as vitality, not dilution.',
      },
      {
        id: 'designed-ramp',
        label: 'Propose a structured ramp: age-stepped dues reaching full rate at 45, capped intake, and integration programming.',
        effects: { financialHealth: 3, memberSatisfaction: 2, boardConfidence: 4 },
        quality: 2,
        feedback:
          'Recruitment strategy as long-range planning — the Membership & Marketing competency at board level. The ramp protects rate integrity, the cap protects the experience Gus fears losing, and the programming turns new families into engaged members instead of strangers. You gave both directors a version of winning.',
      },
    ],
  },
]
