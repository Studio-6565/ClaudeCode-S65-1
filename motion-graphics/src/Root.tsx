import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import React from 'react';
import {Composition} from 'remotion';
import * as A from './clips1';
import * as B from './clips2';
import * as D from './clips3';
import * as E from './clips4';

// [id, component, seconds]. Designed at 1920x1080; rendered at scale 2 => 3840x2160.
const clips: [string, React.FC<any>, number][] = [
  ['01-Title', A.Title, 6],
  ['02-StrangerVsFamiliar', A.StrangerVsFamiliar, 7],
  ['03-NotAnAd', A.NotAnAd, 7],
  ['04-NotViewsTrust', A.NotViewsTrust, 6.5],
  ['05-ParasocialDefinition', A.Definition, 8],
  ['06-OneWayRelationship', A.OneWay, 9.5],
  ['07-DailyFeed', A.DailyFeed, 8],
  ['08-StrangerToTrust', A.StrangerToTrust, 7],
  ['09-AdComparison', A.Comparison, 8],
  ['10-AdInsideContent', A.AdInsideContent, 11.5],
  ['11-BuiltOverYears', B.BuiltOverYears, 8.5],
  ['12-BorrowedTrust', B.BorrowedTrust, 9],
  ['13-AdLanguage', B.AdLanguage, 8],
  ['14-ResearchQuestions', B.ResearchQuestions, 8],
  ['15-ResearchFocus', B.ResearchFocus, 7],
  ['16-Traits', B.Traits, 6],
  ['17-BeautyTimeline', B.BeautyTimeline, 11],
  ['18-TrustTransfer', B.TrustTransfer, 8.5],
  ['19-Friction', B.Friction, 7.5],
  ['20-WatchTrustClickBuy', B.WatchTrustClickBuy, 6],
  ['21-ReachVsAccess', B.ReachVsAccess, 8],
  ['22-YearsVsAlready', B.YearsVsAlready, 8],
  ['23-TrustSwap', D.TrustSwap, 6],
  ['24-DisclosureLabels', D.DisclosureLabels, 8.5],
  ['25-DisclosureVsTrust', D.DisclosureVsTrust, 8.5],
  ['26-Benefits', D.Benefits, 8],
  ['27-TooSimple', D.TooSimple, 5.5],
  ['28-ForRent', D.ForRent, 8],
  ['29-GrewUp', D.GrewUp, 8.5],
  ['30-PersonVsProduct', D.PersonVsProduct, 8.5],
  ['31-WhatsBeingSold', D.WhatsBeingSold, 7],
  ['32-Ending', D.Ending, 10],
];

const quotes: [string, string, string, string, boolean?][] = [
  ['Q1-EveryMorning', 'I’ve been using this every morning for the last few weeks, and I *genuinely* love it.', 'maya.mornings', 'Morning routine'],
  ['Q2-ByTheWay', 'By the way, I’ve actually been using this serum for the past few weeks.', 'maya.mornings', 'Mid-video · 06:41'],
  ['Q3-KeepAsking', 'You guys keep *asking* me about this.', 'maya.mornings', 'Get ready with me'],
  ['Q4-Obsessed', 'I’ve *genuinely* been obsessed with this.', 'maya.mornings', 'Favourites of the month'],
  ['Q5-NeverRecommend', 'I would *never* recommend something I don’t actually use.', 'maya.mornings', 'Sponsored segment'],
  ['Q6-ChangedMySkin', 'This is honestly what *changed* *my* *skin.*', 'maya.mornings', 'Two years in'],
  ['Q7-YouThinking', 'Yeah, they’re getting paid… but they wouldn’t recommend something they didn’t *believe* *in.*', 'You', 'What you tell yourself', true],
];

// Pack 2 — from the storyboard. Ids ending in -ALPHA render as ProRes 4444 with transparency.
const pack2: [string, React.FC<any>, number, any?][] = [
  ['B01-YouTubeWindow-ALPHA', E.YouTubeWindow, 8],
  ['B02-AdvertisementLabel-ALPHA', E.AdvertisementLabel, 7],
  ['B03-SameSameSame', E.SameSameSame, 7],
  ['B04-AdvertisingVsAdvice', E.AdvertisingVsAdvice, 5],
  ['B05-SplitLabels-ALPHA', E.SplitLabels, 7],
  ['B06-TrustOnBlack', E.TrustOnBlack, 5],
  ['B07-TitlePresenter', E.TitlePresenter, 6],
  ['B08-NameLowerThird-ALPHA', E.NameLowerThird, 5],
  ['B09-TermLowerThird-ALPHA', E.TermLowerThird, 7],
  ['B10-CalendarFill-ALPHA', E.CalendarFill, 9],
  ['B11-ExposureFamiliarityTrust', A.StrangerToTrust, 7, {labels: [['Exposure', 'Day 1'], ['Familiarity', 'Month 6'], ['Trust', 'Year 3']]}],
  ['B12-EvidenceCard1', E.EvidenceCard, 7, {n: 1, role: 'Parasocial trust', authors: 'Horton & Wohl', year: '1956', title: 'Mass communication and para-social interaction: Observations on intimacy at a distance', venue: 'Psychiatry'}],
  ['B13-EvidenceCard2', E.EvidenceCard, 7, {n: 2, role: 'Trust → buying', authors: 'Sokolova & Kefi', year: '2020', title: 'Instagram and YouTube bloggers promote it, why should I buy? How credibility and parasocial interaction influence purchase intentions', venue: 'Journal of Retailing and Consumer Services'}],
  ['B14-EvidenceCard3', E.EvidenceCard, 7, {n: 3, role: 'Disclosure', authors: 'Boerman, Willemsen & Van Der Aa', year: '2017', title: '“This post is sponsored”: Effects of sponsorship disclosure on persuasion knowledge and electronic word of mouth in the context of Facebook', venue: 'Journal of Interactive Marketing'}],
  ['B15-AdBreakVsEmbedded', E.AdBreakVsEmbedded, 8],
  ['B16-FollowersVsTrust', E.FollowersVsTrust, 9.5],
  ['B17-DisclosureZoom', E.DisclosureZoom, 7],
  ['B18-CheckoutFlow', E.CheckoutFlow, 7.5],
  ['B19-BrandFlow', E.BrandFlow, 6.5],
  ['B20-ThreeYearsOneSecond', E.ThreeYearsOneSecond, 6],
  ['B21-RentListing', E.RentListing, 7],
  ['B22-DayMonthYear-ALPHA', E.DayMonthYear, 8],
  ['B23-PersonProductMorph', E.PersonProductMorph, 8.5],
  ['B24-WatchTrustClickBuyFlash', E.WatchTrustClickBuyFlash, 3],
  ['B25-CommentsPop-ALPHA', E.CommentsPop, 6],
  ['B26-SearchTerms', E.SearchTerms, 8],
  ['B27-FinalStackOverlay-ALPHA', E.FinalStackOverlay, 7],
  ['B28-PhonePortalBezel-ALPHA', E.PhonePortalBezel, 3.5],
  ['B29-PhonePortalMatte-ALPHA', E.PhonePortalMatte, 3.5],
];

const chapters = [
  'Opening — the same product, two different ads',
  'Why this works',
  'Traditional ads vs. influencer ads',
  'Where it starts to get uncomfortable',
  'What the research is trying to answer',
  'Beauty influencers',
  'Fitness influencers',
  'What brands are really buying',
  'But what about #ad?',
  'The counterargument',
  'Why younger audiences matter',
  'What is really being sold?',
];

export const Root: React.FC = () => (
  <>
    {pack2.map(([id, Comp, sec, props]) => (
      <Composition key={id} id={id} component={Comp} durationInFrames={Math.round(sec * 30)} fps={30} width={1920} height={1080} defaultProps={props ?? {}} />
    ))}
    {chapters.map((title, i) => (
      <Composition
        key={title}
        id={`C${String(i + 1).padStart(2, '0')}-Chapter`}
        component={E.Chapter}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{n: i + 1, total: chapters.length, title}}
      />
    ))}
    {clips.map(([id, Comp, sec]) => (
      <Composition key={id} id={id} component={Comp} durationInFrames={Math.round(sec * 30)} fps={30} width={1920} height={1080} />
    ))}
    {quotes.map(([id, quote, who, context, thought]) => (
      <Composition
        key={id}
        id={id}
        component={D.Quote}
        durationInFrames={Math.round(30 * (3.5 + quote.split(' ').length * 0.18))}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{quote, who, context, thought: !!thought}}
      />
    ))}
  </>
);
