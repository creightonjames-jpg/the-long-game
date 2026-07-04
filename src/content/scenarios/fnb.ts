import type { Scenario } from '../../engine/types'

export const FNB_SCENARIOS: Scenario[] = [
  {
    id: 'chef-poached',
    competency: 'fnb',
    pool: 'core',
    title: 'The Chef Has an Offer',
    speaker: 'Chef Laurent, Executive Chef',
    prompt:
      'Chef Laurent — the reason half your members book Friday dinners — closes your door. A resort group offered him a 25% raise and a bigger kitchen. He\'d rather stay. "But I have a family. Give me a reason."',
    choices: [
      {
        id: 'call-bluff',
        label: 'Wish him well — no one is irreplaceable, and matching sets a precedent.',
        effects: { financialHealth: 1, staffMorale: -5, memberSatisfaction: -5 },
        quality: 0,
        feedback:
          'Some people ARE nearly irreplaceable in a member-experience business. Losing a beloved chef costs recruiting, ramp-up, menu chaos, and — worst — the member perception that "the club is slipping." The precedent you actually set: your best people should always take the call from recruiters.',
      },
      {
        id: 'match-quietly',
        label: 'Match the offer quietly from the F&B budget.',
        effects: { financialHealth: -3, memberSatisfaction: 2, staffMorale: 1 },
        quality: 1,
        feedback:
          'You kept him — as a mercenary. A pure counter-offer teaches Laurent (and everyone who hears about it) that the path to a raise runs through a competing offer. Pair retention money with things competitors can\'t match: creative authority, development budget, sous-chef support, and a visible growth path.',
      },
      {
        id: 'retention-package',
        label: 'Build a real retention case: market-based comp adjustment plus creative authority, a development budget, and a named growth path.',
        effects: { financialHealth: -2, memberSatisfaction: 3, staffMorale: 4, boardConfidence: 1 },
        quality: 2,
        feedback:
          'Leadership economics done right. Key-person retention is cheaper than key-person replacement by multiples — and the non-cash elements (autonomy, growth, respect) are what make people stay AFTER the raise fades. Your kitchen just watched how the club treats its best people. So did every future hire.',
      },
    ],
  },
  {
    id: 'wedding-vs-members',
    competency: 'fnb',
    pool: 'core',
    title: 'The $60K Wedding',
    speaker: 'Danielle, Catering Director',
    prompt:
      'A non-member wedding wants the entire clubhouse on a peak-season Saturday — $60K, your biggest banquet of the year. It would close member dining and the pool deck on the busiest family day of the summer. Danielle needs an answer by Friday.',
    choices: [
      {
        id: 'take-the-money',
        label: 'Book it — $60K covers a lot of budget gap.',
        effects: { financialHealth: 5, memberSatisfaction: -6, boardConfidence: -2 },
        quality: 0,
        feedback:
          'You just rented the members\' club out from under them on the day they most wanted it. Outside revenue that displaces member access erodes the only thing members are actually buying: priority. The $60K will be forgotten by budget season; "we couldn\'t use our own club" gets retold for years.',
      },
      {
        id: 'decline-flat',
        label: 'Decline — member access is sacred, full stop.',
        effects: { memberSatisfaction: 2, financialHealth: -2 },
        quality: 1,
        feedback:
          'Right values, unexamined execution. Before declining $60K, a strong GM tests the middle: different date, partial buyout that preserves member dining, or a shoulder-season counter. Protect member priority as POLICY — and hunt outside revenue in the windows members don\'t feel.',
      },
      {
        id: 'counter-offer',
        label: 'Counter: offer a shoulder-season Saturday or a partial buyout preserving member dining, and take a banquet-access policy to the board.',
        effects: { financialHealth: 3, memberSatisfaction: 2, boardConfidence: 3 },
        quality: 2,
        feedback:
          'Revenue management with member priority as the constraint — exactly how club banquet business should run. And routing the access question into board policy means next year\'s $60K decision is governed, not improvised. Danielle gets clear rules to sell against; members never feel displaced.',
      },
    ],
  },
  {
    id: 'food-cost-spike',
    competency: 'fnb',
    pool: 'core',
    title: 'Thirty-Four Percent',
    speaker: 'Elena Ruiz, F&B Director',
    prompt:
      'Food cost has crept from 29% to 34% in six months — roughly $90K a year of margin quietly gone. Elena suspects waste and portioning but admits the team hasn\'t run a full menu costing "since before COVID."',
    choices: [
      {
        id: 'raise-prices',
        label: 'Raise menu prices 8% across the board to cover it.',
        effects: { financialHealth: 2, memberSatisfaction: -4 },
        quality: 0,
        feedback:
          'You billed the members for your kitchen\'s process failure. Across-the-board increases without cost analysis are the F&B equivalent of peanut-butter budget cuts — they tax your popular, well-engineered items to subsidize the broken ones. Members notice club prices; fix the cost side first.',
      },
      {
        id: 'demand-fix',
        label: 'Tell Elena to get it back under 30% by quarter end, her call how.',
        effects: { financialHealth: 2, staffMorale: -3 },
        quality: 1,
        feedback:
          'Accountability without support. A target with no diagnosis invites the crude fixes — shrinking portions, cheaper product — that members detect instantly. Delegation means giving your F&B Director the tools (costing systems, inventory controls, a timeline) along with the number.',
      },
      {
        id: 'systematic-costing',
        label: 'Sponsor a full menu-costing and inventory-control project with Elena: recipe costing, waste tracking, vendor rebids, weekly variance review.',
        effects: { financialHealth: 4, staffMorale: 2, memberSatisfaction: 1 },
        quality: 2,
        feedback:
          'Five points of food cost is found money — recovered through systems, not squeezing. Recipe costing, waste logs, and vendor competition routinely claw back 3–5 points with zero member-visible change. This is the Technical-skills side of the CMAA framework: unglamorous, compounding, and exactly what boards mean by "operational excellence."',
      },
    ],
  },
  {
    id: 'minimums-backlash',
    competency: 'fnb',
    pool: 'core',
    title: 'The Minimums Mutiny',
    speaker: 'A petition with 63 signatures',
    prompt:
      'A member petition demands abolishing the $150/quarter F&B minimum: "a tax on members who don\'t dine." Finance says minimums underwrite $280K of F&B revenue. The board wants your recommendation.',
    choices: [
      {
        id: 'abolish-appease',
        label: 'Recommend abolishing minimums to end the complaints.',
        effects: { memberSatisfaction: 3, financialHealth: -5, boardConfidence: -2 },
        quality: 0,
        feedback:
          'You traded $280K of predictable revenue for a quarter of quiet. The complaints will return — attached to the dues increase or service cuts that backfill the hole. Minimums aren\'t the problem; minimums that feel like a penalty are. Fix the feeling, not the funding.',
      },
      {
        id: 'defend-status-quo',
        label: 'Defend the minimums as-is — the math is the math.',
        effects: { financialHealth: 2, memberSatisfaction: -3 },
        quality: 1,
        feedback:
          'The math is right and the members still hate it — because "use it or lose it" frames dining as an obligation. 63 signatures is member-sentiment data; ignoring it converts petitioners into resignation risks. Defend the revenue, but redesign the experience of paying it.',
      },
      {
        id: 'redesign-program',
        label: 'Keep the revenue, redesign the experience: roll unused minimums into member events, add grab-and-go redemption, and report usage transparently.',
        effects: { financialHealth: 2, memberSatisfaction: 4, boardConfidence: 3 },
        quality: 2,
        feedback:
          'You separated the funding mechanism from the member irritant. When minimums convert to a wine dinner or family pizza night instead of expiring, the "tax" becomes a benefit members plan around — and the $280K stays. Listening to sentiment while protecting the P&L is the whole F&B balancing act in miniature.',
      },
    ],
  },
  {
    id: 'friday-ticket-times',
    competency: 'fnb',
    pool: 'core',
    title: 'Forty-Five Minutes for a Burger',
    speaker: 'Marcy Ellison, House Chair (forwarding member emails)',
    prompt:
      'Friday night ticket times have blown past 45 minutes three weeks running. Complaints are stacking up. Elena says the kitchen is two cooks short and the new POS "fires everything to one printer." Marcy wants it fixed "by this Friday."',
    choices: [
      {
        id: 'push-harder',
        label: 'Tell the kitchen to push harder — Friday is showtime.',
        effects: { staffMorale: -5, memberSatisfaction: -2 },
        quality: 0,
        feedback:
          '"Work harder" aimed at a structurally understaffed kitchen is management malpractice — you\'ll burn out the cooks you have and Friday still won\'t improve. Diagnose the constraint (people, process, or equipment) before demanding output. Your line staff already know what\'s broken; ask them.',
      },
      {
        id: 'shrink-menu',
        label: 'Temporarily cut the Friday menu in half to shorten tickets.',
        effects: { memberSatisfaction: 1, staffMorale: 2, financialHealth: 1 },
        quality: 1,
        feedback:
          'A legitimate triage move — smaller menus genuinely speed service — but it treats symptoms. Without solving the staffing gap and the POS routing, you\'ve made Friday survivable by making it smaller. Pair the short-term menu edit with the structural fixes, or this becomes the permanent, quiet downgrade members eventually name.',
      },
      {
        id: 'fix-constraints',
        label: 'Attack all three constraints: emergency staffing (agency + cross-trained banquet staff), fix POS routing this week, and a simplified Friday menu until stabilized.',
        effects: { memberSatisfaction: 4, staffMorale: 3, financialHealth: -1 },
        quality: 2,
        feedback:
          'Operational triage done like an operator: stabilize (menu), unblock (POS), and resource (staffing) — simultaneously, with a visible timeline. Members feel the fix within two Fridays, and the kitchen sees a GM who removes obstacles instead of adding pressure. That story travels through the whole staff.',
      },
    ],
  },
]
