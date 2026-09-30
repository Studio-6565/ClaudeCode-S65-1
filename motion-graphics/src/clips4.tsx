// Pack 2 — built from the storyboard / production guide.
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Avatar, C, Check, F, Kicker, Overlay, Phone, Pill, Stage, Typed, Words, fmt, lerp, useS} from './lib';

const Star: React.FC<{size?: number}> = ({size = 30}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z" fill={C.red} />
  </svg>
);

// ─── Opening ──────────────────────────────────────────────────────────────

// YouTube-style watch page with a transparent player hole. Player hole (at 4K): x=160 y=160 w=2480 h=1395.
export const YouTubeWindow: React.FC = () => {
  const f = useCurrentFrame();
  const page = useS(0);
  const promo = lerp(f, 50, 62);
  const comments = [
    ['sarah_k', 'been watching since your first video, this is my go-to channel'],
    ['dev.m', 'ok what serum is this??'],
    ['lina', 'bought it because of you lol'],
    ['jules', 'you never recommend stuff you don’t use, that’s why I trust you'],
  ];
  const progress = lerp(f, 0, 240, 0.18, 0.46, (x) => x);
  return (
    <Overlay>
      <AbsoluteFill style={{opacity: page}}>
        <div style={{position: 'absolute', left: 80, top: 80, width: 1240, height: 697.5, borderRadius: 20, boxShadow: '0 0 0 3000px #0F0F0F'}} />
        <div style={{position: 'absolute', left: 80, top: 80, width: 1240, height: 697.5, borderRadius: 20, border: `1px solid #2a2a2a`}} />
        {/* player chrome */}
        <div style={{position: 'absolute', left: 104, top: 748, width: 1192, height: 5, background: 'rgba(255,255,255,0.25)', borderRadius: 3}}>
          <div style={{width: `${progress * 100}%`, height: '100%', background: '#FF0033', borderRadius: 3}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 104,
            top: 102,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.6)',
            fontSize: 18,
            fontWeight: 500,
            opacity: promo,
          }}
        >
          Includes paid promotion
        </div>
        {/* under the player */}
        <div style={{position: 'absolute', left: 80, top: 800, width: 1240}}>
          <div style={{fontSize: 34, fontWeight: 700}}>My honest morning routine (what I actually use)</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22}}>
            <Avatar size={62} />
            <div>
              <div style={{fontSize: 24, fontWeight: 600}}>maya.mornings</div>
              <div style={{fontSize: 19, color: '#aaa'}}>1.2M subscribers</div>
            </div>
            <div style={{marginLeft: 20, padding: '12px 26px', borderRadius: 999, background: C.ink, color: '#0F0F0F', fontWeight: 600, fontSize: 21}}>Subscribed</div>
            <div style={{marginLeft: 'auto', fontSize: 21, color: '#aaa'}}>842K views · 3 days ago</div>
          </div>
        </div>
        {/* comments column */}
        <div style={{position: 'absolute', left: 1370, top: 80, width: 470}}>
          <div style={{fontSize: 26, fontWeight: 700, marginBottom: 26}}>2,184 Comments</div>
          {comments.map(([u, t], i) => {
            const s = useS(30 + i * 22);
            return (
              <div key={u} style={{display: 'flex', gap: 16, marginBottom: 30, opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}>
                <Avatar size={46} warm={i % 2 === 1} />
                <div>
                  <div style={{fontSize: 18, fontWeight: 600, color: '#ddd'}}>@{u}</div>
                  <div style={{fontSize: 21, lineHeight: 1.35, marginTop: 4}}>{t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Overlay>
  );
};

// Small TV-style "ADVERTISEMENT" corner label for the fake commercial.
export const AdvertisementLabel: React.FC = () => {
  const s = useS(6);
  return (
    <Overlay>
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 72,
          fontFamily: F.mono,
          fontSize: 22,
          letterSpacing: '0.24em',
          padding: '10px 18px',
          border: '2px solid rgba(255,255,255,0.85)',
          color: 'rgba(255,255,255,0.9)',
          opacity: s,
        }}
      >
        ADVERTISEMENT
      </div>
    </Overlay>
  );
};

export const SameSameSame: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['SAME PRODUCT.', 'SAME PERSON.', 'SAME GOAL.'];
  const dim = lerp(f, 95, 115);
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        {lines.map((l, i) => {
          const s = useS(8 + i * 16, 16);
          return (
            <div key={l} style={{fontWeight: 700, fontSize: 150, letterSpacing: '-0.02em', lineHeight: 1, opacity: s * (1 - dim * 0.75), transform: `translateX(${(1 - s) * -80}px)`}}>
              {l}
            </div>
          );
        })}
        <div style={{height: 50}} />
        <Words text="But these two ads *don’t* *feel* *the* *same.*" size={100} delay={105} />
      </AbsoluteFill>
    </Stage>
  );
};

export const AdvertisingVsAdvice: React.FC = () => (
  <Stage>
    <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
      <Words text="One feels like / advertising." size={130} delay={6} color={C.mute} />
      <div style={{height: 50}} />
      <Words text="The other feels / like *advice.*" size={130} delay={50} />
    </AbsoluteFill>
  </Stage>
);

// Overlay for the side-by-side: divider + ADVERTISEMENT / ADVICE labels.
export const SplitLabels: React.FC = () => {
  const f = useCurrentFrame();
  const line = lerp(f, 0, 25);
  const top = useS(10);
  const l = useS(40, 16);
  const r = useS(60, 16);
  const label = (text: string, p: number, hot: boolean): React.CSSProperties => ({
    position: 'absolute',
    bottom: 90,
    fontWeight: 700,
    fontSize: 64,
    letterSpacing: '0.08em',
    padding: '14px 34px',
    borderRadius: 14,
    background: hot ? C.red : 'rgba(12,11,10,0.8)',
    color: hot ? C.bg : C.ink,
    opacity: p,
    transform: `translateY(${(1 - p) * 40}px)`,
  });
  return (
    <Overlay>
      <div style={{position: 'absolute', left: 958, top: 540 - 540 * line, width: 4, height: 1080 * line, background: C.ink}} />
      <div style={{position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', opacity: top}}>
        <span style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.2em', background: 'rgba(12,11,10,0.8)', padding: '12px 24px', borderRadius: 10}}>
          SAME PRODUCT · SAME PERSON · SAME GOAL
        </span>
      </div>
      <div style={{...label('', l, false), left: 480, translate: '-50% 0'}}>ADVERTISEMENT</div>
      <div style={{...label('', r, true), left: 1440, translate: '-50% 0'}}>ADVICE</div>
    </Overlay>
  );
};

// Cut to black → one word.
export const TrustOnBlack: React.FC = () => {
  const f = useCurrentFrame();
  const o = lerp(f, 18, 40);
  const sp = lerp(f, 18, 150, 0.1, 0.34, (x) => x);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <Overlay>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontWeight: 700, fontSize: 200, letterSpacing: `${sp}em`, marginRight: `-${sp}em`, opacity: o}}>TRUST</div>
        </AbsoluteFill>
      </Overlay>
    </AbsoluteFill>
  );
};

export const TitlePresenter: React.FC = () => {
  const f = useCurrentFrame();
  const by = useS(70);
  return (
    <Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <Words text="When advertising / feels like *friendship*" size={180} lineHeight={0.98} delay={6} stagger={4} align="center" />
        <div style={{margin: '56px auto 0', height: 3, width: 700 * lerp(f, 40, 90), background: C.red}} />
        <div style={{marginTop: 40, fontFamily: F.mono, fontSize: 26, letterSpacing: '0.2em', color: C.mute, opacity: by}}>A VIDEO ESSAY BY RATHAN VIJEARAJAH</div>
      </AbsoluteFill>
    </Stage>
  );
};

// ─── Lower thirds / overlays ─────────────────────────────────────────────

const LowerThird: React.FC<{title: string; sub: string; italic?: boolean}> = ({title, sub, italic}) => {
  const f = useCurrentFrame();
  const bar = lerp(f, 4, 22);
  const t = useS(12);
  const s2 = useS(20);
  return (
    <Overlay>
      <div style={{position: 'absolute', left: 110, bottom: 110, display: 'flex', gap: 26, alignItems: 'stretch'}}>
        <div style={{width: 8, background: C.red, transform: `scaleY(${bar})`, transformOrigin: 'bottom', borderRadius: 4}} />
        <div style={{background: 'rgba(12,11,10,0.82)', padding: '26px 40px 28px', borderRadius: 18, maxWidth: 1100, overflow: 'hidden'}}>
          <div style={{fontFamily: F.serif, fontSize: 66, lineHeight: 1.05, fontStyle: italic ? 'italic' : undefined, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>{title}</div>
          <div style={{fontSize: 28, color: '#CFC9BE', marginTop: 10, opacity: s2, transform: `translateY(${(1 - s2) * 20}px)`}}>{sub}</div>
        </div>
      </div>
    </Overlay>
  );
};

export const NameLowerThird: React.FC = () => <LowerThird title="Rathan Vijearajah" sub="Presenter · When Advertising Feels Like Friendship" />;
export const TermLowerThird: React.FC = () => (
  <LowerThird title="Parasocial relationship" italic sub="A one-sided relationship where you feel like you know someone — even though they don’t know you." />
);

// Calendar that fills day by day, as a side panel over the lifestyle montage.
export const CalendarFill: React.FC = () => {
  const f = useCurrentFrame();
  const panel = useS(0);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const total = lerp(f, 10, 230, 0, 1095, (x) => x * x);
  const monthIdx = Math.min(35, Math.floor(total / 30.42));
  const inMonth = total - monthIdx * 30.42;
  const year = 2023 + Math.floor(monthIdx / 12);
  return (
    <Overlay>
      <div style={{position: 'absolute', right: 110, top: 150, width: 560, padding: 40, borderRadius: 30, background: 'rgba(12,11,10,0.85)', border: `1px solid ${C.line}`, opacity: panel, transform: `translateX(${(1 - panel) * 80}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontFamily: F.serif, fontSize: 70}}>{months[monthIdx % 12]}</div>
          <div style={{fontFamily: F.mono, fontSize: 26, color: C.mute}}>{year}</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginTop: 24}}>
          {Array.from({length: 35}).map((_, i) => {
            const on = i < Math.min(31, Math.floor(inMonth)) || (monthIdx === 35 && total >= 1094);
            return <div key={i} style={{height: 56, borderRadius: 10, background: on ? C.red : C.card2, opacity: i < 31 ? 1 : 0.25}} />;
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.1em'}}>
          <span style={{color: C.mute}}>DAYS WATCHED</span>
          <span style={{color: C.red}}>{fmt(total)}</span>
        </div>
      </div>
    </Overlay>
  );
};

// DAY 1 → MONTH 6 → YEAR 3 timestamp overlay for the younger-audience sequence.
export const DayMonthYear: React.FC = () => {
  const f = useCurrentFrame();
  const stamps = ['DAY 1', 'WEEK 3', 'MONTH 6', 'YEAR 1', 'YEAR 2', 'YEAR 3'];
  const i = Math.min(stamps.length - 1, Math.floor(lerp(f, 10, 200, 0, stamps.length, (x) => x)));
  const local = (f - 10) - i * (190 / stamps.length);
  const pop = lerp(local, 0, 8);
  const vids = lerp(f, 10, 210, 1, 1095, (x) => x * x);
  return (
    <Overlay>
      <div style={{position: 'absolute', left: 110, top: 100}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.mono, fontSize: 22, letterSpacing: '0.18em', color: '#DDD'}}>
          <span style={{width: 14, height: 14, borderRadius: 7, background: C.red}} /> REC
        </div>
        <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 110, marginTop: 10, opacity: 0.4 + 0.6 * pop, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>{stamps[i]}</div>
        <div style={{width: 420, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 10}}>
          <div style={{width: `${((i + pop) / stamps.length) * 100}%`, height: '100%', background: C.red, borderRadius: 3}} />
        </div>
        <div style={{fontFamily: F.mono, fontSize: 24, color: '#DDD', marginTop: 22, letterSpacing: '0.1em', textShadow: '0 2px 20px rgba(0,0,0,0.8)'}}>VIDEOS WATCHED · {fmt(vids)}</div>
      </div>
    </Overlay>
  );
};

// Comments popping in on the right — for the YouTube UI beat or over any creator footage.
export const CommentsPop: React.FC = () => {
  const comments = [
    ['sarah_k', 'been watching since your first video'],
    ['dev.m', 'ok what serum is this??'],
    ['lina', 'bought it because of you lol'],
    ['marcus', 'if you recommend it I’m buying it'],
    ['jules', 'you never recommend stuff you don’t use'],
  ];
  return (
    <Overlay>
      <div style={{position: 'absolute', right: 100, bottom: 100, width: 620, display: 'flex', flexDirection: 'column', gap: 18}}>
        {comments.map(([u, t], i) => {
          const s = useS(8 + i * 24, 15);
          return (
            <div key={u} style={{display: 'flex', gap: 18, alignItems: 'center', padding: '18px 24px', borderRadius: 22, background: 'rgba(250,247,242,0.95)', color: '#161513', opacity: s, transform: `translateX(${(1 - s) * 120}px) scale(${0.9 + 0.1 * s})`}}>
              <Avatar size={52} warm={i % 2 === 0} />
              <div>
                <div style={{fontSize: 18, fontWeight: 700, color: '#6b665f'}}>@{u}</div>
                <div style={{fontSize: 25, fontWeight: 500, marginTop: 2}}>{t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Overlay>
  );
};

// Final stack as an overlay, for when the opening footage returns.
export const FinalStackOverlay: React.FC = () => {
  const items = [
    ['PRODUCT', 44],
    ['ATTENTION', 60],
    ['ACCESS', 78],
    ['CREDIBILITY', 96],
    ['TRUST', 170],
  ] as const;
  // No gradient backdrop: Chrome dithers gradients, which makes lossless alpha files ~500 MB. Darken in the edit instead.
  return (
    <Overlay>
      <div style={{position: 'absolute', left: 130, bottom: 110, textShadow: '0 6px 40px rgba(0,0,0,0.55)'}}>
        {items.map(([t, size], i) => {
          const s = useS(14 + i * 22, i === 4 ? 14 : 200);
          return (
            <div key={t} style={{fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: '0.02em', color: i === 4 ? C.red : i === 0 ? '#BDB7AC' : C.ink, opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
              {t}
            </div>
          );
        })}
      </div>
    </Overlay>
  );
};

// Phone portal: bezel (opaque) and a matching screen matte, animated identically, for a track-matte transition.
const usePortal = () => {
  const f = useCurrentFrame();
  const p = lerp(f, 20, 80, 0, 1, (t) => t * t * t);
  return 0.55 + p * 4.2;
};
export const PhonePortalBezel: React.FC = () => {
  const sc = usePortal();
  return (
    <Overlay>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 600, height: 1080, transform: `scale(${sc})`, borderRadius: 90, border: '22px solid #0A0A0A', outline: '3px solid #3a3835', boxShadow: '0 60px 160px rgba(0,0,0,0.6)', position: 'relative'}}>
          <div style={{position: 'absolute', top: 22, left: '50%', width: 150, height: 40, marginLeft: -75, borderRadius: 20, background: '#0A0A0A'}} />
        </div>
      </AbsoluteFill>
    </Overlay>
  );
};
export const PhonePortalMatte: React.FC = () => {
  const sc = usePortal();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 600, height: 1080, transform: `scale(${sc})`, borderRadius: 90, background: '#FFFFFF', boxSizing: 'border-box'}} />
    </AbsoluteFill>
  );
};

// ─── Concept graphics ─────────────────────────────────────────────────────

export const EvidenceCard: React.FC<{n: number; role: string; authors: string; year: string; title: string; venue: string; finding?: string}> = ({
  n,
  role,
  authors,
  year,
  title,
  venue,
  finding,
}) => {
  const f = useCurrentFrame();
  const card = useS(4);
  const hl = lerp(f, 90, 120);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 100}}>
        <Kicker>Source {n} · {role}</Kicker>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: finding ? 190 : 260,
          bottom: finding ? 130 : undefined,
          borderRadius: 36,
          background: C.card,
          border: `1px solid ${C.line}`,
          padding: '70px 80px',
          opacity: card,
          transform: `translateY(${(1 - card) * 50}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 30, color: C.red, letterSpacing: '0.08em'}}>
          {authors.toUpperCase()} ({year})
        </div>
        <Words text={title} size={finding ? 64 : 80} delay={16} stagger={1.2} lineHeight={1.12} style={{marginTop: 30, maxWidth: 1500}} />
        <div style={{fontSize: 30, color: C.mute, marginTop: 30, fontStyle: 'italic', opacity: lerp(f, 40, 60)}}>{venue}</div>
        {finding && (
          <div style={{marginTop: 'auto', borderTop: `1px solid ${C.line}`, paddingTop: 40, opacity: lerp(f, 70, 90)}}>
            <div style={{fontFamily: F.mono, fontSize: 22, color: C.mute, letterSpacing: '0.16em'}}>KEY FINDING</div>
            <div style={{fontSize: 44, fontWeight: 500, marginTop: 16, lineHeight: 1.3, position: 'relative'}}>
              <span style={{background: `linear-gradient(${C.redDeep}, ${C.redDeep}) no-repeat 0 85% / ${hl * 100}% 40%`}}>{finding}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// Commercial break (content → AD → content) vs sponsorship blended into content.
export const AdBreakVsEmbedded: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1500;
  const a = lerp(f, 10, 90, 0, 1, (x) => x);
  const b = lerp(f, 100, 180, 0, 1, (x) => x);
  const skip = f > 40 && f < 70;
  const reveal = lerp(f, 190, 215);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 210, top: 170}}>
        <div style={{fontFamily: F.serif, fontSize: 70, color: C.mute}}>Traditional ad</div>
        <div style={{display: 'flex', gap: 10, marginTop: 30, width: W, position: 'relative'}}>
          <div style={{flex: 4, height: 90, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: F.mono, fontSize: 24, color: C.mute}}>CONTENT</div>
          <div style={{flex: 2, height: 90, borderRadius: 16, background: C.ink, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 34, letterSpacing: '0.08em', position: 'relative'}}>
            AD
            {skip && <div style={{position: 'absolute', right: 12, bottom: -54, fontSize: 20, fontWeight: 600, color: C.ink, border: `1px solid ${C.mute}`, padding: '6px 14px', borderRadius: 6}}>Skip ad ›</div>}
          </div>
          <div style={{flex: 4, height: 90, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: F.mono, fontSize: 24, color: C.mute}}>CONTENT</div>
          <div style={{position: 'absolute', left: W * a - 3, top: -14, width: 6, height: 118, background: C.red, borderRadius: 3}} />
        </div>
        <div style={{fontSize: 30, color: C.mute, marginTop: 70}}>It interrupts. You notice.</div>
      </div>
      <div style={{position: 'absolute', left: 210, top: 590}}>
        <div style={{fontFamily: F.serif, fontSize: 70, fontStyle: 'italic', color: C.red}}>Influencer ad</div>
        <div style={{marginTop: 30, width: W, height: 90, borderRadius: 16, position: 'relative', overflow: 'hidden', background: `linear-gradient(90deg, ${C.card2} 0%, ${C.card2} 45%, rgba(${Math.round(30 + 225 * reveal)},${Math.round(28 + 31 * reveal)},${Math.round(26 + 21 * reveal)},1) 52%, ${C.card2} 60%, ${C.card2} 100%)`}}>
          <div style={{position: 'absolute', left: 30, top: 30, fontFamily: F.mono, fontSize: 24, color: C.mute}}>CONTENT WITH EMBEDDED SPONSORSHIP</div>
          <div style={{position: 'absolute', left: W * b - 3, top: 0, width: 6, height: 90, background: C.red}} />
        </div>
        <div style={{fontSize: 30, color: C.mute, marginTop: 40, opacity: reveal}}>
          It doesn’t interrupt. <span style={{color: C.ink}}>It blends in.</span>
        </div>
      </div>
    </Stage>
  );
};

export const FollowersVsTrust: React.FC = () => {
  const f = useCurrentFrame();
  const n = lerp(f, 10, 120, 0, 1_240_000, (x) => 1 - Math.pow(1 - x, 3));
  const bars = [
    ['Reach', lerp(f, 20, 110, 0, 0.92)],
    ['Credibility', lerp(f, 60, 170, 0, 0.78)],
    ['Trust', lerp(f, 100, 220, 0, 0.88)],
  ] as const;
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 180}}>
        <Kicker>What brands are really buying</Kicker>
        <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 150, marginTop: 30, letterSpacing: '-0.03em'}}>{fmt(n)}</div>
        <div style={{fontSize: 40, color: C.mute, marginTop: -6}}>followers</div>
      </div>
      <div style={{position: 'absolute', left: 1180, top: 250, width: 560}}>
        {bars.map(([l, v], i) => (
          <div key={l} style={{marginBottom: 60}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 600, color: i === 2 ? C.red : C.ink}}>
              <span>{l}</span>
              <span style={{fontFamily: F.mono, fontWeight: 400}}>{Math.round(v * 100)}</span>
            </div>
            <div style={{height: 22, background: C.card, borderRadius: 11, marginTop: 16, border: `1px solid ${C.line}`}}>
              <div style={{height: '100%', width: `${v * 100}%`, background: i === 2 ? C.red : C.mute, borderRadius: 11}} />
            </div>
          </div>
        ))}
      </div>
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 180px 130px'}}>
        <Words text="The follower count is the number. / *Trust* is the asset." size={84} delay={200} />
      </AbsoluteFill>
    </Stage>
  );
};

// Freeze + zoom into the tiny "Paid partnership" label.
export const DisclosureZoom: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 60, 110, 0, 1);
  const sc = 1 + z * 3.2;
  const ring = lerp(f, 110, 135);
  const paused = f >= 50;
  const cap = useS(140);
  const ox = 906;
  const oy = 200;
  return (
    <Stage>
      <AbsoluteFill style={{transform: `translate(${(960 - ox) * z}px, ${(470 - oy) * z}px) scale(${sc})`, transformOrigin: `${ox}px ${oy}px`}}>
        <div style={{position: 'absolute', left: 730, top: 70}}>
          <Phone label={<span style={{fontSize: 15}}>Paid partnership</span>} caption={<><b>maya.mornings</b> honestly the only serum I reach for now</>} />
        </div>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <ellipse cx={909} cy={205} rx={78} ry={15} fill="none" stroke={C.red} strokeWidth={2.2} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - ring} transform="rotate(-2 909 205)" />
        </svg>
      </AbsoluteFill>
      {paused && (
        <div style={{position: 'absolute', left: 90, top: 80, display: 'flex', gap: 10, opacity: lerp(f, 50, 58)}}>
          <div style={{width: 18, height: 60, background: C.ink, borderRadius: 4}} />
          <div style={{width: 18, height: 60, background: C.ink, borderRadius: 4}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, textAlign: 'center', opacity: cap, transform: `translateY(${(1 - cap) * 30}px)`}}>
        <span style={{fontFamily: F.serif, fontSize: 90, background: 'rgba(12,11,10,0.85)', padding: '6px 34px', borderRadius: 18}}>
          Easy to <span style={{fontStyle: 'italic', color: C.red}}>miss.</span>
        </span>
      </div>
    </Stage>
  );
};

// Workout → trust → supplement → code → link → checkout.
export const CheckoutFlow: React.FC = () => {
  const f = useCurrentFrame();
  const steps = ['Workout', 'Trust', 'Supplement', 'Code', 'Link', 'Checkout'];
  const active = Math.min(5, Math.floor(lerp(f, 10, 190, 0, 6, (x) => x)));
  const card = useS(20);
  const codeOn = f >= 80;
  const applied = lerp(f, 118, 130);
  const total = 54.99 - 11 * applied;
  const press = f >= 160 && f < 168 ? 0.94 : 1;
  const done = useS(172, 14);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center'}}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span style={{color: i <= active ? C.red : C.dim, fontSize: 30}}>→</span>}
            <span style={{fontSize: 30, fontWeight: 600, color: i === active ? C.red : i < active ? C.ink : C.dim}}>{s}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{position: 'absolute', left: 660, top: 200, width: 600, borderRadius: 40, background: C.card, border: `1px solid ${C.line}`, padding: 44, opacity: card, transform: `translateY(${(1 - card) * 60}px)`}}>
        <div style={{display: 'flex', gap: 26, alignItems: 'center'}}>
          <div style={{width: 120, height: 140, borderRadius: 20, background: 'linear-gradient(160deg,#3b3834,#1d1b19)', position: 'relative'}}>
            <div style={{position: 'absolute', left: 25, top: 30, width: 70, height: 90, borderRadius: 12, background: C.ink}} />
            <div style={{position: 'absolute', left: 32, top: 18, width: 56, height: 20, borderRadius: 6, background: C.red}} />
          </div>
          <div>
            <div style={{fontSize: 36, fontWeight: 700}}>Whey Protein</div>
            <div style={{fontSize: 26, color: C.mute, marginTop: 6}}>Chocolate · 2 lb</div>
          </div>
        </div>
        <div style={{marginTop: 40, fontFamily: F.mono, fontSize: 20, color: C.mute, letterSpacing: '0.14em'}}>DISCOUNT CODE</div>
        <div style={{marginTop: 12, height: 80, borderRadius: 16, border: `2px solid ${applied > 0 ? C.red : C.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 36}}>
          {codeOn ? <Typed text="JAKE20" start={80} cps={0.3} caret={applied === 0} /> : <span style={{color: C.dim}}>Enter code</span>}
          {applied > 0 && <span style={{fontSize: 22, color: C.red, opacity: applied}}>−20% APPLIED</span>}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34, fontSize: 34}}>
          <span style={{color: C.mute}}>Total</span>
          <span style={{fontFamily: F.mono, fontWeight: 500}}>${total.toFixed(2)}</span>
        </div>
        <div style={{marginTop: 34, height: 96, borderRadius: 48, background: done > 0.01 ? C.ink : C.red, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 36, fontWeight: 700, transform: `scale(${press})`}}>
          {done > 0.01 ? (
            <>
              <Check p={done} size={44} /> Order confirmed
            </>
          ) : (
            'Pay now'
          )}
        </div>
      </div>
    </Stage>
  );
};

// Traditional: BRAND → MEDIA SPACE → AUDIENCE. Influencer: BRAND → CREATOR → TRUST → AUDIENCE.
export const BrandFlow: React.FC = () => {
  const f = useCurrentFrame();
  const Row: React.FC<{nodes: string[]; y: number; delay: number; hot?: boolean; title: string}> = ({nodes, y, delay, hot, title}) => (
    <div style={{position: 'absolute', left: 150, right: 150, top: y}}>
      <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.16em', color: hot ? C.red : C.mute, opacity: lerp(f, delay, delay + 12)}}>{title}</div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 30}}>
        {nodes.map((n, i) => {
          const d = delay + i * 18;
          const s = lerp(f, d, d + 14);
          const isTrust = n === 'TRUST';
          return (
            <React.Fragment key={n + i}>
              {i > 0 && (
                <div style={{flex: 1, height: 4, margin: '0 18px', background: C.line, position: 'relative'}}>
                  <div style={{position: 'absolute', inset: 0, background: hot ? C.red : C.mute, transform: `scaleX(${s})`, transformOrigin: 'left'}} />
                </div>
              )}
              <div
                style={{
                  padding: '28px 40px',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: 40,
                  letterSpacing: '0.06em',
                  background: isTrust ? C.red : C.card2,
                  color: isTrust ? C.bg : C.ink,
                  border: `1px solid ${isTrust ? C.red : C.line}`,
                  opacity: s,
                  transform: `scale(${0.85 + 0.15 * s})`,
                }}
              >
                {n}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
  return (
    <Stage>
      <Row title="TRADITIONAL" nodes={['BRAND', 'MEDIA SPACE', 'AUDIENCE']} y={230} delay={8} />
      <Row title="INFLUENCER" nodes={['BRAND', 'CREATOR', 'TRUST', 'AUDIENCE']} y={600} delay={80} hot />
    </Stage>
  );
};

export const ThreeYearsOneSecond: React.FC = () => {
  const f = useCurrentFrame();
  const a = useS(6);
  const b = useS(60);
  const bar = lerp(f, 20, 70);
  const arrow = useS(110);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 170, opacity: a}}>
        <div style={{fontFamily: F.serif, fontSize: 200, lineHeight: 1}}>3 years</div>
        <div style={{fontFamily: F.mono, fontSize: 26, color: C.mute, letterSpacing: '0.14em', marginTop: 10}}>OF TRUST</div>
      </div>
      <div style={{position: 'absolute', left: 180, top: 470, width: 1560, height: 60, borderRadius: 12, background: C.red, transform: `scaleX(${bar})`, transformOrigin: 'left'}} />
      <div style={{position: 'absolute', left: 180, top: 620, opacity: b}}>
        <div style={{fontFamily: F.serif, fontSize: 200, lineHeight: 1, fontStyle: 'italic', color: C.mute}}>1 second</div>
        <div style={{fontFamily: F.mono, fontSize: 26, color: C.mute, letterSpacing: '0.14em', marginTop: 10}}>OF DISCLOSURE</div>
      </div>
      <div style={{position: 'absolute', left: 180, top: 560, width: 3, height: 44, background: C.ink, opacity: b}} />
      <div style={{position: 'absolute', left: 200, top: 556, fontFamily: F.mono, fontSize: 22, color: C.ink, opacity: arrow, transform: `translateX(${(1 - arrow) * 30}px)`}}>
        ← to scale
      </div>
    </Stage>
  );
};

// Tongue-in-cheek marketplace listing: "Creator audience for rent".
export const RentListing: React.FC = () => {
  const f = useCurrentFrame();
  const card = useS(4);
  const stamp = useS(120, 10, 0.6);
  const pts = Array.from({length: 90}).map((_, i) => [random(`a${i}`), random(`b${i}`)]);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 260, top: 110, width: 1400, height: 860, borderRadius: 36, background: C.ink, color: '#161513', overflow: 'hidden', display: 'flex', opacity: card, transform: `translateY(${(1 - card) * 60}px)`}}>
        <div style={{width: 640, background: 'linear-gradient(160deg, #F2C9A8, #A9472F)', position: 'relative'}}>
          <svg width={640} height={860} style={{position: 'absolute'}}>
            {pts.map(([x, y], i) => (
              <circle key={i} cx={40 + x * 560} cy={120 + y * 640} r={9} fill="#FFF4EA" opacity={lerp(f, 10 + i * 0.5, 20 + i * 0.5) * 0.85} />
            ))}
          </svg>
          <div style={{position: 'absolute', left: 30, top: 30, padding: '10px 20px', borderRadius: 999, background: C.ink, fontWeight: 700, fontSize: 22}}>Superhost creator</div>
        </div>
        <div style={{flex: 1, padding: '60px 60px'}}>
          <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.14em', color: '#8B867D'}}>LISTING · AUDIENCE FOR RENT</div>
          <div style={{fontFamily: F.serif, fontSize: 76, lineHeight: 1.02, marginTop: 20}}>Cozy, loyal audience of 480K</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, fontSize: 28, fontWeight: 600}}>
            <Star /> 4.97 · 2,184 reviews
          </div>
          <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 30}}>
            {['3 years of built-in trust', 'Watches every single day', 'Replies to comments', 'Ages 16–24'].map((t, i) => {
              const s = lerp(f, 30 + i * 12, 44 + i * 12);
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: s}}>
                  <Check p={s} size={36} /> {t}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', bottom: 170, display: 'flex', alignItems: 'center', gap: 40}}>
            <div>
              <span style={{fontFamily: F.mono, fontWeight: 500, fontSize: 56}}>$4,500</span>
              <span style={{fontSize: 26, color: '#8B867D'}}> / sponsored post</span>
            </div>
            <div style={{padding: '22px 44px', borderRadius: 999, background: C.red, color: C.ink, fontWeight: 700, fontSize: 30}}>Book now</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 180, top: 80, opacity: f >= 120 ? 1 : 0, transform: `scale(${2 - stamp}) rotate(8deg)`, border: `8px solid ${C.red}`, color: C.red, background: 'rgba(12,11,10,0.9)', fontWeight: 700, fontSize: 64, letterSpacing: '0.08em', padding: '8px 36px', borderRadius: 18}}>
        AVAILABLE NOW
      </div>
    </Stage>
  );
};

// "I TRUST THIS PERSON" → letters scramble into "PRODUCT" → the sentence breaks apart.
export const PersonProductMorph: React.FC = () => {
  const f = useCurrentFrame();
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const from = 'PERSON ';
  const to = 'PRODUCT';
  const morph = lerp(f, 50, 95, 0, 1, (x) => x);
  const brk = lerp(f, 140, 190, 0, 1, (x) => x * x);
  const cap = useS(185);
  const prefix = 'I TRUST THIS ';
  const word = to.split('').map((ch, i) => {
    const t = morph * to.length - i;
    if (t >= 1) return {ch, done: true};
    if (t > 0) return {ch: glyphs[Math.floor(random(`g${i}-${f}`) * 26)], done: false};
    return {ch: from[i], done: false};
  });
  const letters = [...prefix.split('').map((ch) => ({ch, done: false, hot: false})), ...word.map((w) => ({...w, hot: w.done}))];
  const a = useS(4);
  return (
    <Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', fontWeight: 700, fontSize: 150, letterSpacing: '-0.01em', opacity: a, fontFamily: F.sans}}>
          {letters.map((l, i) => {
            const dx = (random(`x${i}`) - 0.5) * 900 * brk;
            const dy = (random(`y${i}`) * 700 + 100) * brk;
            const rot = (random(`r${i}`) - 0.5) * 140 * brk;
            return (
              <span key={i} style={{display: 'inline-block', minWidth: l.ch === ' ' ? 40 : undefined, color: l.hot ? C.red : C.ink, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 1 - brk * 0.9}}>
                {l.ch}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: cap}}>
        <div style={{fontFamily: F.serif, fontSize: 110, transform: `translateY(${(1 - cap) * 30}px)`}}>
          Not the <span style={{fontStyle: 'italic', color: C.red}}>same</span> thing.
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// Alternate Watch/Trust/Click/Buy: full-frame colour flips on each beat.
export const WatchTrustClickBuyFlash: React.FC = () => {
  const f = useCurrentFrame();
  const beat = 18;
  const words = ['WATCH', 'TRUST', 'CLICK', 'BUY'];
  const bgs = [C.bg, C.ink, C.bg, C.red];
  const fgs = [C.ink, C.bg, C.ink, C.bg];
  const i = Math.min(3, Math.floor(f / beat));
  const local = f - i * beat;
  const sc = lerp(local, 0, 5, 1.18, 1);
  return (
    <AbsoluteFill style={{background: bgs[i], alignItems: 'center', justifyContent: 'center'}}>
      <Overlay>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontWeight: 700, fontSize: 330, letterSpacing: '-0.03em', color: fgs[i], transform: `scale(${sc})`}}>{words[i]}.</div>
        </AbsoluteFill>
      </Overlay>
    </AbsoluteFill>
  );
};

// Research setup: typing search terms.
export const SearchTerms: React.FC = () => {
  const f = useCurrentFrame();
  const terms = ['parasocial relationships', 'influencer credibility', 'sponsored content disclosure', 'purchase intention'];
  const per = 50;
  const i = Math.min(terms.length - 1, Math.floor(Math.max(0, f - 20) / per));
  const start = 20 + i * per;
  const bar = useS(4);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 260, top: 200}}>
        <Kicker>The research · search terms</Kicker>
      </div>
      <div style={{position: 'absolute', left: 260, right: 260, top: 290, height: 130, borderRadius: 65, background: C.card, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 50px', gap: 30, opacity: bar, transform: `scale(${0.95 + 0.05 * bar})`}}>
        <svg width="48" height="48" viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="7" fill="none" stroke={C.mute} strokeWidth="2.4" />
          <path d="M15.5 15.5 L21 21" stroke={C.mute} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div style={{fontSize: 52}}>
          <Typed text={terms[i]} start={start} cps={1.2} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 260, right: 260, top: 480, display: 'flex', flexWrap: 'wrap', gap: 20}}>
        {terms.map((t, k) => {
          const s = useS(20 + k * per + 30, 14);
          return (
            <div key={t} style={{opacity: s, transform: `scale(${0.8 + 0.2 * s})`}}>
              <Pill bg={k === i ? C.red : C.card2} color={k === i ? C.bg : C.ink} style={{fontSize: 34}}>
                {t}
              </Pill>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// Chapter card.
export const Chapter: React.FC<{n: number; total: number; title: string}> = ({n, total, title}) => {
  const f = useCurrentFrame();
  const num = useS(4);
  const bar = lerp(f, 10, 50);
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <div style={{fontFamily: F.mono, fontSize: 30, color: C.red, letterSpacing: '0.16em', opacity: num}}>
          CHAPTER {String(n).padStart(2, '0')}
        </div>
        <div style={{height: 30}} />
        <Words text={title} size={150} delay={10} lineHeight={1} style={{maxWidth: 1560}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 180, right: 180, bottom: 130, display: 'flex', gap: 8}}>
        {Array.from({length: total}).map((_, i) => (
          <div key={i} style={{flex: 1, height: 6, borderRadius: 3, background: i < n - 1 ? C.mute : i === n - 1 ? C.red : C.line, transform: `scaleX(${i === n - 1 ? bar : 1})`, transformOrigin: 'left'}} />
        ))}
      </div>
    </Stage>
  );
};
