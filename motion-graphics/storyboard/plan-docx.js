const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, LevelFormat, AlignmentType, BorderStyle,
} = require('docx');

const RED = 'C8281E';
const MUTE = '6F6A62';

// Section content. Kinds: goal, b (bullet), b2 (sub-bullet), src, todo, visual, q (open question), star (key line)
const sections = [
  ['1. Hook: same product, two ads', '~1 min', [
    ['goal', 'show the whole argument in 60 sec before explaining anything'],
    ['b', 'open on a fake polished skincare ad → obviously an ad, you know they’re selling'],
    ['b', 'flip → same person, same product, casual “YouTube” version'],
    ['b2', 'morning routine, talking about skin, old breakout pic'],
    ['b2', '“been using this every morning for the last few weeks, genuinely love it”'],
    ['b', 'point: same product, same person, same goal… doesn’t FEEL the same'],
    ['b2', 'one = advertising, the other = advice'],
    ['b', 'payoff line: brands aren’t paying for views → they’re paying for TRUST'],
    ['visual', 'ad vs YouTube split screen → cut to black → “TRUST” → title'],
    ['q', 'say the “same product / same person” line in VO, or leave it visual only?'],
  ]],
  ['2. Why it works: parasocial relationships', '~40 sec', [
    ['goal', 'name the concept early; everything else builds on it'],
    ['b', 'define: one-sided relationship, you feel you know them, they don’t know you'],
    ['b', 'why social media amplifies it:'],
    ['b2', 'you see them wake up, GRWM, eat, travel, relationships, home, problems'],
    ['b2', 'sometimes daily, for years'],
    ['b', 'progression: stranger → familiar → trust'],
    ['b', 'that trust = money to advertisers'],
    ['src', 'Source 1 here: where the term comes from (Horton & Wohl, 1956)'],
    ['visual', 'one-way arrow diagram; calendar filling up over the lifestyle montage'],
  ]],
  ['3. Traditional vs influencer ads', '~45 sec', [
    ['goal', 'show WHY influencer ads are harder to spot'],
    ['b', 'traditional: celebrity holding a drink → clear deal, they got paid, everyone knows'],
    ['b', 'influencer: subtle, inside normal content'],
    ['b2', 'coffee → outfit → skincare → “btw, been using this serum…”'],
    ['b', 'key idea: the ad doesn’t interrupt the video, it BECOMES the video'],
    ['b', '→ changes how we experience and process it'],
    ['visual', 'timeline bar with the ad blending in'],
  ]],
  ['4. Where it gets uncomfortable', '~45 sec', [
    ['goal', 'shift from “smart marketing” → “hmm, that’s a bit much”'],
    ['b', 'creator spent months or years building familiarity, credibility, personality'],
    ['b', 'brand pays → gets to BORROW all that trust'],
    ['b2', 'not starting from zero → stepping into an existing relationship'],
    ['b', 'the language gives it away (doesn’t sound like ads):'],
    ['b2', '“you guys keep asking me about this”'],
    ['b2', '“genuinely obsessed with this”'],
    ['b2', '“would never recommend something I don’t use”'],
    ['b', 'why it matters → feels personal, not like a pitch'],
  ]],
  ['5. The research', '~1 min', [
    ['goal', 'show this isn’t just my opinion'],
    ['b', 'not asking IF it works (it obviously does, brands spend on it)'],
    ['b', 'my 3 questions:'],
    ['b2', '1. why do people trust influencers so much?'],
    ['b2', '2. does that trust change buying decisions?'],
    ['b2', '3. does “sponsored” / “ad” actually solve the problem?'],
    ['b', 'areas: parasocial relationships, credibility, sponsored content, purchase intention'],
    ['b', 'main pattern: more persuasive when seen as relatable / authentic / trustworthy'],
    ['b', 'makes sense → a connected person beats a random corporate ad'],
    ['b', 'big idea: the relationship itself becomes part of the marketing'],
    ['src', 'Source 2 here (Sokolova & Kefi, 2020: credibility + parasocial interaction → purchase intention)'],
    ['todo', 'pull the actual finding / one stat from the paper. This is the claim people will question most.'],
  ]],
  ['6. Example 1: beauty', '~40 sec', [
    ['goal', 'make it concrete and relatable'],
    ['b', 'scenario: watched the same creator for 2 years'],
    ['b2', 'seen their bad skin, the products they tried, what worked and what didn’t'],
    ['b', 'then: “this is honestly what changed my skin”'],
    ['b', 'point: that line has HISTORY behind it'],
    ['b2', 'not just judging the serum → judging it through everything you know about them'],
    ['b', 'the same product in a normal ad has none of that'],
    ['visual', '2-year timeline; AI beauty creator year 1 vs year 2'],
  ]],
  ['7. Example 2: fitness', '~40 sec', [
    ['goal', 'show it’s not just beauty, and show the path to buying'],
    ['b', 'follow for workouts → watched the transformation → trust some advice'],
    ['b', 'then a supplement rec → not objective anymore, your opinion of the creator comes with it'],
    ['b', 'trust TRANSFERS to the product'],
    ['b', 'then: discount code + link in bio + limited time → super easy'],
    ['star', 'punch: Watch. Trust. Click. Buy.'],
    ['visual', 'checkout flow; four words on the beat'],
  ]],
  ['8. What brands are really buying', '~30 sec', [
    ['goal', 'zoom out → the business logic'],
    ['b', 'not buying reach → buying ACCESS to an audience with an existing relationship'],
    ['b', 'a brand needs years to build trust; an influencer might already have it'],
    ['b', 'reframe:'],
    ['b2', '✗ “trust our company”'],
    ['b2', '✓ “trust this person you already like”'],
    ['b', '= a much stronger sales tool'],
  ]],
  ['9. But what about #ad?', '~50 sec', [
    ['goal', 'answer the obvious counter before the viewer thinks it'],
    ['b', 'yes, they have to disclose: paid partnership / sponsored / ad'],
    ['b', 'yes, it matters, people should know money is involved'],
    ['b', 'BUT it doesn’t erase the relationship'],
    ['b2', '3 years of trust vs 1 word'],
    ['b', 'viewer’s thought: “yeah they’re paid, but they wouldn’t recommend something they didn’t believe in”'],
    ['b', '→ disclosure tells you there’s a business deal… credibility still does the selling'],
    ['src', 'Source 3 here (Boerman et al., 2017: sponsorship disclosure)'],
    ['todo', 'what did they actually find about disclosure? Use their real result.'],
    ['visual', 'freeze + zoom on the tiny “paid partnership” label; 3 years vs 1 second'],
  ]],
  ['10. Counterargument: it’s not all bad', '~35 sec', [
    ['goal', 'be fair → it makes the rest more convincing'],
    ['b', 'real benefits:'],
    ['b2', 'small businesses reach niche audiences'],
    ['b2', 'creators get paid for their work'],
    ['b2', 'people find products they genuinely like'],
    ['b2', 'some creators are very selective'],
    ['b', 'so NOT “influencers get paid → bad” (too simple)'],
    ['b', 'real issue: when the relationship itself can be RENTED by a brand'],
    ['b', '→ that’s where the line gets blurry'],
    ['visual', '“for rent” listing (joke beat)'],
  ]],
  ['11. Younger audiences', '~35 sec', [
    ['goal', 'raise the stakes'],
    ['b', 'grew up watching YouTubers / TikTokers / streamers daily'],
    ['b', 'they feel different from celebrities:'],
    ['b2', 'talk to camera, reply to comments, share personal stuff'],
    ['b2', 'feels like you grew up with them'],
    ['b', 'harder to separate “I trust this person” from “I trust this product”'],
    ['b', 'not the same thing, but marketing makes them feel the same'],
    ['q', 'maybe one line on what younger viewers could do differently? (optional)'],
  ]],
  ['12. Conclusion: what’s actually being sold', '~45 sec', [
    ['goal', 'tie back to the opening and leave them with one thought'],
    ['b', 'what’s being sold? the product… but not just the product'],
    ['b2', 'attention → access → credibility → TRUST (build it up)'],
    ['b', 'the difference from a traditional ad → the creator built the relationship, the brand steps in'],
    ['b', 'call to think: once ads feel like friendship → be more critical about what we’re watching'],
    ['star', 'closing line, word for word: “Sometimes the most valuable thing in the entire deal isn’t the product being promoted. It’s the trust that already existed before the ad ever started.”'],
    ['visual', 'back to the opening footage + final stack → black'],
  ]],
];

const label = (text, color) => new TextRun({text: text + '  ', bold: true, color, size: 18, font: 'Arial'});
const body = (text, opts = {}) => new TextRun({text, size: 21, font: 'Arial', ...opts});

const children = [];
const p = (o) => children.push(new Paragraph(o));

p({heading: HeadingLevel.TITLE, children: [new TextRun({text: 'When Advertising Feels Like Friendship', font: 'Georgia', size: 52})]});
p({spacing: {after: 240}, border: {bottom: {style: BorderStyle.SINGLE, size: 12, color: RED, space: 8}},
  children: [body('Plan notes before scripting · video essay · Rathan Vijearajah', {color: MUTE})]});

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'Core idea'})]});
for (const t of [
  'influencer ads work because they don’t feel like ads → they feel like advice from a friend',
  'brands aren’t really buying views or reach → they’re buying the trust that already exists',
  'disclosure (“#ad”) helps, but it doesn’t undo the relationship',
  'end point: once ads feel like friendship, we need to watch more critically',
]) p({numbering: {reference: 'bullets', level: 0}, children: [body(t)]});

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'Audience, tone and format'})]});
for (const t of [
  'for people who watch creators daily (especially younger viewers), plus a class / academic audience',
  'tone: YouTube video essay, not a lecture. Curious, a bit critical, fair',
  'about 7–10 minutes, 16:9: me on camera + AI B-roll + motion graphics',
  'must include: 2+ academic sources on screen, my face, my name',
]) p({numbering: {reference: 'bullets', level: 0}, children: [body(t)]});

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'Structure'})]});
for (const [title, time, items] of sections) {
  p({heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun({text: title}), new TextRun({text: '   ' + time, color: MUTE, size: 22, bold: false})]});
  for (const [kind, text] of items) {
    if (kind === 'b' || kind === 'b2') {
      p({numbering: {reference: 'bullets', level: kind === 'b' ? 0 : 1}, children: [body(text)]});
    } else {
      const map = {goal: ['GOAL', RED], src: ['SOURCE', '2F5E7A'], todo: ['TO DO', 'B45309'], visual: ['VISUAL', MUTE], q: ['DECIDE', 'B45309'], star: ['KEY LINE', RED]};
      const [lab, col] = map[kind];
      p({indent: {left: 360}, spacing: {before: kind === 'goal' ? 40 : 60, after: 60},
        children: [label(lab, col), body(text, {italics: kind === 'goal' || kind === 'visual', bold: kind === 'star'})]});
    }
  }
}

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'Through-lines'})]});
for (const t of [
  'keep coming back to TRUST, but mix in credibility / familiarity / relationship so it doesn’t wear out',
  'recurring visual: the creator → audience link, with the brand “entering” it',
  'callback: the opening ad returns at the end',
]) p({numbering: {reference: 'bullets', level: 0}, children: [body(t)]});

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'To do before scripting'})]});
for (const t of [
  'pull one real finding per source (3 total) to put on screen',
  'decide: the “same product / same person” line in VO, or visual only',
  'decide: one practical takeaway at the end (e.g. a question to ask yourself: “would they still say this if they weren’t paid?”)',
  'check runtime: aim for about 1,200 words ≈ 8 minutes',
  'mark which lines are said on camera and which go over B-roll',
]) p({numbering: {reference: 'checks', level: 0}, children: [body(t)]});

p({heading: HeadingLevel.HEADING_1, children: [new TextRun({text: 'Weak spots to fix'})]});
for (const t of [
  'the research section needs real numbers or findings, or it reads as opinion',
  'the #ad section is the core argument, so it needs the strongest evidence',
  'the ending is a bit vague → a concrete “how to watch smarter” line would land harder',
]) p({numbering: {reference: 'bullets', level: 0}, children: [body(t)]});

const doc = new Document({
  styles: {
    default: {document: {run: {font: 'Arial', size: 21}}},
    paragraphStyles: [
      {id: 'Title', name: 'Title', basedOn: 'Normal', run: {font: 'Georgia', size: 52}, paragraph: {spacing: {after: 60}}},
      {id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: {font: 'Georgia', size: 32, color: '1A1816'}, paragraph: {spacing: {before: 320, after: 100}, outlineLevel: 0}},
      {id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: {font: 'Arial', size: 24, bold: true, color: RED}, paragraph: {spacing: {before: 260, after: 80}, outlineLevel: 1}},
    ],
  },
  numbering: {config: [
    {reference: 'bullets', levels: [
      {level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 720, hanging: 300}}}},
      {level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 1200, hanging: 300}}}},
    ]},
    {reference: 'checks', levels: [
      {level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT, style: {paragraph: {indent: {left: 720, hanging: 340}}}},
    ]},
  ]},
  sections: [{properties: {page: {size: {width: 12240, height: 15840}, margin: {top: 1080, bottom: 1080, left: 1260, right: 1260}}}, children}],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('written');
});
