// Deterministic seed generator for the meetings library.
// Produces src/data/meetings.json: meetings with timed transcript segments,
// per-template AI summaries, action items, highlights and topic monitors.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PEOPLE, ME } from './people.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data');

let seedState = 42;
const rand = () => { seedState = (seedState * 1103515245 + 12345) % 2 ** 31; return seedState / 2 ** 31; };
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// ---- conversation builders -------------------------------------------------
// Each meeting script is a list of [speakerKey, text] beats; timing is derived
// from text length (~170 wpm) plus a natural pause.
function timeline(script, startISO, pace = 1) {
  let t = 4; // seconds into the call
  return script.map(([who, text], i) => {
    const words = text.split(/\s+/).length;
    const dur = Math.max(2, Math.round((words / 150) * 60 * Math.min(pace, 1.5)));
    const seg = { id: `s${i}`, speaker: PEOPLE[who].id, start: t, end: t + dur, text };
    t += dur + Math.round((1 + rand() * 2) * pace * 4);
    return seg;
  });
}

const filler = {
  agree: ['Yeah, that makes sense.', 'Right, agreed.', 'Okay, that works for me.', 'Makes sense on my end.', 'Yep, fair enough.'],
  handoff: ['Let me hand it over on that point.', 'Curious what you think here.', 'Can you take this one?', 'Over to you on that.'],
};

export const smallTalk = (a, b) => [
  [a, `Hey ${PEOPLE[b].name.split(' ')[0]}, can you hear me alright?`],
  [b, 'Loud and clear. Give me one second, just closing a tab avalanche.'],
  [a, 'No rush. How was the rest of your week?'],
  [b, 'Busy but good. We wrapped the quarter review yesterday, so today feels lighter already.'],
];

// ---- Meeting 1: the case that matters — 8 people, ~1 hour -----------------
function bigQbr() {
  const beats = [];
  const say = (w, t) => beats.push([w, t]);
  say('sahil', 'Alright, I think we have everyone. Mira, Daniel, thanks for pulling the whole team in for this one.');
  say('mira', 'Happy to. We have our ops leads on as well since rollout touches their regions directly.');
  say('sahil', 'Perfect. Agenda is three parts: adoption numbers from the pilot, the two blockers your team flagged, and then commercial terms for the annual renewal. Anything to add?');
  say('dan', 'One thing. I want ten minutes on the CRM sync before we talk terms. If field mapping stays manual, the rest is moot for us.');
  say('sahil', 'Noted, we will do that right after adoption. Lena, do you want to run the numbers?');
  say('lena', 'Sure. Pilot ran six weeks across forty-two seats. Weekly active recorders ended at thirty-eight, so ninety percent. Median meetings captured per user per week was eleven. The number I care about most: summary edits before sharing dropped from roughly forty percent of calls in week one to nine percent by week six, which means the drafts are landing as-is.');
  say('mira', 'That matches what I hear anecdotally. The complaint volume just stopped after week two.');
  say('lena', 'The one soft spot is the Lisbon team. Their adoption plateaued around sixty percent, and interviews say it is the Portuguese transcript quality on mixed-language calls.');
  say('priya', 'We see the same on our side with Hindi-English calls. Is there a roadmap answer, or do we design around it?');
  say('tom', 'There is a model upgrade for code-switched speech in beta now. I can enable it for both your workspaces this week. In internal tests it cut word error rate on mixed calls by about a third.');
  say('priya', 'That would be worth a lot. Please do.');
  say('sahil', 'Action for Tom then: beta flag for Brightloop and Northwind by Friday. Okay, Daniel, CRM sync. Walk us through the pain.');
  say('dan', 'Today every call summary lands in the deal timeline as a note, which is fine. But stage, next step, and close date still get typed by hand. Reps do it late or never, and my forecast is fiction by Thursday. I want field-level sync: Fathom proposes, rep confirms, CRM updates.');
  say('tom', 'That exists on the Business tier. Field mapping is per-team; suggestions appear after each call and a one-click confirm writes through. We support close date, stage, amount, next step and any custom field with a text or date type.');
  say('dan', 'Confirm flow is important. I do not want silent writes into Salesforce, ever. Who audits what got written?');
  say('tom', 'Every write is attributed and reversible from the audit log, and you can scope which fields are even suggestible. I will send the security review doc after this.');
  say('jonas', 'On that thread, we still need the data-processing addendum updated before anything writes into a system that holds patient adjacent data. Legal flagged the sub-processor list.');
  say('sahil', 'Understood. I will get our counsel to send the updated DPA with the current sub-processor list this week. Jonas, if we get you that by Wednesday, what is your review turnaround?');
  say('jonas', 'If it is a redline of the existing one, a week. A fresh document, three weeks, honestly.');
  say('sahil', 'It will be a redline. Okay, adoption looks strong, blockers have owners. Commercials. You are at forty-two pilot seats. Where does the full rollout land?');
  say('mira', 'Two hundred and ten seats across four regions, phased over two quarters. But I want pilot pricing held for the first hundred.');
  say('sahil', 'If we sign annual before the end of the month, I can hold pilot pricing on the full two hundred and ten, not just the first hundred. It needs the annual commitment though, monthly resets to list.');
  say('dan', 'What does that put the total at?');
  say('sahil', 'At pilot rate, annual, roughly seventy-two thousand for the year, billed once. List monthly would be just over ninety-six across the same period.');
  say('mira', 'Send the order form. I cannot promise month-end, procurement moves how it moves, but the delta is a strong argument.');
  say('raj', 'One more from me. Half our leadership calls happen in Teams rooms with a shared account. Does capture attribute speakers correctly there?');
  say('tom', 'Room systems are the hardest case. Diarization separates voices, but names need a one-time voice enrollment per person. Takes about a minute each. I will include the setup guide.');
  say('raj', 'Fine as long as it is once, not per call.');
  say('sahil', 'Once per person. Alright, let me read back the actions before we lose the room.');
  say('sahil', 'Tom enables the code-switched speech beta for both workspaces by Friday and sends the security review plus the room enrollment guide. I send the redlined DPA by Wednesday and the annual order form today. Jonas reviews within a week of receipt. Mira starts procurement in parallel. Did I miss anything?');
  say('dan', 'Field mapping workshop. I want RevOps and Tom in a room before rollout wave one.');
  say('tom', 'I will send times for early next week.');
  say('mira', 'Good meeting. Send the form, Sahil.');
  say('sahil', 'On its way within the hour. Thanks everyone.');
  // pad the middle with regional detail discussion to stretch to ~1h realistically
  const regional = [];
  const regions = [['priya', 'Northwind pilot group'], ['raj', 'Velocity logistics pod'], ['emma', 'the EMEA sales floor']];
  for (const [who, label] of regions) {
    regional.push([who, `Quick regional color from ${label}. Recording consent banners worked fine, but managers want the weekly digest grouped by account rather than by rep. Right now they stitch it manually every Monday.`]);
    regional.push(['lena', 'That is a saved-view change, not a feature request. I can configure account-grouped digests for your managers this week and it applies retroactively.']);
    regional.push([who, pick(filler.agree)]);
  }
  beats.splice(14, 0, ...regional);
  // Deep-dive middle sections that make this the hour-long, 8-person case:
  // security review Q&A, rollout waves per region, and a live walkthrough.
  const deep = [];
  const qa = [
    ['jonas', 'Before we move on, a few security questions I owe our review board. Where is call audio stored at rest, and for how long?', 'tom', 'Audio and transcripts live encrypted at rest in your regional storage zone, EU for you. Default retention is two years, and on Business you can set per-team policies down to thirty days, with legal-hold exceptions.'],
    ['jonas', 'Who inside your company can access our recordings?', 'tom', 'Nobody by default. Support access requires an explicit grant from your admin, is time-boxed to seventy-two hours, and every access lands in the audit export you already pull weekly.'],
    ['priya', 'What is the story on model training? Our counsel will ask whether your vendors train on our calls.', 'tom', 'Customer content is excluded from training by contract, and that flows down to our model sub-processors. It is in the DPA Sahil is sending, section four.'],
    ['dan', 'What happens to a call when the rep leaves the company? Ownership of the record, I mean.', 'tom', 'Workspace owns the recording, not the individual. Offboarding reassigns their library to a manager or an archive team, links keep working.'],
    ['raj', 'And exports? If we ever leave, I want everything out, not a hostage situation.', 'tom', 'Full export: media, transcripts, summaries and metadata in open formats, self-serve, no ticket needed.'],
    ['mira', 'Good answers all around. Jonas, does that cover your board list?', 'jonas', 'Most of it. I will send the remaining four questions in writing with the DPA redline.'],
  ];
  for (const [q1, t1, q2, t2] of qa) { deep.push([q1, t1], [q2, t2]); }
  const waves = [
    ['mira', 'Let us sketch the rollout waves while everyone is here. Wave one is who exactly?'],
    ['dan', 'Sales and CS in North America, about eighty seats. They are the loudest ask and the CRM sync pilot group.'],
    ['priya', 'Northwind side, wave one is the account management pod, twenty-five seats, once the DPA clears.'],
    ['lena', 'For each wave I run the same playbook: kickoff session, week-one office hours, and an adoption report at day fourteen. Managers get the digest from day one.'],
    ['raj', 'Logistics pod goes wave two for us, the Teams-room enrollment needs to happen first.'],
    ['emma', 'EMEA sales floor is wave two as well, we want the Lisbon transcript fix proven before I put it in front of the whole floor.'],
    ['sahil', 'So wave one is roughly one hundred five seats within three weeks of signature, remainder next quarter. That matches the phasing in the order form.'],
    ['mira', 'Correct. Put those wave definitions in writing with the form.'],
  ];
  const walkthrough = [
    ['sahil', 'While we have the leads on, let me do the five-minute walkthrough of what managers actually see, because that decides whether this sticks.'],
    ['sahil', 'This is the team library. Every call your team recorded, newest first, with the summary state and who has already viewed it. Nobody asks "what happened on the Acme call" in Slack anymore, they open the recap.'],
    ['emma', 'Can I filter that to only external calls? Internal standups are noise for me.'],
    ['sahil', 'Top-left filter, external only, and you can save that as your default view. Next: this is a single call page. Summary on the right, transcript synced to playback on the left, and every action item links to the second it was said.'],
    ['priya', 'The jump-to-moment thing is what won our pilot group over, for the record.'],
    ['sahil', 'Same for keyword alerts. Daniel, your pricing-mention alert would live here, it scans every new team call and pings you with the exact clip.'],
    ['dan', 'As long as I can scope it to my pipeline reviews and not all-hands chatter, yes.'],
    ['sahil', 'Scoped by folder, by team, or by attendee. Last piece, Ask Fathom across the whole library: type "what did Brightloop commit to in the last month" and it answers with citations into the calls. That is the piece that replaces the Monday archaeology.'],
    ['mira', 'Show that to procurement, honestly. It is the best argument for the annual.'],
  ];
  beats.splice(20 + regional.length, 0, ...deep, ...waves, ...walkthrough);
  return beats;
}

// ---- Meeting scripts: shorter calls ----------------------------------------
function salesDemo() {
  return [
    ...smallTalk('sahil', 'raj'),
    ['sahil', 'So the goal today is a working demo against your real workflow. You said dispatch calls are the noisiest part of the day?'],
    ['raj', 'Dispatch and carrier negotiations. Twenty short calls a day per coordinator, and nothing gets written down until evening, if at all.'],
    ['sahil', 'Then let me show capture on a short call first, because that is your shape of meeting. This is a recording from this morning, four minutes long. Notice the summary is ready the moment the call ends, action items already extracted.'],
    ['raj', 'And this works without the bot joining? Some carriers get twitchy when a third participant appears.'],
    ['sahil', 'Yes, bot-free capture runs locally on the coordinator machine. The other side sees nothing joining the call. Consent notice is configurable to your legal requirements.'],
    ['emma', 'What happens with back-to-back calls? Our coordinators do not have thirty seconds between them to click anything.'],
    ['sahil', 'Capture auto-starts from the calendar, or from call audio detection for ad-hoc calls. Zero clicks is the design goal. Emma, for your sales floor there is also keyword alerting, want me to show pricing mentions across a week of calls?'],
    ['emma', 'Show me competitor mentions instead. That is what I chase all day.'],
    ['sahil', 'Even better. Here is a saved alert for two competitor names. Every mention across the team, with a jump link into the exact moment of the recording. You get this as a digest or in Slack.'],
    ['emma', 'Okay, that is genuinely useful. What does rollout look like for forty people?'],
    ['sahil', 'A week, most of it waiting on your SSO admin. I will send a pilot proposal for one dispatch pod and your top sales pod, three weeks, success criteria we agree upfront.'],
    ['raj', 'Send it. If the pilot holds up like this demo, we will talk about the whole floor.'],
  ];
}

function standup() {
  return [
    ['kenji', 'Morning all, quick round. Amara, go ahead.'],
    ['amara', 'Shipped the summary template picker to staging yesterday. One open question on default ordering, I posted options in the channel. Today is spec review for keyword alerts.'],
    ['sofia', 'I finished the empty states for search and the share page. Blocked on copy review for the consent banner, it has been three days.'],
    ['kenji', 'I will chase copy today, that is on me. My update: transcript seeking performance is fixed, the long-call case went from four seconds to under two hundred milliseconds. PR is up.'],
    ['amara', 'Oh nice, that was our worst support complaint.'],
    ['kenji', 'One risk to flag: the diarization vendor deprecates v2 endpoints at the end of next month. Migration is about a week of work and it is not scheduled yet. I want it in the next sprint.'],
    ['amara', 'Agreed, I will slot it. Anything else? Alright, thanks both.'],
  ];
}

function csCheckin() {
  return [
    ...smallTalk('lena', 'mira'),
    ['lena', 'This is our week-three check-in. Headline from my side: adoption is at eighty-four percent of pilot seats, which is ahead of the plan we set.'],
    ['mira', 'The team likes it. The pushback I keep hearing is people wanting the summary in their own words, some of the phrasing feels too formal for internal notes.'],
    ['lena', 'Two answers there. Short term, switch those users to the casual template, I can set it as their default. Longer term, custom templates land on the Business tier where you write the format yourself.'],
    ['mira', 'Set the casual default for the ops pod, please. Second thing: someone shared a call link externally and it worked. That surprised our security person. Walk me through link controls?'],
    ['lena', 'By default share links are workspace-only. That link worked because the owner explicitly set it to public. I can lock public sharing off workspace-wide, want that?'],
    ['mira', 'Yes, off by default, admins can grant exceptions.'],
    ['lena', 'Done today. Last thing from me: your renewal conversation starts next month. I will bring usage data so it is an evidence conversation, not a vibes one.'],
    ['mira', 'Appreciated. Same time next week.'],
  ];
}

function productReview() {
  return [
    ['amara', 'This is the monthly roadmap review. Three items: search relevance, the mobile recap experience, and Ask Fathom accuracy on long calls.'],
    ['kenji', 'Search first. We moved to hybrid retrieval two weeks ago. Click-through on first result went from fifty-one to sixty-eight percent. Zero-result queries halved.'],
    ['sofia', 'Related design note: people do not scroll past three results, so I am proposing we collapse per-meeting hits into one card with moment previews.'],
    ['amara', 'Ship the collapsed card behind a flag, measure for two weeks. Mobile recap next. The data says forty percent of summary reads happen on phones within an hour of the call.'],
    ['sofia', 'The new recap is one screen: decisions, actions, and a sixty-second audio digest. Prototype is in Figma, user tests Thursday.'],
    ['kenji', 'Engineering-wise the audio digest is the only heavy piece. We can synthesize it in the pipeline we already run, adds about nine seconds to processing.'],
    ['amara', 'Acceptable. Ask Fathom on long calls: the failure mode is answers citing the wrong segment past the forty-minute mark.'],
    ['kenji', 'Root cause is chunk overlap, not the model. Fix is in review, evaluation set shows citation accuracy going from eighty-one to ninety-four percent.'],
    ['amara', 'Good. Decisions today: collapsed search card behind a flag, mobile recap to user testing, citation fix ships this week. I will write it up.'],
  ];
}

function oneOnOne() {
  return [
    ['lena', 'Hey, our biweekly. You go first this time.'],
    ['tom', 'Big one from me: the Northwind technical review went well but surfaced that I am the only SE who knows the compliance answers cold. If I am out, deals stall. I want to write an internal playbook.'],
    ['lena', 'Strongly yes. Take Friday afternoons for two weeks, I will cover your queue. What else?'],
    ['tom', 'Smaller thing, I keep getting pulled into support escalations that are not really SE work. About five hours a week now.'],
    ['lena', 'That is drift from the old rotation. I will raise it with support leadership this week, you should be at one hour, not five.'],
    ['tom', 'Thanks. How am I doing overall, honestly?'],
    ['lena', 'Genuinely well. Demo-to-pilot conversion on your deals is the best on the team. The playbook idea is exactly the kind of leverage I want to see, it is the sort of thing that shows up in promotion cases.'],
    ['tom', 'Good to hear. That is everything from me.'],
  ];
}

// ---- assembly ---------------------------------------------------------------
const day = (offset, h, m) => {
  const d = new Date('2026-09-29T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - offset); d.setUTCHours(h, m, 0, 0);
  return d.toISOString();
};

function meeting(cfg) {
  const segs = timeline(cfg.script, cfg.start, cfg.pace || 1);
  const durationSec = segs[segs.length - 1].end + 6;
  const attendees = [...new Set(cfg.script.map(([w]) => w))].map((w) => PEOPLE[w].id);
  return {
    id: cfg.id, title: cfg.title, kind: cfg.kind, platform: cfg.platform,
    start: cfg.start, durationSec, attendees, host: cfg.host || ME.id,
    external: cfg.external || false, account: cfg.account || null,
    summaries: cfg.summaries, actionItems: cfg.actionItems || [],
    highlights: cfg.highlights || [], topics: cfg.topics || [],
    transcript: segs, shareToken: cfg.id.replace('m-', 'pub-'),
  };
}

const meetings = [
  meeting({
    id: 'm-qbr-brightloop', title: 'Brightloop × Northwind rollout QBR', kind: 'External · QBR',
    platform: 'zoom', start: day(1, 15, 0), external: true, account: 'Brightloop', pace: 5.5,
    script: bigQbr(),
    summaries: {
      chronological: {
        label: 'Chronological',
        blocks: [
          ['Adoption review', 'Pilot ran 6 weeks across 42 seats: 90% weekly active recorders, 11 meetings captured per user per week, and summary edits before sharing fell from ~40% to 9%. Lisbon plateaued at 60% due to mixed-language transcript quality; a code-switched speech beta will be enabled for both workspaces.'],
          ['Regional feedback', 'Managers in all three regions want weekly digests grouped by account instead of by rep. Lena will configure account-grouped digest views this week; the change applies retroactively.'],
          ['CRM field sync', 'Daniel requires field-level sync with explicit rep confirmation and no silent writes. Business tier supports mapped fields (stage, close date, amount, next step, custom text/date fields) with a full audit log. Security review doc to follow.'],
          ['Compliance', 'Jonas needs an updated DPA reflecting the current sub-processor list before any CRM writes. A redline will be sent by Wednesday; his review turnaround for a redline is one week.'],
          ['Commercials', 'Full rollout is 210 seats phased over two quarters. Pilot pricing holds on all 210 seats only with an annual signature this month: ~$72k/yr annual vs ~$96k at list monthly. Order form to be sent today.'],
        ],
      },
      bant: {
        label: 'Sales · BANT',
        blocks: [
          ['Budget', 'Annual at pilot rate ≈ $72,000 vs $96,000+ list monthly. Mira called the delta "a strong argument" and asked for the order form.'],
          ['Authority', 'Mira (VP Ops) owns the decision, procurement runs in parallel. Daniel (RevOps) and Jonas (Compliance) hold vetoes on CRM sync and the DPA respectively.'],
          ['Need', 'Forecast accuracy: manual CRM updates make forecasts "fiction by Thursday". Adoption evidence is strong (90% WAU, edits down to 9%).'],
          ['Timeline', 'Annual pricing expires end of month. DPA redline Wed → 1-week legal review → signature window is tight but real.'],
        ],
      },
      actionsOnly: {
        label: 'Action items only',
        blocks: [['Actions', 'See the extracted action item list — 6 owners across both companies.']],
      },
    },
    actionItems: [
      { id: 'a1', text: 'Enable code-switched speech beta for Brightloop and Northwind workspaces', owner: 'u-tom', due: 'Friday', done: false, at: 620 },
      { id: 'a2', text: 'Send security review doc + Teams-room voice enrollment guide', owner: 'u-tom', due: 'This week', done: false, at: 1610 },
      { id: 'a3', text: 'Send redlined DPA with current sub-processor list', owner: 'u-sahil', due: 'Wednesday', done: false, at: 1750 },
      { id: 'a4', text: 'Send annual order form for 210 seats at pilot pricing', owner: 'u-sahil', due: 'Today', done: true, at: 2280 },
      { id: 'a5', text: 'Configure account-grouped weekly digests for regional managers', owner: 'u-lena', due: 'This week', done: false, at: 980 },
      { id: 'a6', text: 'Schedule CRM field-mapping workshop with RevOps', owner: 'u-tom', due: 'Early next week', done: false, at: 2350 },
    ],
    highlights: [
      { id: 'h1', at: 300, label: 'Adoption stats: 90% WAU, edits down to 9%', by: 'u-sahil' },
      { id: 'h2', at: 1500, label: 'Dan: "no silent writes into Salesforce, ever"', by: 'u-sahil' },
      { id: 'h3', at: 2150, label: 'Pricing: $72k annual vs $96k list', by: 'u-sahil' },
    ],
    topics: [
      { name: 'Pricing', hits: [2100, 2150, 2210] },
      { name: 'Compliance / DPA', hits: [1680, 1740] },
      { name: 'Competitor mentions', hits: [] },
    ],
  }),
  meeting({
    id: 'm-velocity-demo', title: 'Velocity Cargo — product demo', kind: 'External · Demo',
    platform: 'meet', start: day(2, 10, 30), external: true, account: 'Velocity Cargo', pace: 8,
    script: salesDemo(),
    summaries: {
      chronological: { label: 'Chronological', blocks: [
        ['Context', 'Velocity\'s pain is volume: ~20 short dispatch calls/day per coordinator plus carrier negotiations, with notes written late or never.'],
        ['Demo', 'Showed instant summaries on a 4-minute call, bot-free capture (nothing visibly joins the call), calendar/audio auto-start for back-to-back calls, and competitor keyword alerts with jump links, delivered as digest or in Slack.'],
        ['Objections', 'Raj worried about a visible bot spooking carriers (answered by bot-free local capture) and Emma about zero-click capture between calls (answered by auto-start).'],
        ['Next step', 'Pilot proposal: one dispatch pod + top sales pod, 3 weeks, success criteria agreed upfront. Raj: "If the pilot holds up like this demo, we will talk about the whole floor."'],
      ]},
      bant: { label: 'Sales · BANT', blocks: [
        ['Budget', 'Not discussed — pilot first. Rollout sizing mentioned at ~40 people.'],
        ['Authority', 'Raj (COO) decides; Emma (Sales Director) is the day-to-day champion for the sales-floor use case.'],
        ['Need', 'High: undocumented dispatch calls and competitor-mention chasing are daily, quantified pain.'],
        ['Timeline', 'Pilot can start within a week — the long pole is their SSO admin.'],
      ]},
    },
    actionItems: [
      { id: 'a1', text: 'Send 3-week pilot proposal with success criteria (dispatch pod + sales pod)', owner: 'u-sahil', due: 'Tomorrow', done: true, at: 700 },
      { id: 'a2', text: 'Include competitor keyword alert setup in the pilot config', owner: 'u-sahil', due: 'With proposal', done: false, at: 560 },
    ],
    highlights: [{ id: 'h1', at: 540, label: 'Emma: competitor mentions is what I chase all day', by: 'u-sahil' }],
    topics: [{ name: 'Competitor mentions', hits: [520, 560] }, { name: 'Pricing', hits: [] }],
  }),
  meeting({
    id: 'm-standup-0928', title: 'Product & Eng standup', kind: 'Internal · Standup',
    platform: 'meet', start: day(1, 9, 0), host: 'u-kenji', pace: 5,
    script: standup(),
    summaries: { chronological: { label: 'Chronological', blocks: [
      ['Updates', 'Template picker is on staging (default-ordering question open in channel). Search and share-page empty states are done. Transcript seeking on long calls improved from ~4s to <200ms, PR up.'],
      ['Blockers', 'Consent-banner copy review has been stuck 3 days — Kenji chases today.'],
      ['Risk', 'Diarization vendor deprecates v2 endpoints at end of next month; ~1 week migration, now slotted for next sprint.'],
    ]}},
    actionItems: [
      { id: 'a1', text: 'Chase consent banner copy review', owner: 'u-kenji', due: 'Today', done: true, at: 120 },
      { id: 'a2', text: 'Slot diarization v2→v3 migration into next sprint', owner: 'u-amara', due: 'Sprint planning', done: false, at: 200 },
    ],
    topics: [],
  }),
  meeting({
    id: 'm-cs-brightloop', title: 'Brightloop week-3 check-in', kind: 'External · Check-in',
    platform: 'zoom', start: day(6, 14, 0), external: true, account: 'Brightloop', host: 'u-lena', pace: 8,
    script: csCheckin(),
    summaries: { chronological: { label: 'Chronological', blocks: [
      ['Adoption', '84% of pilot seats active in week 3, ahead of plan.'],
      ['Feedback', 'Summary tone too formal for internal notes → casual template set as default for the ops pod; custom templates exist on Business tier.'],
      ['Security', 'A public share link surprised their security team. Public sharing will be disabled workspace-wide today; admins can grant exceptions.'],
      ['Renewal', 'Renewal conversation starts next month, Lena will bring usage evidence.'],
    ]}},
    actionItems: [
      { id: 'a1', text: 'Set casual summary template as default for the ops pod', owner: 'u-lena', due: 'Today', done: true, at: 260 },
      { id: 'a2', text: 'Disable public share links workspace-wide for Brightloop', owner: 'u-lena', due: 'Today', done: true, at: 420 },
    ],
    highlights: [{ id: 'h1', at: 400, label: 'Public link sharing must be off by default', by: 'u-lena' }],
    topics: [{ name: 'Renewal', hits: [480] }],
  }),
  meeting({
    id: 'm-roadmap-sep', title: 'Monthly roadmap review', kind: 'Internal · Review',
    platform: 'teams', start: day(8, 16, 0), host: 'u-amara', pace: 10,
    script: productReview(),
    summaries: { chronological: { label: 'Chronological', blocks: [
      ['Search', 'Hybrid retrieval shipped: first-result CTR 51%→68%, zero-result queries halved. Collapsed per-meeting result card goes behind a flag for 2 weeks.'],
      ['Mobile recap', '40% of summary reads happen on phones within an hour. One-screen recap (decisions, actions, 60s audio digest) goes to user testing Thursday; digest adds ~9s processing.'],
      ['Ask Fathom', 'Wrong-segment citations past minute 40 traced to chunk overlap; fix raises citation accuracy 81%→94%, ships this week.'],
    ]}},
    actionItems: [
      { id: 'a1', text: 'Ship collapsed search card behind a feature flag', owner: 'u-kenji', due: 'This week', done: false, at: 180 },
      { id: 'a2', text: 'Run mobile recap user tests', owner: 'u-sofia', due: 'Thursday', done: false, at: 300 },
      { id: 'a3', text: 'Ship citation accuracy fix', owner: 'u-kenji', due: 'This week', done: true, at: 430 },
    ],
    topics: [],
  }),
  meeting({
    id: 'm-1on1-tom', title: 'Lena ↔ Tom biweekly 1:1', kind: 'Internal · 1:1',
    platform: 'meet', start: day(3, 11, 0), host: 'u-lena', pace: 9,
    script: oneOnOne(),
    summaries: { chronological: { label: 'Chronological', blocks: [
      ['Growth', 'Tom will write the internal compliance playbook (bus-factor risk on his knowledge); Friday afternoons blocked for two weeks, Lena covers his queue.'],
      ['Workload', '~5h/week of support escalations drifting to Tom; Lena raises with support leadership, target is ≤1h.'],
      ['Feedback', 'Demo-to-pilot conversion best on team; playbook initiative noted as promotion-case material.'],
    ]}},
    actionItems: [
      { id: 'a1', text: 'Block Friday afternoons ×2 for compliance playbook', owner: 'u-tom', due: 'This week', done: false, at: 90 },
      { id: 'a2', text: 'Raise escalation-rotation drift with support leadership', owner: 'u-lena', due: 'This week', done: false, at: 180 },
    ],
    topics: [],
  }),
];

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'meetings.json'), JSON.stringify({ me: ME, people: PEOPLE, meetings }, null, 1));
const total = meetings.reduce((n, m) => n + m.transcript.length, 0);
console.log(`wrote ${meetings.length} meetings, ${total} transcript segments, longest ${Math.max(...meetings.map(m => m.durationSec))}s`);
