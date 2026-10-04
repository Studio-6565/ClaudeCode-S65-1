import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Avatar, C, F, Kicker, Phone, Stage, Strike, Words, fmt, lerp, useS} from './lib';

// 01 — Title card
export const Title: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <AbsoluteFill style={{padding: 160, justifyContent: 'center'}}>
        <Kicker delay={4}>A video essay</Kicker>
        <div style={{height: 48}} />
        <Words text="When advertising / feels like *friendship*" size={190} lineHeight={0.98} delay={12} stagger={4} />
        <div style={{marginTop: 64, height: 4, width: 1100 * lerp(f, 40, 90), background: C.red}} />
      </AbsoluteFill>
    </Stage>
  );
};

// 02 — Stranger in a commercial vs. someone you've watched for 3 years
export const StrangerVsFamiliar: React.FC = () => {
  const f = useCurrentFrame();
  const l = useS(8);
  const r = useS(55);
  const divider = lerp(f, 0, 40);
  const days = lerp(f, 60, 130, 0, 1095);
  const Side: React.FC<{p: number; warm: boolean; kicker: string; title: string; result: string; delay: number; hot?: boolean}> = ({
    p,
    warm,
    kicker,
    title,
    result,
    delay,
    hot,
  }) => (
    <div style={{flex: 1, padding: '0 110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      <Avatar size={200} warm={warm} />
      <div style={{height: 44}} />
      <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.16em', color: hot ? C.red : C.mute, textTransform: 'uppercase'}}>{kicker}</div>
      <div style={{fontFamily: F.serif, fontSize: 76, lineHeight: 1.05, marginTop: 16}}>{title}</div>
      <div style={{height: 40}} />
      <Words text={result} delay={delay} size={40} font={F.sans} weight={500} color={hot ? C.ink : C.mute} stagger={2} />
    </div>
  );
  return (
    <Stage>
      <AbsoluteFill style={{flexDirection: 'row'}}>
        <Side p={l} warm={false} kicker="A stranger · 30 sec spot" title="Random person in a commercial" result="→ They're selling you something." delay={30} />
        <div style={{width: 2, background: C.line, alignSelf: 'center', height: 760 * divider}} />
        <Side
          p={r}
          warm
          hot
          kicker={`Watched for ${fmt(days)} days`}
          title="Someone you've watched for three years"
          result="→ It feels like a *recommendation.*"
          delay={85}
        />
      </AbsoluteFill>
    </Stage>
  );
};

// 03 — "It doesn't feel like an ad anymore"
export const NotAnAd: React.FC = () => {
  const f = useCurrentFrame();
  const pop = useS(4, 12);
  const strike = lerp(f, 40, 62);
  const away = lerp(f, 72, 95);
  return (
    <Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            transform: `scale(${pop * (1 - away * 0.4)}) translateY(${-away * 160}px)`,
            opacity: 1 - away,
            fontFamily: F.sans,
            fontWeight: 700,
            fontSize: 260,
            letterSpacing: '0.04em',
            padding: '10px 70px',
            border: `8px solid ${C.ink}`,
            borderRadius: 40,
          }}
        >
          <Strike progress={strike} thickness={0.09}>
            AD
          </Strike>
        </div>
        <div style={{position: 'absolute', textAlign: 'center'}}>
          <Words text="It doesn't feel like an ad anymore." delay={84} size={64} font={F.sans} weight={500} color={C.mute} align="center" stagger={2} />
          <div style={{height: 30}} />
          <Words text="It feels more like a *recommendation* / from someone you know." delay={104} size={112} align="center" stagger={3} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// 04 — Brands aren't paying for views. They're paying for trust.
export const NotViewsTrust: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['views.', 'reach.', 'followers.'];
  const final = useS(112, 14);
  return (
    <Stage>
      <AbsoluteFill style={{padding: 160, justifyContent: 'center'}}>
        <Words text="Brands aren't just paying for" size={72} font={F.sans} weight={500} color={C.mute} stagger={2} delay={4} />
        <div style={{position: 'relative', height: 360, marginTop: 20}}>
          {items.map((w, i) => {
            const s = 36 + i * 24;
            if (f < s || f >= s + 24) return null;
            const inn = lerp(f, s, s + 6);
            return (
              <div key={w} style={{position: 'absolute', fontFamily: F.serif, fontSize: 260, lineHeight: 1, opacity: inn, transform: `translateY(${(1 - inn) * 40}px)`, color: C.mute}}>
                <Strike progress={lerp(f, s + 8, s + 16)}>{w}</Strike>
              </div>
            );
          })}
          {f >= 108 && (
            <div
              style={{
                position: 'absolute',
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 300,
                lineHeight: 1,
                color: C.red,
                transform: `scale(${0.85 + 0.15 * final})`,
                transformOrigin: 'left center',
                opacity: final,
              }}
            >
              Trust.
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// 05 — Dictionary definition of "parasocial"
export const Definition: React.FC = () => {
  const f = useCurrentFrame();
  const hl = lerp(f, 95, 120);
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 200px', justifyContent: 'center'}}>
        <Kicker delay={0}>Definition</Kicker>
        <div style={{height: 30}} />
        <Words text="par·a·so·cial" size={200} delay={8} stagger={0} />
        <div style={{fontFamily: F.mono, fontSize: 30, color: C.mute, opacity: lerp(f, 22, 40), marginTop: 6}}>
          /ˌpær.əˈsoʊ.ʃəl/ &nbsp;·&nbsp; adjective
        </div>
        <div style={{height: 2, background: C.line, margin: '46px 0', width: 1500 * lerp(f, 30, 70)}} />
        <div style={{display: 'flex', gap: 30, alignItems: 'baseline'}}>
          <div style={{fontFamily: F.mono, fontSize: 32, color: C.red, opacity: lerp(f, 44, 54)}}>1.</div>
          <div style={{position: 'relative'}}>
            <div
              style={{
                position: 'absolute',
                left: 60,
                top: 8,
                height: 58,
                width: 260 * hl,
                background: C.redDeep,
                borderRadius: 6,
              }}
            />
            <Words
              text="A one-sided relationship where you feel like you know someone — even though they don't actually know you."
              size={56}
              font={F.sans}
              weight={400}
              lineHeight={1.3}
              delay={48}
              stagger={1.4}
              style={{position: 'relative', maxWidth: 1400}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const quad = (t: number, p0: number[], p1: number[], p2: number[]) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
];

// 06 — One-way relationship diagram
export const OneWay: React.FC = () => {
  const f = useCurrentFrame();
  const you = useS(4);
  const them = useS(14);
  const top = lerp(f, 30, 70);
  const bottom = lerp(f, 120, 175) * 0.45;
  const q = lerp(f, 175, 190);
  const P0 = [640, 470];
  const P1 = [960, 250];
  const P2 = [1260, 470];
  const labels = ['watching', 'liking', 'commenting', 'sharing', 'buying'];
  return (
    <Stage>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path
          d={`M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`}
          stroke={C.red}
          strokeWidth={5}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - top}
        />
        <path
          d="M 1260 610 Q 960 830 640 610"
          stroke={C.mute}
          strokeWidth={4}
          fill="none"
          strokeDasharray="14 16"
          pathLength={1000}
          style={{clipPath: `inset(0 0 0 ${(1 - bottom) * 100}%)`}}
        />
        {labels.map((l, i) => {
          const t = ((f - 60 - i * 22) % 110) / 110;
          if (f < 60 + i * 22) return null;
          const [x, y] = quad(t, P0, P1, P2);
          const o = Math.sin(t * Math.PI) * (1 - lerp(f, 180, 200));
          return (
            <g key={l} transform={`translate(${x} ${y})`} opacity={o}>
              <rect x={-90} y={-26} width={180} height={52} rx={26} fill={C.card2} stroke={C.red} strokeWidth={2} />
              <text x={0} y={9} textAnchor="middle" fill={C.ink} fontFamily="JetBrains Mono" fontSize={22}>
                {l}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 430, top: 440, transform: `scale(${you})`, textAlign: 'center'}}>
        <Avatar size={200} warm={false} />
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.16em', marginTop: 20, color: C.mute}}>YOU</div>
      </div>
      <div style={{position: 'absolute', left: 1260, top: 400, transform: `scale(${them})`, textAlign: 'center'}}>
        <div style={{padding: 10, borderRadius: 999, border: `4px solid ${C.red}`}}>
          <Avatar size={240} />
        </div>
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.16em', marginTop: 20, color: C.red}}>CREATOR</div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 700, fontFamily: F.serif, fontSize: 130, color: C.mute, opacity: q, transform: `scale(${0.6 + 0.4 * q})`}}>?</div>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <Words text="You know them. *They* *don't* *know* *you.*" size={70} delay={195} align="center" />
      </AbsoluteFill>
    </Stage>
  );
};

// 07 — The daily feed: waking up, getting ready, eating...
export const DailyFeed: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [
    ['07:02', 'Waking up'],
    ['07:40', 'Getting ready'],
    ['12:15', 'Eating'],
    ['15:30', 'Travelling'],
    ['19:05', 'Relationships'],
    ['20:10', 'Their home'],
    ['22:45', 'Their problems'],
    ['DAILY', 'Every single day'],
  ];
  const day = Math.max(1, Math.round(lerp(f, 20, 200, 1, 1095, (t) => t * t)));
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 100, right: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Kicker>What you see, every day</Kicker>
        <div style={{fontFamily: F.mono, fontSize: 30, color: C.red, letterSpacing: '0.1em'}}>DAY {String(day).padStart(4, '0')}</div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 210, width: 1640, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24}}>
        {cards.map(([t, l], i) => {
          const s = useS(14 + i * 10);
          const last = i === cards.length - 1;
          return (
            <div
              key={l}
              style={{
                height: 340,
                borderRadius: 28,
                background: last ? C.red : C.card,
                border: `1px solid ${last ? C.red : C.line}`,
                padding: 34,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + 0.06 * s})`,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 22, color: last ? C.bg : C.mute}}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </div>
              <div style={{fontFamily: F.serif, fontSize: 64, lineHeight: 1, color: last ? C.bg : C.ink, fontStyle: last ? 'italic' : undefined}}>{l}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// 08 — Stranger → Familiar → Trust
export const StrangerToTrust: React.FC<{labels?: string[][]}> = ({labels: custom}) => {
  const f = useCurrentFrame();
  const xs = [360, 960, 1560];
  const t = lerp(f, 30, 160, 0, 2, (x) => x);
  const seg = Math.min(1, Math.floor(t));
  const local = t - seg;
  const e = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
  const x = t >= 2 ? xs[2] : xs[seg] + (xs[seg + 1] - xs[seg]) * e;
  const labels = custom ?? [
    ['Stranger', 'Day 1'],
    ['Familiar', 'Month 6'],
    ['Trust', 'Year 3'],
  ];
  const lineIn = lerp(f, 0, 30);
  return (
    <Stage>
      <div style={{position: 'absolute', left: xs[0], top: 538, height: 4, width: (xs[2] - xs[0]) * lineIn, background: C.line}} />
      <div style={{position: 'absolute', left: xs[0], top: 538, height: 4, width: x - xs[0], background: C.red}} />
      {labels.map(([l, s], i) => {
        const reached = t >= i - 0.02;
        const col = !reached ? C.dim : i === 2 ? C.red : C.ink;
        return (
          <React.Fragment key={l}>
            <div style={{position: 'absolute', left: xs[i] - 14, top: 526, width: 28, height: 28, borderRadius: 14, background: reached ? col : C.bg, border: `4px solid ${reached ? col : C.dim}`}} />
            <div style={{position: 'absolute', left: xs[i] - 300, width: 600, top: 330, textAlign: 'center', fontFamily: F.serif, fontSize: 130, color: col, fontStyle: i === 2 && reached ? 'italic' : undefined}}>{l}</div>
            <div style={{position: 'absolute', left: xs[i] - 200, width: 400, top: 600, textAlign: 'center', fontFamily: F.mono, fontSize: 24, letterSpacing: '0.14em', color: reached ? C.mute : C.dim}}>{s.toUpperCase()}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: x - 22, top: 518, width: 44, height: 44, borderRadius: 22, background: C.red, boxShadow: `0 0 50px ${C.red}`}} />
    </Stage>
  );
};

// 09 — Traditional ad vs influencer ad comparison
export const Comparison: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    ['Who', 'A celebrity you don’t know', 'Someone you watch daily'],
    ['Where', 'Interrupts the content', 'Lives inside the content'],
    ['Awareness', 'Everyone knows it’s paid', 'Easy to forget it’s paid'],
    ['Feels like', 'An advertisement', 'Advice from a friend'],
  ];
  const head = useS(4);
  const bar = lerp(f, 170, 200);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, right: 140, top: 150}}>
        <div style={{display: 'grid', gridTemplateColumns: '300px 1fr 1fr', opacity: head, paddingBottom: 30, borderBottom: `2px solid ${C.line}`}}>
          <div />
          <div style={{fontFamily: F.serif, fontSize: 72, color: C.mute}}>Traditional ad</div>
          <div style={{fontFamily: F.serif, fontSize: 72, fontStyle: 'italic', color: C.red, position: 'relative'}}>Influencer ad</div>
        </div>
        {rows.map(([k, a, b], i) => {
          const s = useS(30 + i * 28);
          return (
            <div
              key={k}
              style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr 1fr',
                padding: '38px 0',
                borderBottom: `1px solid ${C.line}`,
                opacity: s,
                transform: `translateY(${(1 - s) * 30}px)`,
                alignItems: 'center',
              }}
            >
              <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.14em', color: C.mute, textTransform: 'uppercase'}}>{k}</div>
              <div style={{fontSize: 44, color: C.mute}}>{a}</div>
              <div style={{fontSize: 44, fontWeight: 600}}>{b}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1000, top: 140, width: 6, height: 790 * bar, background: C.red, borderRadius: 3}} />
    </Stage>
  );
};

// 10 — The ad sits inside normal content (timeline scrubbing through a morning routine video)
export const AdInsideContent: React.FC = () => {
  const f = useCurrentFrame();
  const segs = [
    ['Intro', 0.12],
    ['Coffee', 0.18],
    ['Outfit', 0.2],
    ['Skincare', 0.16],
    ['The serum', 0.15],
    ['Outro', 0.19],
  ] as const;
  const W = 1640;
  const ph = lerp(f, 20, 190, 0, 1, (x) => x);
  let acc = 0;
  let current = 0;
  segs.forEach(([, w], i) => {
    if (ph >= acc) current = i;
    acc += w;
  });
  const reveal = lerp(f, 200, 225);
  const previewOut = lerp(f, 230, 250);
  const mins = Math.floor(ph * 12.8);
  const secs = Math.floor((ph * 12.8 * 60) % 60);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 90}}>
        <Kicker>Morning routine · 12:48</Kicker>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 410,
          top: 170,
          width: 1100,
          height: 420,
          borderRadius: 30,
          background: current === 4 ? 'linear-gradient(160deg, #F2C9A8, #A9472F)' : `linear-gradient(160deg, #2a2724, #171514)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - previewOut,
          transform: `scale(${1 - previewOut * 0.05})`,
          border: `1px solid ${C.line}`,
          overflow: 'hidden',
        }}
      >
        <div style={{fontFamily: F.serif, fontSize: 130, color: current === 4 ? '#2B1B16' : C.ink}}>{segs[current][0]}</div>
        <div style={{position: 'absolute', left: 30, bottom: 24, fontFamily: F.mono, fontSize: 22, color: current === 4 ? '#2B1B16' : C.mute}}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} / 12:48
        </div>
        {current === 4 && (
          <div style={{position: 'absolute', right: 30, top: 24, fontFamily: F.sans, fontSize: 16, color: 'rgba(43,27,22,0.55)'}}>Paid partnership</div>
        )}
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 280}}>
        {f > 235 && <Words text="It doesn't interrupt the video. / It *becomes* the video." size={104} delay={240} align="center" />}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 140, top: 700, width: W, display: 'flex', gap: 8}}>
        {segs.map(([l, w], i) => {
          const ad = i === 4;
          return (
            <div key={l} style={{width: W * w - 8}}>
              <div style={{height: 26, borderRadius: 8, background: ad ? `rgb(${43 + (255 - 43) * reveal},${41 + (59 - 41) * reveal},${38 + (47 - 38) * reveal})` : C.line}} />
              <div style={{fontFamily: F.mono, fontSize: 20, marginTop: 16, color: ad && reveal > 0.5 ? C.red : C.mute}}>{l}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: W * ph - 3, top: -18, width: 6, height: 62, background: C.ink, borderRadius: 3}} />
      </div>
      <div style={{position: 'absolute', top: 820, left: 140 + W * (0.12 + 0.18 + 0.2 + 0.16), width: W * 0.15, textAlign: 'center', fontFamily: F.mono, fontSize: 24, color: C.red, opacity: reveal, letterSpacing: '0.1em'}}>
        ↑ THE AD
      </div>
    </Stage>
  );
};

export {Phone};
