# Motion graphics — "When Advertising Feels Like Friendship"

80 clips at 3840×2160, 30 fps: 39 in pack 1 (from the script), 29 in pack 2 (from the storyboard) and 12 chapter cards. Solid clips are H.264 `.mp4`. Overlays (`-ALPHA`) are lossless PNG-in-MOV with transparency. Built with Remotion. Rendered clips are in `out/`, and poster frames are in `out/posters/`.

Design system: near-black background, cream type, one red accent (#FF3B2F). Instrument Serif for statements, Inter for UI, and JetBrains Mono for labels. Every clip animates in and then holds its final frame, so you can trim the tail to fit your VO.

| Clip | Script beat |
|---|---|
| 01-Title | Title card |
| 02-StrangerVsFamiliar | Random person in a commercial vs. someone you've watched for 3 years |
| 03-NotAnAd | "It doesn't feel like an ad anymore… a recommendation from someone you know" |
| 04-NotViewsTrust | "Brands aren't just paying for views… Trust." |
| 05-ParasocialDefinition | Parasocial relationship definition |
| 06-OneWayRelationship | One-sided relationship diagram |
| 07-DailyFeed | Waking up / getting ready / eating / travelling… every single day |
| 08-StrangerToTrust | Stranger → familiar → trust |
| 09-AdComparison | Traditional ad vs influencer ad (Gatorade section) |
| 10-AdInsideContent | Morning-routine timeline where the serum ad blends into the video |
| 11-BuiltOverYears | Familiarity, credibility, personality… the brand isn't starting from zero |
| 12-BorrowedTrust | The brand pays and borrows trust it never built |
| 13-AdLanguage | "You guys keep asking…" / "obsessed" / "never recommend" |
| 14-ResearchQuestions | The three research questions |
| 15-ResearchFocus | Parasocial relationships, credibility, sponsored content, purchase intention |
| 16-Traits | Relatable. Authentic. Trustworthy. |
| 17-BeautyTimeline | Two years watching a beauty creator |
| 18-TrustTransfer | Trust transfers from creator to product (fitness section) |
| 19-Friction | Discount code, link in bio, limited-time offer |
| 20-WatchTrustClickBuy | Watch. Trust. Click. Buy. |
| 21-ReachVsAccess | Not buying reach, buying access |
| 22-YearsVsAlready | A brand takes years; an influencer already has it |
| 23-TrustSwap | "Trust our company." → "Trust this person you already like." |
| 24-DisclosureLabels | Paid partnership / Sponsored / #ad |
| 25-DisclosureVsTrust | The AD label barely dents 3 years of trust |
| 26-Benefits | To be fair: the real benefits |
| 27-TooSimple | "Influencers get paid, therefore it's bad" → TOO SIMPLE |
| 28-ForRent | The relationship, for rent |
| 29-GrewUp | Younger audiences grew up with them |
| 30-PersonVsProduct | "I trust this person" ≠ "I trust this product" |
| 31-WhatsBeingSold | Product → attention → access → credibility → trust |
| 32-Ending | Closing line |
| Q1–Q7 | Quote cards for each creator line and the viewer's rationalisation |

## Pack 2 — from the storyboard

| Clip | Storyboard beat | Type |
|---|---|---|
| B01-YouTubeWindow | 0:25 YouTube UI. The player area is a transparent hole: put your real clip under it at **x 160, y 160, 2480×1395** (4K px). | overlay |
| B02-AdvertisementLabel | 0:00 corner "ADVERTISEMENT" tag on the fake commercial | overlay |
| B03-SameSameSame | 0:36 SAME PRODUCT. SAME PERSON. SAME GOAL. → "But these two ads don't feel the same." | full |
| B04-AdvertisingVsAdvice | "One feels like advertising. The other feels like advice." | full |
| B05-SplitLabels | Divider + ADVERTISEMENT / ADVICE labels to lay over your split screen | overlay |
| B06-TrustOnBlack | Cut to black → TRUST | full |
| B07-TitlePresenter | Title card with presenter credit | full |
| B08-NameLowerThird | Name lower third | overlay |
| B09-TermLowerThird | "Parasocial relationship" definition lower third for the on-camera explanation | overlay |
| B10-CalendarFill | Calendar that fills over three years, laid over the daily-life montage | overlay |
| B11-ExposureFamiliarityTrust | EXPOSURE → FAMILIARITY → TRUST | full |
| B12–B14-EvidenceCard1–3 | Source cards: Horton & Wohl 1956 / Sokolova & Kefi 2020 / Boerman et al. 2017. **Check each against the paper.** The key-finding row appears once you add `finding` in `src/Root.tsx`. | full |
| B15-AdBreakVsEmbedded | CONTENT → AD → CONTENT vs content with embedded sponsorship | full |
| B16-FollowersVsTrust | Follower count vs reach / credibility / trust | full |
| B17-DisclosureZoom | 7:15 freeze and zoom into the tiny "Paid partnership" label | full |
| B18-CheckoutFlow | 6:00 workout → trust → supplement → code → link → checkout | full |
| B19-BrandFlow | BRAND → MEDIA SPACE → AUDIENCE vs BRAND → CREATOR → TRUST → AUDIENCE | full |
| B20-ThreeYearsOneSecond | 3 YEARS OF TRUST vs 1 SECOND OF DISCLOSURE | full |
| B21-RentListing | "Creator audience for rent" marketplace listing | full |
| B22-DayMonthYear | DAY 1 → MONTH 6 → YEAR 3 timestamp over the younger-audience shot | overlay |
| B23-PersonProductMorph | I TRUST THIS PERSON morphs into PRODUCT, then breaks apart | full |
| B24-WatchTrustClickBuyFlash | Alternate Watch / Trust / Click / Buy with colour flips on each beat | full |
| B25-CommentsPop | Viewer comments popping in | overlay |
| B26-SearchTerms | 4:20 research setup: search terms | full |
| B27-FinalStackOverlay | PRODUCT / ATTENTION / ACCESS / CREDIBILITY / TRUST over the returning footage. Text only: add a dark gradient on the left in your edit so it reads over bright footage. | overlay |
| B28 + B29-PhonePortal | Phone portal transition: B28 is the bezel, B29 is a white screen matte with identical motion. Use B29 as a track/alpha matte for the incoming clip and put B28 on top. | overlay |
| C01–C12-Chapter | Chapter cards for each script section | full |

## Re-rendering / editing

```bash
npm install
npx remotion studio src/index.ts        # live preview + tweak
node render.mjs                          # render everything
node render.mjs 12 Q3                    # render clips whose id starts with these prefixes
```

Change the creator handle, colours or fonts in `src/lib.tsx` and `src/Root.tsx`.
