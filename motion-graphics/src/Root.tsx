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
  ['Q1-EveryMorning', 'I’ve been using this every morning and I *genuinely* love it.', 'maya.mornings', 'Morning routine'],
  ['Q2-ByTheWay', 'By the way, I’ve actually been using this serum for the past few weeks.', 'maya.mornings', 'Mid-video · 06:41'],
  ['Q3-KeepAsking', 'You guys keep *asking* me about this.', 'maya.mornings', 'Get ready with me'],
  ['Q4-Obsessed', 'I’ve *genuinely* been obsessed with this.', 'maya.mornings', 'Favourites of the month'],
  ['Q5-NeverRecommend', 'I would *never* recommend something I don’t actually use.', 'maya.mornings', 'Sponsored segment'],
  ['Q6-ChangedMySkin', 'This is honestly what *changed* *my* *skin.*', 'maya.mornings', 'Two years in'],
  ['Q7-YouThinking', 'Yeah, they’re getting paid… but they wouldn’t recommend something they didn’t *believe* *in.*', 'You', 'What you tell yourself', true],
];

export const Root: React.FC = () => (
  <>
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
