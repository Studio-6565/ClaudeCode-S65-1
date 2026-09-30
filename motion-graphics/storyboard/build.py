# Builds storyboard.html from the beat list below. Timecodes are estimated from word count.
import html, os

WPM = 155

NAMES = {
    '01': 'Title', '02': 'Stranger vs familiar', '03': 'Not an ad', '04': 'Not views — trust', '05': 'Parasocial definition',
    '06': 'One-way relationship', '07': 'Daily feed', '08': 'Stranger → trust', '09': 'Ad comparison', '10': 'Ad inside content',
    '11': 'Built over years', '12': 'Borrowed trust', '13': 'Ad language', '14': 'Research questions', '15': 'Research focus',
    '16': 'Traits', '17': 'Beauty timeline', '18': 'Trust transfer', '19': 'Friction', '20': 'Watch Trust Click Buy',
    '21': 'Reach vs access', '22': 'Years vs already', '23': 'Trust swap', '24': 'Disclosure labels', '25': 'Disclosure vs trust',
    '26': 'Benefits', '27': 'Too simple', '28': 'For rent', '29': 'Grew up', '30': 'Person vs product', '31': 'What’s being sold',
    '32': 'Ending', 'Q1': 'Quote: every morning', 'Q2': 'Quote: by the way', 'Q3': 'Quote: keep asking', 'Q4': 'Quote: obsessed',
    'Q5': 'Quote: never recommend', 'Q6': 'Quote: changed my skin', 'Q7': 'Quote: you, thinking',
    'B01': 'YouTube window', 'B02': 'Advertisement tag', 'B03': 'Same × 3', 'B04': 'Advertising vs advice', 'B05': 'Split labels',
    'B06': 'TRUST on black', 'B07': 'Title + presenter', 'B08': 'Name lower third', 'B09': 'Term lower third', 'B10': 'Calendar fill',
    'B11': 'Exposure → trust', 'B12': 'Source 1 card', 'B13': 'Source 2 card', 'B14': 'Source 3 card', 'B15': 'Ad break vs embedded',
    'B16': 'Followers vs trust', 'B17': 'Disclosure zoom', 'B18': 'Checkout flow', 'B19': 'Brand flow', 'B20': '3 years vs 1 second',
    'B21': 'Rent listing', 'B22': 'Day → year stamps', 'B23': 'Person → product morph', 'B24': 'WTCB flash', 'B25': 'Comments pop',
    'B26': 'Search terms', 'B27': 'Final stack overlay', 'B28': 'Phone portal',
}
OVERLAY = {'B01', 'B02', 'B05', 'B08', 'B09', 'B10', 'B22', 'B25', 'B27', 'B28'}

# Each beat: vo, layers [(kind, text)], mg (hero graphic ids in order), alt ids, note, core (bool), extra seconds (visual-only time)
CH = []
def chapter(title, card): CH.append({'title': title, 'card': card, 'beats': []})
def beat(vo, layers, mg=(), alt=(), note='', core=False, extra=0, fixed=None):
    CH[-1]['beats'].append(dict(vo=vo, layers=layers, mg=list(mg), alt=list(alt), note=note, core=core, extra=extra, fixed=fixed))

chapter('Opening — the same product, two different ads', 'C01')
beat('Think about this for a second. If a random person appears in a commercial and tells you to buy a skincare product, you immediately know what’s happening. They’re selling you something.',
     [('real', 'A4 fake commercial: beauty lighting, product hero inserts'), ('real', 'A2 bottle pushed into lens to end the shot')],
     ['B02'], ['02'], 'Open cold on the commercial. The tag sits in the corner the whole shot.', core=True)
beat('But what if it’s someone you’ve been watching online for three years?',
     [('ai', 'Set reveal: pull back from the bottle to show lights, stands and monitor (Higgsfield prompt p.7)')],
     [], [], 'Transition 1, product lens cover: cut while the bottle fills the frame.')
beat('They’re doing their morning routine, talking about their skin, maybe showing an old photo of a breakout, and then they say: “I’ve been using this every morning and I genuinely love it.”',
     [('real', 'A3 casual YouTube version: same product, same wardrobe'), ('mg', 'Real clip sits inside the YouTube window')],
     ['B01', 'B25'], ['Q1', 'B28'], 'Push in to the monitor (transition 3, portal) to enter the YouTube window. Bring in the comments on the quote.', core=True)
beat('That feels different. It doesn’t really feel like an ad anymore. It feels like a recommendation from someone you know.',
     [('mg', 'Full-screen graphic')], ['03'], [], '')
beat('Same product. Same person. Same goal. But these two ads don’t feel the same. One feels like advertising. The other feels like advice.',
     [('real', 'Split screen: commercial left, YouTube version right'), ('mg', 'Labels over the split')],
     ['B05'], ['B03', 'B04'], 'Let the two halves play in sync so the difference is in tone, not action.', core=True)
beat('And that’s exactly why influencer marketing is so powerful. Brands aren’t just paying influencers for views. They’re paying for something much more valuable: trust.',
     [('real', 'A1 talking head'), ('mg', 'Hard cut to black on the word “trust”')],
     ['B06'], ['04'], 'Kill the music on the cut to black. Two beats of silence.', core=True)
beat('', [('mg', 'Title card')], ['B07'], ['01'], 'Music back in. Put the name lower third (B08) on your first talking-head shot after the title.', core=True, fixed=5)

chapter('Why this works', 'C02')
beat('A big part of it comes down to something called a parasocial relationship.',
     [('real', 'A5 talking head'), ('mg', 'Term lower third')], ['B09', 'B08'], [], 'B08 name lower third if this is your first on-camera shot after the title.', core=True)
beat('Basically, it’s a one-sided relationship where you feel like you know someone, even though they don’t actually know you.',
     [('mg', 'Full-screen diagram')], ['06'], ['05'], '', core=True)
beat('And social media is almost built for this. You see creators waking up, getting ready, eating, travelling, talking about their relationships, showing their homes, and talking about their problems. Sometimes you’re watching them every single day.',
     [('ai', 'Lifestyle montage, 2–4 s per clip: morning, get ready, breakfast, travel (prompts p.8)'), ('mg', 'Calendar filling over the montage')],
     ['B10'], ['07'], 'Cut each clip on the verb in the VO.', core=True)
beat('So after a while, they don’t really feel like a stranger anymore. They start to feel familiar. And familiarity can turn into trust. That trust is incredibly valuable to advertisers.',
     [('mg', 'Diagram, then source card')], ['B11', 'B12'], ['08'], 'Source 1 (Horton & Wohl) goes here. Add the finding before you lock the edit.', core=True)

chapter('Traditional ads vs. influencer ads', 'C03')
beat('Think about how different that is from a normal commercial. If you see a celebrity holding a bottle of Gatorade in a commercial, you understand the arrangement. They got paid. They’re in an ad. Everyone knows what’s happening.',
     [('real', 'A5 talking head'), ('ai', 'Generic sports-drink ad B-roll. Don’t generate a real brand’s logo.')],
     [], ['09'], 'Keep it unbranded. Say “Gatorade” in VO only.')
beat('Influencer advertising can be way more subtle. You could be watching someone’s morning routine. They show their coffee, their outfit, their skincare, and somewhere in the middle they go: “By the way, I’ve actually been using this serum for the past few weeks.”',
     [('ai', 'Beauty creator morning routine: coffee, outfit, skincare'), ('real', 'Or reuse A3')],
     [], ['Q2'], 'Play the serum line as sync sound from the creator if you have it.')
beat('Now the ad is sitting inside normal content. It doesn’t interrupt the video. It becomes part of the video. And that changes how we experience it.',
     [('mg', 'Full-screen graphic')], ['10'], ['B15'], 'The playhead scrubs during the first line. The headline lands on “becomes part of the video”.', core=True)

chapter('Where it starts to get uncomfortable', 'C04')
beat('Because from a marketing perspective, this is extremely smart. The influencer has already spent months or years building the audience. They’ve built familiarity. They’ve built credibility. They’ve built a personality people connect with.',
     [('mg', 'Full-screen graphic')], ['11'], ['B16'], 'Blocks drop on familiarity / credibility / personality.')
beat('So when a company comes in and pays them to promote something, that company gets to borrow all of that trust. They’re not starting from zero. They’re entering a relationship that already exists.',
     [('mg', 'Full-screen graphic')], ['12'], [], '', core=True)
beat('And the language usually doesn’t sound like advertising either. It sounds like: “You guys keep asking me about this.” Or: “I’ve genuinely been obsessed with this.” Or: “I would never recommend something I don’t actually use.” That language matters because it feels personal.',
     [('mg', 'Full-screen graphic')], ['13'], ['Q3', 'Q4', 'Q5'], 'Or cut the three quote cards one after another, one per line.')

chapter('What the research is trying to answer', 'C05')
beat('When I started looking into the research, I didn’t just want to know whether influencer marketing works. We already know brands use it because it works.',
     [('real', 'A5 talking head')], [], [], 'Give the audience your face here. It has been graphics for a while.')
beat('I wanted to understand why people trust influencers so much, whether that trust actually affects buying decisions, and whether simply putting “sponsored” or “ad” on a post really solves the problem.',
     [('mg', 'Full-screen graphic')], ['14'], [], '', core=True)
beat('So I focused on research around parasocial relationships, credibility, sponsored content, and purchase intention.',
     [('mg', 'Full-screen graphic')], ['B26'], ['15'], '')
beat('One of the biggest ideas that keeps coming up is that influencers become more persuasive when audiences see them as relatable, authentic, or trustworthy.',
     [('mg', 'Source card')], ['B13'], ['16'], 'Source 2 (Sokolova & Kefi) goes here. This is the claim that most needs a citation.', core=True)
beat('Which makes sense. You’re probably going to take a recommendation more seriously from someone you feel connected to than from a random corporate ad. The interesting part is that the relationship itself starts becoming part of the marketing.',
     [('real', 'A5 talking head')], [], [], '')

chapter('Beauty influencers', 'C06')
beat('Take beauty influencers. Imagine you’ve watched the same creator for two years. You’ve seen their skin when it was bad. You’ve seen them test different products. You’ve seen what worked and what didn’t.',
     [('ai', 'Beauty creator, year 1: mild acne, testing products (prompt p.9)')], [], [], 'Build the character still first, then animate from it.')
beat('Then one day they show you a serum and say: “This is honestly what changed my skin.”',
     [('ai', 'Same creator, year 2: clearer skin, holds the serum to camera')], [], ['Q6'], '')
beat('That statement has history behind it. You’re not just evaluating the serum. You’re evaluating it through everything you already know about that person.',
     [('mg', 'Full-screen graphic')], ['17'], [], 'The timeline recaps two years in 11 seconds and ends on “history”.', core=True)
beat('That makes the recommendation more powerful. The same product shown in a normal commercial doesn’t have that relationship attached to it. You’re not just buying the serum. You’re buying the story attached to the serum.',
     [('real', 'Callback: reuse the A4 commercial footage from the opening')], [], [], 'Echoing the opening ties the argument together.')

chapter('Fitness influencers', 'C07')
beat('The same thing happens in fitness. Maybe you follow someone because you like their workouts. You’ve watched their transformation. You trust some of their advice. Then eventually they recommend a supplement.',
     [('ai', 'Fitness creator: workout, then seated with the supplement (prompt p.9)')], [], [], '')
beat('Now you’re not looking at that supplement completely objectively. Your opinion of the creator comes with it. If you trust them, some of that trust transfers to the product.',
     [('mg', 'Full-screen graphic')], ['18'], [], '', core=True)
beat('Then maybe there’s a discount code. A link in the bio. A limited-time offer. And suddenly the whole thing becomes very easy.',
     [('mg', 'Full-screen graphic')], ['B18'], ['19'], 'Tick sound on each step.')
beat('Watch. Trust. Click. Buy.',
     [('mg', 'Full-screen, one word per beat')], ['20'], ['B24'], 'Four sound hits. B24 is the faster, louder version.', core=True, extra=3)

chapter('What brands are really buying', 'C08')
beat('And that’s why brands love influencer marketing. They’re not just buying reach. They’re buying access to an audience that already has a relationship with the person delivering the message.',
     [('mg', 'Full-screen graphic')], ['B19'], ['21'], '', core=True)
beat('A brand might take years to build trust with a customer. An influencer might already have it.',
     [('mg', 'Full-screen graphic')], ['22'], [], '')
beat('So instead of saying, “Trust our company,” the brand is basically saying, “Trust this person you already like.” That’s a much stronger sales tool.',
     [('mg', 'Full-screen graphic')], ['23'], [], '', core=True)

chapter('But what about #ad?', 'C09')
beat('This is usually the obvious response. Influencers are supposed to tell people when something is sponsored. You’ll see things like “Paid partnership,” “Sponsored,” or “Ad.”',
     [('mg', 'Freeze and zoom, then the labels')], ['B17', '24'], [], 'Record-scratch or a hard stop on the freeze.', core=True)
beat('And yes, that absolutely matters. People should know when money is involved. But I don’t think that completely fixes the issue. Knowing something is sponsored doesn’t suddenly erase the relationship.',
     [('real', 'A5 talking head')], [], [], 'Your opinion. Say it to camera.')
beat('If you’ve trusted someone for three years, seeing the word “ad” probably doesn’t make all of that disappear.',
     [('mg', 'Full-screen graphic')], ['B20'], ['25'], '', core=True)
beat('You might actually think: “Yeah, they’re getting paid, but they wouldn’t recommend something they didn’t believe in.”',
     [('mg', 'Quote card')], ['Q7'], [], '')
beat('And that’s exactly the point. The disclosure tells you there’s a business relationship. But the influencer’s credibility is still doing most of the selling.',
     [('mg', 'Source card')], ['B14'], ['25'], 'Source 3 (Boerman et al.) goes here.', core=True)

chapter('The counterargument', 'C10')
beat('Now, I don’t think influencer marketing is automatically bad. There are real benefits. Small businesses can reach very specific audiences. Creators can actually make money from their content. People can discover products they genuinely like. And some creators are very selective with who they work with.',
     [('mg', 'Full-screen list'), ('ai', 'Optional stock/AI: small shop, creator editing')], ['26'], [], 'Lighter music bed here. It signals fairness.')
beat('So the issue isn’t simply: influencers get paid, therefore influencer marketing is bad. That’s too simple.',
     [('mg', 'Full-screen graphic')], ['27'], [], 'Stamp hits on “too simple”.')
beat('The bigger issue is what happens when the creator’s relationship with the audience becomes something that can basically be rented by a brand. That’s where the line gets blurry.',
     [('mg', 'Full-screen graphic')], ['B21'], ['28'], 'The joke lands better with a beat of silence after “rented”.', core=True)

chapter('Why younger audiences matter', 'C11')
beat('And this becomes even more important with younger audiences. If someone grows up watching YouTubers, TikTok creators, or streamers every day, those creators can feel very different from traditional celebrities.',
     [('ai', 'Viewer in a dim bedroom watching a creator on a laptop (prompt p.10)'), ('mg', 'Timestamps over the shot')], ['B22'], [], '', core=True)
beat('They talk directly to the camera. They respond to comments. They share personal stories. You might feel like you grew up with them.',
     [('mg', 'Full-screen graphic')], ['29'], [], '')
beat('So when they recommend something, it can be harder to separate: “I trust this person” from “I trust this product.” Those are not necessarily the same thing. But influencer marketing can make them feel like they are.',
     [('mg', 'Full-screen graphic')], ['B23'], ['30'], 'Letters scramble on “product” and break apart on “not the same thing”.', core=True)

chapter('Conclusion — what is really being sold?', 'C12')
beat('So what’s really being sold here? Obviously the product. But not just the product. Attention is being sold. Access is being sold. Credibility is being sold. And most importantly, trust is being sold.',
     [('real', 'Return to the opening: commercial and YouTube frame'), ('mg', 'Stack over the footage')], ['B27'], ['31'], 'Darken the left side of the footage in your edit so the stack reads.', core=True)
beat('That’s what makes influencer marketing different from a traditional ad. The creator has already built the relationship. The brand gets to step into it.',
     [('real', 'A5 talking head')], [], [], '')
beat('And once advertising starts feeling like friendship, we probably need to be more critical about what we’re actually watching.',
     [('real', 'A5 talking head, slow push-in')], [], [], 'Pull the music down under this line.')
beat('Because sometimes the most valuable thing in the entire deal isn’t the product being promoted. It’s the trust that already existed before the ad ever started.',
     [('mg', 'Full-screen, then cut to black')], ['32'], [], 'Hold black for two seconds before the end card.', core=True, extra=2)

# ── timing ─────────────────────────────────────────────────────────────────
def secs(b):
    if b['fixed'] is not None: return b['fixed']
    return len(b['vo'].split()) / WPM * 60 + 0.6 + b['extra']
t = 0.0
kind_time = {'real': 0, 'ai': 0, 'mg': 0}
used = []
for ch in CH:
    ch['start'] = t
    for b in ch['beats']:
        b['start'] = t; d = secs(b); b['dur'] = d; t += d
        k = b['layers'][0][0]
        kind_time[k] += d
        used += b['mg']
    ch['end'] = t
TOTAL = t
tc = lambda s: f'{int(s // 60)}:{int(s % 60):02d}'
hero = list(dict.fromkeys(used))
core_ids = list(dict.fromkeys(i for ch in CH for b in ch['beats'] if b['core'] for i in b['mg']))
alts = list(dict.fromkeys(a for ch in CH for b in ch['beats'] for a in b['alt'] if a not in hero))
all_ids = [k for k in NAMES]
unused = [i for i in all_ids if i not in hero and i not in alts and i not in ('B29',)]

e = html.escape
NOTHUMB = '<div class="nothumb">No graphic. Footage carries it.</div>'
KLABEL = {'real': 'Your footage', 'ai': 'AI B-roll', 'mg': 'Graphic'}

def card(i, small=False):
    kind = 'overlay' if i in OVERLAY else 'full'
    cls = 'thumb small' if small else 'thumb'
    return (f'<figure class="{cls}"><img src="thumbs/{i}.jpg" alt="{e(NAMES[i])}" loading="lazy">'
            f'<figcaption><b>{i}</b> {e(NAMES[i])}{" · overlay" if kind == "overlay" and not small else ""}</figcaption></figure>')

rows = []
for n, ch in enumerate(CH, 1):
    rows.append(f'<section class="chapter"><header class="ch-head"><span class="ch-no">Chapter {n:02d}</span>'
                f'<h2>{e(ch["title"])}</h2><span class="ch-tc">{tc(ch["start"])}–{tc(ch["end"])}</span>'
                f'<span class="ch-card">Optional card: {ch["card"]}</span></header>')
    for b in ch['beats']:
        kinds = ' '.join(sorted({k for k, _ in b['layers']}))
        layers = ''.join(f'<li class="layer {k}"><span class="tag">{KLABEL[k]}</span>{e(txt)}</li>' for k, txt in b['layers'])
        heroes = ''.join(card(i) for i in b['mg'])
        altc = ''.join(card(i, True) for i in b['alt'])
        note = f'<p class="note">{e(b["note"])}</p>' if b['note'] else ''
        alts_html = f'<div class="alts"><span>Alternates</span><div class="alt-row">{altc}</div></div>' if altc else ''
        vo = f'<p class="vo">{e(b["vo"])}</p>' if b['vo'] else '<p class="vo none">No voiceover</p>'
        rows.append(
            f'<article class="beat{" core" if b["core"] else ""}" data-kinds="{kinds}">'
            f'<div class="tc"><span>{tc(b["start"])}</span><small>{b["dur"]:.0f}s</small>{"<em>core</em>" if b["core"] else ""}</div>'
            f'<div class="words">{vo}<ul class="layers">{layers}</ul>{note}</div>'
            f'<div class="picture">{heroes or NOTHUMB}'
            f'{alts_html}</div>'
            f'</article>')
    rows.append('</section>')

# timeline strip
strip = []
for ch in CH:
    for b in ch['beats']:
        k = b['layers'][0][0]
        strip.append(f'<span class="seg {k}" style="flex:{b["dur"]:.2f}" title="{tc(b["start"])} {KLABEL[k]}"></span>')
pct = {k: round(100 * v / TOTAL) for k, v in kind_time.items()}
# Core cut: non-core beats led by a graphic fall back to your talking head.
core_time = {'real': 0, 'ai': 0, 'mg': 0}
for ch in CH:
    for b in ch['beats']:
        k = b['layers'][0][0]
        core_time['real' if (k == 'mg' and not b['core']) else k] += b['dur']
cpct = {k: round(100 * v / TOTAL) for k, v in core_time.items()}
core_full = [i for i in core_ids if i not in OVERLAY]
core_over = [i for i in core_ids if i in OVERLAY]

page = open(os.path.join(os.path.dirname(__file__), 'template.html')).read()
page = (page.replace('{{RUNTIME}}', tc(TOTAL)).replace('{{BEATS}}', str(sum(len(c['beats']) for c in CH)))
        .replace('{{HERO}}', str(len(hero))).replace('{{CORE}}', str(len(core_ids))).replace('{{STRIP}}', ''.join(strip))
        .replace('{{PREAL}}', str(pct['real'])).replace('{{PAI}}', str(pct['ai'])).replace('{{PMG}}', str(pct['mg']))
        .replace('{{CREAL}}', str(cpct['real'])).replace('{{CAI}}', str(cpct['ai'])).replace('{{CMG}}', str(cpct['mg'])).replace('{{CFULL}}', str(len(core_full))).replace('{{COVER}}', str(len(core_over)))
        .replace('{{ROWS}}', '\n'.join(rows))
        .replace('{{UNUSED}}', ''.join(card(i, True) for i in unused)).replace('{{NUNUSED}}', str(len(unused))))
if not unused:
    import re
    page = re.sub(r'<section class="unused">.*?</section>', '<p class="method">Every rendered graphic appears here as a main pick or an alternate. Chapter cards C01–C12 are listed on each chapter header. They’re optional and mostly useful as YouTube chapter markers.</p>', page, flags=re.S)
open(os.path.join(os.path.dirname(__file__), 'storyboard.html'), 'w').write(page)
print('core', cpct, len(core_full), len(core_over)); print('runtime', tc(TOTAL), 'beats', sum(len(c['beats']) for c in CH), 'hero', len(hero), 'core', len(core_ids), 'alts', len(alts), 'unused', len(unused), pct)
print('unused:', unused)
