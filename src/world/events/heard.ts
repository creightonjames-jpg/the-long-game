// HEARD service-recovery complaints — the Century Golf culture-card model
// played as a five-step sequence: Hear, Empathize, Apologize, Resolve, Diagnose.
// Each step has one option matching the model; skipping steps backfires.
import type { EventDef, HeardComplaint } from '../types'

export const HEARD_COMPLAINTS: HeardComplaint[] = [
  {
    id: 'heard-anniversary',
    title: 'The Ruined Anniversary',
    speaker: 'Mrs. Okonkwo, 15-year member, visibly upset at the host stand',
    competency: 'membership',
    intro:
      'Last night was the Okonkwos\' 40th anniversary dinner — the table they requested was given away, the entrées came out cold after a 50-minute wait, and the sparkling toast they\'d pre-arranged never appeared. She has come to find "whoever is in charge." That\'s you.',
    steps: [
      {
        key: 'H',
        title: 'Hear',
        prompt: 'She starts talking, fast and hurt. Your first move:',
        options: [
          {
            label: 'Let her tell the whole story, uninterrupted — even the parts you already know.',
            correct: true,
            response:
              'You listen. All of it — the table, the wait, the missing toast, what the night was supposed to be. She slows down as she realizes you\'re actually listening, not waiting to talk.',
          },
          {
            label: 'Gently interject early: "I know exactly what happened last night — let me tell you how we\'re fixing it."',
            correct: false,
            response:
              '"You know?" Her voice rises. "Then why am I the one who had to come find YOU?" Cutting off the story told her the story didn\'t matter. She starts over, angrier.',
          },
          {
            label: 'Steer to efficiency: "Give me the two or three key issues so I can get them resolved right away."',
            correct: false,
            response:
              '"Key issues?" she repeats. "It was our fortieth anniversary, not a punch list." Asking her to summarize her hurt converted care into intake processing.',
          },
        ],
      },
      {
        key: 'E',
        title: 'Empathize',
        prompt: 'The story is out. She\'s watching your face. You say:',
        options: [
          {
            label: '"Forty years — and that was the night we let you down. I understand why you\'re this upset, and you should be."',
            correct: true,
            response:
              'Her shoulders drop half an inch. "Thank you. My husband said not to bother coming in — that nobody would care." Validation is the bridge; you just became someone worth talking to.',
          },
          {
            label: '"To be fair, Saturday was our busiest night of the season — the kitchen was buried."',
            correct: false,
            response:
              '"So the busy nights are the ones where it\'s fine to ruin an anniversary?" An explanation offered before empathy always sounds like an excuse. Because it is one.',
          },
          {
            label: '"I promise you this is not who we are as a club."',
            correct: false,
            response:
              '"Last night, it was exactly who you were." Defending the club\'s identity before acknowledging her experience made it about the club, not her. The culture card says validate the feeling — "I understand how you feel about…" — not litigate it.',
          },
        ],
      },
      {
        key: 'A',
        title: 'Apologize',
        prompt: 'The moment for the apology. Which one:',
        options: [
          {
            label: '"I am so sorry. We failed your anniversary, and I\'m responsible for that. No conditions."',
            correct: true,
            response:
              'A clean apology — no "if," no "but," first person, owning it. She exhales. "That\'s all I actually came for," she admits. Many times an apology is all the member desires. The card literally says so.',
          },
          {
            label: '"I\'m sorry your experience wasn\'t what you hoped for."',
            correct: false,
            response:
              'Her eyes narrow at "your experience" — the passive-voice apology that relocates the failure into her perceptions. She\'s heard this apology from airlines. It has never once worked.',
          },
          {
            label: '"I apologize — and I want you to know the server responsible is being dealt with."',
            correct: false,
            response:
              '"Oh no — don\'t you dare pin this on that poor girl, she was drowning." Feeding a staff member to a member converts your apology into a deflection, and she\'s now defending your server from you.',
          },
        ],
      },
      {
        key: 'R',
        title: 'Resolve',
        prompt: 'Now the make-good. Speed matters. You offer:',
        options: [
          {
            label: 'A complete do-over you personally architect: their table, a private toast, Chef\'s tasting menu, this Saturday — and you\'ll greet them at the door.',
            correct: true,
            response:
              '"You\'d do that?" The resolution isn\'t the free food — it\'s the un-ruining of the memory. A specific, immediate, generous re-do converts the story she\'ll tell from "the club ruined our 40th" to "you won\'t believe what the club did next."',
          },
          {
            label: 'A sincere credit: remove the entire dinner from their account and add a dining credit for the trouble.',
            correct: false,
            response:
              'She nods slowly, unimpressed. "It wasn\'t about the bill." A refund treats a broken memory as a billing error — proportionate to the money, not the meaning. She leaves made whole and unmoved.',
          },
          {
            label: 'Promise it up the chain: "I\'m taking this to our F&B director today and we\'ll make this right — expect a call tomorrow."',
            correct: false,
            response:
              'The energy drains from the conversation. She came to the person in charge and got routed into a ticket queue. Speed is critical to successful recovery — "tomorrow" is where recoveries go to die.',
          },
        ],
      },
      {
        key: 'D',
        title: 'Diagnose',
        prompt: 'She\'s gone — satisfied. The last step happens without her. You:',
        options: [
          {
            label: 'Trace all three failures to root cause with the team — the reservation override, the fired-late entrées, the toast that never made the BEO — and fix the systems, then brief the staff.',
            correct: true,
            response:
              'The diagnosis finds real rot: a host override with no confirmation step, and pre-arranged extras living in a text thread instead of the event sheet. Two process fixes later, the NEXT anniversary is protected. Recovery without diagnosis is just expensive apology theater.',
          },
          {
            label: 'Close the loop where it counts: brief the Saturday crew that the Okonkwos are VIPs now — red-carpet treatment, forever.',
            correct: false,
            response:
              'The Okonkwos will be treated wonderfully — and the broken reservation override will ruin someone else\'s birthday next month. You fixed the couple, not the club. Diagnosis means the failure can\'t repeat, not that one family gets flagged.',
          },
          {
            label: 'Log it and move on — the recovery landed, the member\'s happy, and the day has nine other fires.',
            correct: false,
            response:
              'Recovery complete, lesson skipped. The same three failures are still loaded in the system, waiting for the next special night. The most-skipped step of service recovery is the one that prevents the next one.',
          },
        ],
      },
    ],
  },
  {
    id: 'heard-billing',
    title: 'The Statement Standoff',
    speaker: 'Dr. Reyes, 8-year member, printout in hand, jaw set',
    competency: 'membership',
    intro:
      'Dr. Reyes has been double-billed for guest fees three months running. He called twice — got voicemail. He emailed — got an auto-reply. Today he found a late fee on the disputed amount, and now he\'s standing in the admin office asking, coldly, whether he should "just resign and simplify everyone\'s bookkeeping."',
    steps: [
      {
        key: 'H',
        title: 'Hear',
        prompt: 'He\'s controlled but furious. First move:',
        options: [
          {
            label: 'Put down what you\'re holding, take him somewhere quiet, and ask him to walk you through all three months from the start.',
            correct: true,
            response:
              'He walks it through — the charges, the calls, the auto-reply, the late fee on money he doesn\'t owe. The anger, you realize, isn\'t about the $340. It\'s about being invisible for ninety days.',
          },
          {
            label: 'Reassure him fast: "Billing errors happen with the new system — we\'ll absolutely get this sorted."',
            correct: false,
            response:
              '"I KNOW it\'ll get sorted. That\'s not—" He stops, recalibrates to someone who isn\'t listening. "Three months. Two calls. An email." Minimizing it as routine told him his ninety days of being ignored were routine too.',
          },
          {
            label: 'Pull up his account on the spot and start scanning the charges while he talks.',
            correct: false,
            response:
              'You\'re reading the screen; he\'s talking to the top of your head. Multitasking through a grievance transmits its own message: the data matters, you don\'t. He trails off mid-sentence.',
          },
        ],
      },
      {
        key: 'E',
        title: 'Empathize',
        prompt: 'The whole story is out, including the resignation comment. You respond:',
        options: [
          {
            label: '"Being charged wrong is annoying. Being IGNORED for three months while you did everything right — that\'s the part that would have me in this office too."',
            correct: true,
            response:
              'He looks at you properly for the first time. "Yes. Exactly that." You named the real injury — the silence, not the cents — and he can feel the difference between being processed and being understood.',
          },
          {
            label: '"You\'re right that the response time wasn\'t ideal — we\'ve been short-staffed in accounting since March."',
            correct: false,
            response:
              '"Your staffing is not my problem." Correct, and he knows it. Operational context before empathy reads as the institution explaining itself to the person it wronged.',
          },
          {
            label: '"I\'d hate to see eight great years end over a billing error — you\'re too valued here for that."',
            correct: false,
            response:
              'You skipped past his anger to argue with his conclusion. The resignation line wasn\'t a proposal — it was a flare. Answering the flare instead of the feeling reads as "please don\'t leave" from a club that couldn\'t return his calls.',
          },
        ],
      },
      {
        key: 'A',
        title: 'Apologize',
        prompt: 'The apology:',
        options: [
          {
            label: '"I\'m sorry — for the error, and more for the silence. You did everything right and we went dark on you. That\'s on me."',
            correct: true,
            response:
              'Owning the silence — not just the software — lands. "Thank you," he says, and means it. The billing error was the occasion; the apology that worked was for the disrespect.',
          },
          {
            label: '"On behalf of the club, I apologize for any inconvenience this situation may have caused."',
            correct: false,
            response:
              'The corporate apology: passive, conditional ("may have"), delivered on behalf of an abstraction. He\'s received this exact sentence from his cable company. It bounces off.',
          },
          {
            label: '"I\'m sorry — honestly, the new billing system has been a nightmare for everyone, members and staff alike."',
            correct: false,
            response:
              '"So I\'m one of many." Great — his special grievance just became a known defect with a queue. Shared misery isn\'t an apology; it\'s a confession that the club watched this happen to lots of people.',
          },
        ],
      },
      {
        key: 'R',
        title: 'Resolve',
        prompt: 'The fix. You offer:',
        options: [
          {
            label: 'Fix it here and now, together: reverse every wrong charge and the late fee while he watches, and give him your direct line — he never calls the main number again.',
            correct: true,
            response:
              'Ninety days of runaround resolved in nine minutes, in front of him, with a named human attached to the outcome. The direct line matters more than the refund: it converts "the club that ignored me" into "the GM who handles it."',
          },
          {
            label: 'Make it generous: full reversal plus a goodwill credit worth double the disputed amount for the hassle.',
            correct: false,
            response:
              'He accepts the credit with a flat "fine." Money for time is the wrong currency conversion — the doubled credit reads as the club pricing his three months of being ignored, and lowballing it.',
          },
          {
            label: 'Do it properly: open a priority ticket with accounting, flag it urgent, and commit to written confirmation within 48 hours.',
            correct: false,
            response:
              '"A ticket." He almost laughs. "The tickets are how we got here." Process is what failed him three times; offering more process — even priority process — is resolving the complaint with the complaint.',
          },
        ],
      },
      {
        key: 'D',
        title: 'Diagnose',
        prompt: 'Dr. Reyes leaves mollified. The diagnosis:',
        options: [
          {
            label: 'Audit for the blast radius: find every member with the same duplicate-charge pattern, fix them proactively, and rewire where billing calls and emails actually land.',
            correct: true,
            response:
              'The audit finds eleven more members with the same duplicate pattern — nine of whom never complained. Nine silent grievances, defused before they walked in the door or quietly resigned. THAT\'s the diagnosis dividend: the complaints you never have to recover from.',
          },
          {
            label: 'Fix the person: note his account "GM handles directly" and make sure this member never has a billing problem again.',
            correct: false,
            response:
              'Dr. Reyes is now bulletproof — and eleven other members have the same duplicate charges and no direct line. You built a VIP lane around a systemic defect. The defect thanks you for the privacy.',
          },
          {
            label: 'Route it to the source: forward the case to the billing-software vendor as a bug report and ask accounting to monitor.',
            correct: false,
            response:
              'The vendor adds it to a backlog. "Monitor" means nothing changed about where member calls go to die. The system that ignored him for ninety days is now ignoring the diagnosis too — just with better documentation.',
          },
        ],
      },
    ],
  },
]

export const HEARD_EVENTS: EventDef[] = HEARD_COMPLAINTS.map((c, i) => ({
  id: `heard-ev-${c.id}`,
  kind: 'heard',
  toast: i === 0 ? 'An upset member is asking for the GM' : 'A member billing dispute is boiling over',
  zone: i === 0 ? 'Dining Room' : 'Admin Offices',
  severity: 2,
  windowMin: 180,
  heardId: c.id,
  missPenalty: { memberSatisfaction: -4 },
}))
