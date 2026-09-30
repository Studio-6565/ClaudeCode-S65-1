# Motion graphics — "When Advertising Feels Like Friendship"

39 clips, 3840×2160, 30 fps, H.264. Built with Remotion. Rendered clips are in `out/`, and poster frames are in `out/posters/`.

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

## Re-rendering / editing

```bash
npm install
npx remotion studio src/index.ts        # live preview + tweak
node render.mjs                          # render everything
node render.mjs 12 Q3                    # render clips whose id starts with these prefixes
```

Change the creator handle, colours or fonts in `src/lib.tsx` and `src/Root.tsx`.
