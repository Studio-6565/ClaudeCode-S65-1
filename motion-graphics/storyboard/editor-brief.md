# Editor Brief — When Advertising Feels Like Friendship

<p class="byline">October 4, 2026 · Rathan Vijearajah</p>

## Overview

Cut an 8–9 minute YouTube-style video essay from three inputs: Rathan's footage, AI B-roll and 80 finished 4K motion graphics. Rathan's face carries the video. Graphics appear only where they show something words can't.

| Item | Spec |
| --- | --- |
| Runtime | 7–10 min target. The final script is 1,226 words: about 8:34 at 155 words per minute, including the title and visual-only beats. |
| Frame | 16:9, 3840×2160, 30 fps |
| Presenter | Rathan Vijearajah. Their face must appear in the video (submission requirement). |
| Style | Polished YouTube essay, not a classroom slideshow. Dark graphics, cream type, one red accent. |
| Graphics balance (core cut) | About 54% Rathan on screen (4.6 min), 16% AI B-roll, 30% graphics. More once each graphic beat opens on Rathan. |

The one rule: every graphic must move the argument forward. If a graphic only repeats the line being spoken, cut it and stay on Rathan.

## Files

All 80 graphics are in one folder, `motion-graphics/out/`, named by the IDs used in this brief (for example `B20-ThreeYearsOneSecond.mp4`). Download the whole set as one zip (about 450 MB, GitHub sign-in needed): [branch zip](https://github.com/studio-6565/claudecode-s65-1/archive/refs/heads/claude/loving-ride-nvan8p.zip).

| What | Where | Notes |
| --- | --- | --- |
| Full-screen graphics | `out/*.mp4` | H.264, 4K, 30 fps. Each animates in, then holds its last frame, so trim the tail to the voiceover. |
| Overlays | `out/*-ALPHA.mov` | Lossless PNG in MOV with transparency. Put them on a track above the footage. |
| Stills | `out/stills/` | One 4K still per graphic, for thumbnails or freeze frames |
| Edit sheet | `motion-graphics/storyboard/When-Advertising-Feels-Like-Friendship-Edit-Sheet.pdf` | Full script with the file for every line |
| Rathan's footage | From Rathan | Commercial, casual YouTube version, talking head, monitor push-in |
| AI B-roll | From Rathan (Higgsfield) | Set reveal, lifestyle montage, sports-drink ad, beauty creator, fitness creator, young viewer |

ID prefixes: `01`–`32` and `Q1`–`Q7` come from the script, `B01`–`B29` from the storyboard, `C01`–`C12` are chapter cards.

## Premiere setup

The graphics are already tested in Premiere: the overlays import with working transparency. Five setups need specific settings:

1. **Sequence:** 3840×2160 at 30 fps. Drag any `.mp4` from the set onto New Item to match the settings.
2. **YouTube window (`B01`):** put Rathan's casual clip on the track below. Motion: Position **1400, 857.5**, Scale **64.6**. It then sits exactly inside the player hole.
3. **Phone portal (`B28` + `B29`):** stack the tracks as follows. Both files share the same motion.
    - V1: outgoing clip
    - V2: incoming clip, with Track Matte Key set to Matte V3 and Composite using Matte Alpha
    - V3: `B29` (the matte)
    - V4: `B28` (the phone bezel)
4. **Final stack (`B27`):** text only. Add an Essential Graphics rectangle under it with a linear gradient, black on the left fading to transparent at about two-thirds of the width.
5. **Playback:** the 4K lossless overlays are heavy. Use 1/2 or 1/4 playback resolution, or proxies. Neither affects the export.

## Edit approach

Work in three passes and send Rathan an export after each one.

1. **Radio cut:** lay Rathan's voiceover or talking head end to end, tighten the pauses, and lock the runtime. Every timecode in this brief is an estimate until this pass is done.
2. **Core cut:** add the graphics and AI shots marked Core in the beat plan below. Every beat marked You stays on Rathan.
3. **Polish:** sound, colour and captions. Don't swap in the backup graphics without asking Rathan.

Pacing rules:

- Open each graphic beat on Rathan's face, then cut to the graphic on the word it illustrates.
- Let a graphic finish its animation before cutting away. Trim the held last frame, not the motion.
- Never more than two full-screen graphics in a row without Rathan's face or B-roll between them.
- Lines in the beat plan with no graphic are Rathan's opinions. Keep them on Rathan's face.
- Chapter cards (`C01`–`C12`) are optional. Use them only if the cut needs a breather, and then use all of them so they're consistent.

## Beat plan

Every line of the final script (`When_Advertising_Feels_Like_Friendship.docx`) in order, with what goes on screen. Times are estimates; slide them to the radio cut. Core = use the graphic. You = stay on Rathan's face; any graphic listed on a You row is a backup only. The full lines are in the script document.

### 01 · Opening (0:00–1:00)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 0:00 | Think about this for a second. If a random person appears … | `B02-AdvertisementLabel-ALPHA.mov`; Footage: fake commercial, ending with the bottle pushed into the lens; Alt: `02` | Core |
| 0:12 | But what if it’s someone you’ve been watching online for three … | AI: set reveal, pulling back from the bottle to show the lights, stands and monitor | AI shot |
| 0:17 | They’re doing their morning routine, talking about their skin, maybe showing … | `B01-YouTubeWindow-ALPHA.mov`; `B25-CommentsPop-ALPHA.mov`; Footage: casual YouTube version; Alt: `Q1`, `B28` | Core |
| 0:32 | That feels different. It doesn’t really feel like an ad anymore. … | `03-NotAnAd.mp4` | You |
| 0:41 | (no voiceover, about 4 s, music only) | `B05-SplitLabels-ALPHA.mov`; Footage: split screen, commercial left and YouTube version right; Alt: `B03`, `B04` | Core |
| 0:45 | And that’s exactly why influencer marketing is so powerful. Brands aren’t … | Footage: talking head, then hard cut to `B06-TrustOnBlack.mp4` on “Trust.”; Alt: `04` | Core |
| 0:55 | (no voiceover) | `B07-TitlePresenter.mp4`; Alt: `01` | Core |

### 02 · Why this works (1:00–1:39)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 1:00 | A big part of why this works comes down to something … | `B09-TermLowerThird-ALPHA.mov`; `B08-NameLowerThird-ALPHA.mov`; Footage: talking head | Core |
| 1:06 | Basically, it’s a one-sided relationship where you feel like you know … | `06-OneWayRelationship.mp4`; Alt: `05` | Core |
| 1:14 | And social media is almost built for this. You see creators … | `B10-CalendarFill-ALPHA.mov`; AI: lifestyle montage, 2–4 s per clip (morning, getting ready, breakfast, travel); Alt: `07` | Core |
| 1:28 | So after a while, they stop feeling like strangers. They start … | Footage: talking head, then `B12-EvidenceCard1.mp4`; Alt: `08` | Core |

### 03 · Traditional ads vs. influencer ads (1:39–2:22)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 1:39 | Think about how different that is from a normal commercial. If … | Footage: talking head; AI: generic drink commercial, unbranded; Alt: `09` | AI shot |
| 1:54 | Influencer advertising can be way more subtle. You could be watching … | AI: beauty creator morning routine (coffee, outfit, skincare), or reuse the casual YouTube version; Alt: `Q2` | AI shot |
| 2:11 | Now the ad is sitting inside normal content. It doesn’t interrupt … | `10-AdInsideContent.mp4`; Alt: `B15` | Core |

### 04 · Where it starts to get uncomfortable (2:22–3:08)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 2:22 | That’s where things start getting a little uncomfortable. Because from a … | `11-BuiltOverYears.mp4`; Alt: `B16` | You |
| 2:38 | So when a company pays them to promote something, that company … | `12-BorrowedTrust.mp4` | Core |
| 2:51 | And the language usually doesn’t sound like advertising either. It sounds … | `13-AdLanguage.mp4`; Alt: `Q3`, `Q4`, `Q5` | You |

### 05 · The research (3:08–4:02)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 3:08 | When I started looking into the research, I didn’t just want … | Footage: talking head | Footage |
| 3:18 | I wanted to understand why people trust influencers so much, whether … | `14-ResearchQuestions.mp4` | You |
| 3:31 | So I focused on research around parasocial relationships, credibility, sponsored content, … | `B26-SearchTerms.mp4`; Alt: `15` | You |
| 3:37 | And one of the biggest patterns that comes up is that … | `B13-EvidenceCard2.mp4`; Alt: `16` | Core |
| 3:47 | Which makes sense. You’re probably going to take a recommendation more … | Footage: talking head | Footage |

### 06 · Beauty influencers (4:02–4:41)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 4:02 | Take beauty influencers. Imagine you’ve watched the same creator for two … | AI: beauty creator, year 1, mild acne, trying products | AI shot |
| 4:15 | Then one day they show you a serum and say: “This … | AI: same creator, year 2, clearer skin, serum to camera; Alt: `Q6` | AI shot |
| 4:22 | That statement has history behind it. You’re not just evaluating the … | `17-BeautyTimeline.mp4` | Core |
| 4:32 | That makes the recommendation more powerful. The same product shown in … | Footage: reuse the fake commercial from the opening | Footage |

### 07 · Fitness influencers (4:41–5:19)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 4:41 | The same thing happens in fitness. Maybe you follow someone because … | AI: fitness creator working out, then seated with the supplement | AI shot |
| 4:53 | Now you’re not looking at that supplement completely objectively. Your opinion … | `18-TrustTransfer.mp4` | You |
| 5:05 | Then maybe there’s a discount code. A link in the bio. … | `B18-CheckoutFlow.mp4`; Alt: `19` | You |
| 5:14 | Watch. Trust. Click. Buy. | `20-WatchTrustClickBuy.mp4`; Alt: `B24` | Core |

### 08 · What brands are really buying (5:19–5:50)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 5:19 | And that’s why brands love influencer marketing. They’re not just buying … | `B19-BrandFlow.mp4`; Alt: `21` | Core |
| 5:33 | Because a brand might take years to build trust with a … | `22-YearsVsAlready.mp4` | You |
| 5:40 | So instead of saying: “Trust our company.” The brand is basically … | `23-TrustSwap.mp4` | You |

### 09 · What about disclosure? (5:50–6:38)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 5:50 | But then there’s the obvious question. What about sponsorship disclosure? Influencers … | `B17-DisclosureZoom.mp4`, then `24-DisclosureLabels.mp4` | Core |
| 6:01 | And that definitely matters. People should know when money is involved. … | Footage: talking head | Footage |
| 6:13 | If you’ve trusted someone for three years, seeing the word “ad” … | `B20-ThreeYearsOneSecond.mp4`; Alt: `25` | Core |
| 6:21 | You might actually think: “Yeah, they’re getting paid, but they wouldn’t … | `Q7-YouThinking.mp4` | You |
| 6:28 | And that’s exactly the point. The disclosure tells you there’s a … | `B14-EvidenceCard3.mp4`; Alt: `25` | Core |

### 10 · The counterargument (6:38–7:13)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 6:38 | Now, influencer marketing isn’t automatically bad. There are real benefits. Small … | `26-Benefits.mp4`; optional B-roll of a small shop or a creator editing | You |
| 6:55 | So the issue isn’t simply: Influencers get paid, therefore influencer marketing … | `27-TooSimple.mp4` | You |
| 7:01 | The bigger issue is what happens when the creator’s relationship with … | `B21-RentListing.mp4`; Alt: `28` | Core |

### 11 · Younger audiences (7:13–7:50)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 7:13 | And this becomes even more important with younger audiences. If someone … | `B22-DayMonthYear-ALPHA.mov`; AI: young viewer in a dim bedroom watching a creator on a laptop | Core |
| 7:25 | They talk directly to the camera. They respond to comments. They … | `29-GrewUp.mp4` | You |
| 7:35 | So when they recommend something, it can be harder to separate: … | `B23-PersonProductMorph.mp4`; Alt: `30` | Core |

### 12 · Conclusion (7:50–8:34)

| Time | Line | On screen | Use |
| --- | --- | --- | --- |
| 7:50 | So what’s really being sold here? Obviously the product. But not … | `B27-FinalStackOverlay-ALPHA.mov` over the opening commercial and YouTube frame; Alt: `31` | Core |
| 8:03 | That’s what makes influencer marketing different from a traditional ad. The … | Footage: talking head | Footage |
| 8:13 | And once advertising starts feeling like friendship, we probably need to … | Footage: talking head, slow push-in | Footage |
| 8:21 | Because sometimes the most valuable thing in the entire deal isn’t … | `32-Ending.mp4`, then 2 s of black | Core |

## Sound

Music carries the essay, but silence makes the key moments land.

| Moment | Time | Treatment |
| --- | --- | --- |
| Fake commercial | 0:00 | Glossy ad-style bed, a bit too polished on purpose |
| YouTube version | 0:17 | Switch to a soft, casual lo-fi bed. The contrast is the point. |
| Cut to black on “Trust.” | 0:55 | Kill all music. Two beats of silence, then the title comes in with the main theme. |
| Watch. Trust. Click. Buy. | 5:14 | Four hard hits, one per word |
| Disclosure freeze (`B17`) | 5:50 | Hard stop or tape-stop on the freeze |
| “Too simple” stamp (`27`) | 6:55 | One stamp hit |
| “Rented” (`B21`) | 7:01 | A beat of silence after “rented by a brand” |
| Counterargument | 6:38 | Lighter bed. It signals fairness. |
| “More critical about what we’re watching” | 8:13 | Pull the music down under the line |
| Last line, then black | 8:21 | Music out with the cut to black, 2 s of silence |

Keep the music under the voice at about −18 to −20 dB, and mix dialogue to about −14 LUFS integrated for YouTube. Small ticks or whooshes on graphics are fine, but no more than one per graphic.

## Open items, don'ts and delivery

Two things are still open before picture lock. Everything else is ready to cut.

- [ ] Source cards `B12`–`B14` show the citation only. Rathan supplies the one-sentence finding for each, and the cards get re-rendered with it.
- [ ] Give the editor access to the files: GitHub access to the private repo, or send the zip another way.

Don'ts:

- Don't generate text, logos, prices or real brands with AI. All on-screen text comes from the graphics or Premiere.
- Don't use an AI version of Rathan as the main talking head. AI shots are B-roll only.
- Don't scale, stretch or recolour the graphics. They're built for 3840×2160 and the palette is fixed.
- Don't add stock transitions between graphics. Use straight cuts, or the transitions named in the beat plan.

Review rounds:

| Round | What Rathan reviews | Export |
| --- | --- | --- |
| 1 | Radio cut: runtime and pacing | 1080p H.264, burned-in timecode |
| 2 | Core cut: graphics and AI shots in place | 1080p H.264, burned-in timecode |
| 3 | Polish: optional graphics, sound, colour, captions | 1080p H.264 |
| Final | Sign-off | 4K master |

Feedback comes back as timecoded notes, one note per change.

Final delivery:

- 4K master: 3840×2160, 30 fps, H.264 at about 45–68 Mbps, AAC stereo 48 kHz at 320 kbps
- Captions as an `.srt` file
- Submission checklist: the video link, the script, a bibliography, at least 2 academic sources cited on screen, Rathan's name on screen and their face in the video
