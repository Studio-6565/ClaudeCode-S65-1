import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Avatar, C, Check, F, Kicker, Pill, Stage, Strike, Typed, Words, fmt, lerp, useS} from './lib';

// 11 — Built over years, then a brand steps on top
export const BuiltOverYears: React.FC = () => {
  const f = useCurrentFrame();
  const blocks = ['Personality', 'Credibility', 'Familiarity'];
  const year = Math.min(3, 1 + Math.floor(lerp(f, 10, 110, 0, 3, (x) => x)));
  const brand = useS(130, 16);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 110}}>
        <Kicker>Built by the creator · Year {year}</Kicker>
      </div>
      <div style={{position: 'absolute', left: 180, bottom: 150, width: 640}}>
        <div
          style={{
            height: 140,
            marginBottom: 14,
            borderRadius: 22,
            background: C.red,
            display: 'flex',
            alignItems: 'center',
            padding: '0 40px',
            justifyContent: 'space-between',
            transform: `translateX(${(1 - brand) * 1400}px) rotate(${(1 - brand) * 8}deg)`,
            opacity: f >= 130 ? 1 : 0,
          }}
        >
          <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 56, color: C.bg, letterSpacing: '0.06em'}}>BRAND</span>
          <span style={{fontFamily: F.mono, fontSize: 22, color: C.bg}}>DAY 1</span>
        </div>
        {blocks.map((b, i) => {
          const d = 10 + (2 - i) * 34;
          const s = useS(d, 18);
          return (
            <div
              key={b}
              style={{
                height: 140,
                marginBottom: 14,
                borderRadius: 22,
                background: C.card2,
                border: `1px solid ${C.line}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                justifyContent: 'space-between',
                transform: `translateY(${(1 - s) * -600}px)`,
                opacity: f >= d ? 1 : 0,
              }}
            >
              <span style={{fontFamily: F.serif, fontSize: 66}}>{b}</span>
              <span style={{fontFamily: F.mono, fontSize: 22, color: C.mute}}>YEAR {3 - i}</span>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{left: 960, justifyContent: 'center', paddingRight: 140}}>
        <Words text="The creator spent / *years* building it." size={96} delay={20} />
        <div style={{height: 50}} />
        <Words text="The brand isn't starting / from *zero.*" size={96} delay={150} />
      </AbsoluteFill>
    </Stage>
  );
};

const Meter: React.FC<{value: number; label: string; h?: number}> = ({value, label, h = 520}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
    <div style={{fontFamily: F.mono, fontSize: 30, color: C.ink}}>{Math.round(value * 100)}%</div>
    <div style={{width: 110, height: h, borderRadius: 30, background: C.card, border: `1px solid ${C.line}`, position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', bottom: 0, width: '100%', height: `${value * 100}%`, background: C.red}} />
    </div>
    <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.14em', color: C.mute}}>{label}</div>
  </div>
);

// 12 — Borrowed trust: money goes in, trust flows out
export const BorrowedTrust: React.FC = () => {
  const f = useCurrentFrame();
  const creatorIn = useS(4);
  const money = lerp(f, 40, 85);
  const flow = lerp(f, 95, 190, 0, 1, (x) => x);
  const brandV = lerp(f, 100, 200, 0, 0.72);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 260, top: 190, display: 'flex', gap: 60, alignItems: 'flex-end', opacity: creatorIn}}>
        <div style={{textAlign: 'center', marginBottom: 60}}>
          <Avatar size={200} />
          <div style={{fontFamily: F.serif, fontSize: 56, marginTop: 20}}>Creator</div>
        </div>
        <Meter value={0.96} label="TRUST" />
      </div>
      <div style={{position: 'absolute', right: 260, top: 190, display: 'flex', gap: 60, alignItems: 'flex-end', flexDirection: 'row-reverse'}}>
        <div style={{textAlign: 'center', marginBottom: 60}}>
          <div style={{width: 200, height: 200, borderRadius: 40, background: C.ink, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 40, letterSpacing: '0.06em'}}>BRAND</div>
          <div style={{fontFamily: F.serif, fontSize: 56, marginTop: 20}}>Company</div>
        </div>
        <Meter value={brandV} label="TRUST" />
      </div>
      {f > 40 && f < 92 && (
        <div style={{position: 'absolute', top: 360, left: 1380 - 800 * money, opacity: Math.sin(money * Math.PI)}}>
          <Pill bg={C.ink} color={C.bg} style={{fontSize: 40}}>$ paid</Pill>
        </div>
      )}
      {Array.from({length: 26}).map((_, i) => {
        const t = (flow * 1.6 - i * 0.03) % 1;
        if (flow <= 0 || flow * 1.6 - i * 0.03 < 0 || f > 205) return null;
        const x = 700 + t * 520;
        const y = 460 + Math.sin(t * Math.PI * 2 + i) * 40 * random(i);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 18, height: 18, borderRadius: 9, background: C.red, opacity: Math.sin(t * Math.PI), boxShadow: `0 0 24px ${C.red}`}} />;
      })}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <Words text="The brand borrows trust it *never* *built.*" size={80} delay={150} align="center" />
      </AbsoluteFill>
    </Stage>
  );
};

// 13 — "It doesn't sound like advertising" — three quotes stacking
export const AdLanguage: React.FC = () => {
  const qs = ['“You guys keep asking me about this.”', '“I’ve genuinely been obsessed with this.”', '“I would never recommend something I don’t actually use.”'];
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 160px', justifyContent: 'center'}}>
        <Kicker>It doesn’t sound like advertising</Kicker>
        <div style={{height: 50}} />
        {qs.map((q, i) => {
          const s = useS(20 + i * 55);
          const dim = useS(20 + (i + 1) * 55);
          return (
            <div key={q} style={{display: 'flex', gap: 34, alignItems: 'center', marginBottom: 40, opacity: s * (i < 2 ? 1 - dim * 0.55 : 1), transform: `translateX(${(1 - s) * -60}px)`}}>
              <Avatar size={80} />
              <div style={{fontFamily: F.serif, fontSize: 82, lineHeight: 1.05}}>{q}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// 14 — Research questions
export const ResearchQuestions: React.FC = () => {
  const qs = ['Why do people trust influencers so much?', 'Does that trust actually change what we buy?', 'Does putting “ad” on a post really solve the problem?'];
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <Kicker>What I wanted to know</Kicker>
        <div style={{height: 40}} />
        {qs.map((q, i) => {
          const s = useS(16 + i * 45);
          return (
            <div key={q} style={{display: 'flex', gap: 50, alignItems: 'baseline', padding: '38px 0', borderTop: `1px solid ${C.line}`, opacity: s}}>
              <div style={{fontFamily: F.mono, fontSize: 30, color: C.red, width: 60}}>0{i + 1}</div>
              <Words text={q} size={78} delay={16 + i * 45} stagger={2} />
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// 15 — Research focus: four areas around trust
export const ResearchFocus: React.FC = () => {
  const f = useCurrentFrame();
  const nodes = [
    ['Parasocial relationships', 440, 280],
    ['Credibility', 1480, 280],
    ['Sponsored content', 440, 800],
    ['Purchase intention', 1480, 800],
  ] as const;
  const center = useS(100, 14);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 90}}>
        <Kicker>What the research looks at</Kicker>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {nodes.map(([l, x, y], i) => {
          const p = lerp(f, 70 + i * 6, 110 + i * 6);
          return <line key={l} x1={x} y1={y} x2={x + (960 - x) * p} y2={y + (540 - y) * p} stroke={C.red} strokeWidth={3} strokeDasharray="10 10" />;
        })}
      </svg>
      {nodes.map(([l, x, y], i) => {
        const s = useS(10 + i * 12);
        return (
          <div key={l} style={{position: 'absolute', left: x - 300, top: y - 60, width: 600, display: 'flex', justifyContent: 'center', opacity: s, transform: `scale(${0.9 + 0.1 * s})`}}>
            <Pill style={{fontSize: 40, padding: '24px 40px', fontWeight: 500}}>{l}</Pill>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 960 - 150, top: 540 - 150, width: 300, height: 300, borderRadius: 150, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${center})`, boxShadow: `0 0 120px ${C.redDeep}`}}>
        <span style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 110, color: C.bg}}>Trust</span>
      </div>
    </Stage>
  );
};

// 16 — Relatable. Authentic. Trustworthy.
export const Traits: React.FC = () => {
  const f = useCurrentFrame();
  const traits = ['Relatable.', 'Authentic.', 'Trustworthy.'];
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 200px', justifyContent: 'center'}}>
        <Words text="Influencers are more persuasive when they seem" size={52} font={F.sans} weight={500} color={C.mute} stagger={1.5} />
        <div style={{height: 40}} />
        {traits.map((t, i) => {
          const d = 40 + i * 30;
          const s = useS(d);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 44, opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
              <Check p={lerp(f, d + 6, d + 20)} size={64} />
              <div style={{fontFamily: F.serif, fontSize: 170, lineHeight: 1.05, fontStyle: i === 2 ? 'italic' : undefined, color: i === 2 ? C.red : C.ink}}>{t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// 17 — Two years of watching a beauty creator
export const BeautyTimeline: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1640;
  const marks = [
    [0.02, 'Month 1', 'The breakout photo'],
    [0.26, 'Month 5', 'Testing everything'],
    [0.48, 'Month 11', 'What didn’t work'],
    [0.72, 'Month 18', 'What finally worked'],
    [0.98, 'Month 24', '“This is what changed my skin.”'],
  ] as const;
  const ph = lerp(f, 20, 200, 0, 1, (x) => x);
  const line = lerp(f, 0, 30);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 100}}>
        <Kicker>Two years of watching</Kicker>
      </div>
      <div style={{position: 'absolute', left: 140, top: 500, width: W * line, height: 4, background: C.line}} />
      <div style={{position: 'absolute', left: 140, top: 500, width: W * ph, height: 4, background: C.red}} />
      {marks.map(([x, m, l], i) => {
        const on = ph >= x;
        const s = useS(20 + x * 180);
        const up = i % 2 === 0;
        const last = i === marks.length - 1;
        return (
          <div key={m} style={{position: 'absolute', left: 140 + W * x, top: 502}}>
            <div style={{position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: on ? C.red : C.bg, border: `4px solid ${on ? C.red : C.dim}`}} />
            <div style={{position: 'absolute', left: 0, width: 2, height: 80, top: up ? -100 : 20, background: C.line, opacity: s}} />
            <div
              style={{
                position: 'absolute',
                width: last ? 520 : 380,
                left: last ? -520 : i === 0 ? -14 : -190,
                textAlign: last ? 'right' : i === 0 ? 'left' : 'center',
                top: up ? -250 : 120,
                opacity: s,
                transform: `translateY(${(1 - s) * (up ? 20 : -20)}px)`,
              }}
            >
              <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.12em', color: last ? C.red : C.mute}}>{m.toUpperCase()}</div>
              <div style={{fontFamily: F.serif, fontSize: last ? 56 : 52, lineHeight: 1.05, marginTop: 10, fontStyle: last ? 'italic' : undefined}}>{l}</div>
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110}}>
        <Words text="That statement has *history* behind it." size={84} delay={215} align="center" />
      </AbsoluteFill>
    </Stage>
  );
};

// 18 — Trust transfers from creator to product
export const TrustTransfer: React.FC = () => {
  const f = useCurrentFrame();
  const flow = lerp(f, 40, 180, 0, 1, (x) => x);
  const pct = lerp(f, 50, 190, 0, 71);
  const a = useS(4);
  const b = useS(14);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 300, top: 280, textAlign: 'center', transform: `scale(${a})`}}>
        <div style={{padding: 12, borderRadius: 999, border: `4px solid ${C.red}`}}>
          <Avatar size={280} />
        </div>
        <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.14em', marginTop: 26, color: C.mute}}>SOMEONE YOU TRUST</div>
      </div>
      <div style={{position: 'absolute', right: 360, top: 240, textAlign: 'center', transform: `scale(${b})`}}>
        <div style={{width: 200, height: 380, margin: '0 auto', position: 'relative'}}>
          <div style={{position: 'absolute', left: 60, top: 0, width: 80, height: 60, borderRadius: 12, background: C.dim}} />
          <div style={{position: 'absolute', left: 0, top: 50, width: 200, height: 330, borderRadius: 40, background: C.card2, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
            <div style={{position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`, background: C.red, opacity: 0.9}} />
          </div>
        </div>
        <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: '0.14em', marginTop: 26, color: C.mute}}>
          THE PRODUCT · <span style={{color: C.red}}>{Math.round(pct)}% TRUST</span>
        </div>
      </div>
      {Array.from({length: 40}).map((_, i) => {
        const raw = flow * 2.2 - i * 0.03;
        if (raw < 0 || f > 200) return null;
        const t = raw % 1;
        const x = 660 + t * 720;
        const y = 440 + Math.sin(t * Math.PI) * -120 + (random(`y${i}`) - 0.5) * 60;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 14, height: 14, borderRadius: 7, background: C.red, opacity: Math.sin(t * Math.PI), boxShadow: `0 0 20px ${C.red}`}} />;
      })}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <Words text="Some of that trust *transfers* to the product." size={76} delay={120} align="center" />
      </AbsoluteFill>
    </Stage>
  );
};

// 19 — Discount code, link in bio, limited-time offer
export const Friction: React.FC = () => {
  const f = useCurrentFrame();
  const a = useS(8, 14);
  const b = useS(32, 14);
  const c = useS(56, 14);
  const remaining = 23 * 3600 + 59 * 60 + 59 - Math.floor(f / 30);
  const hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const card: React.CSSProperties = {position: 'absolute', borderRadius: 30, background: C.card, border: `1px solid ${C.line}`, padding: '34px 44px'};
  return (
    <Stage>
      <div style={{...card, left: 180, top: 170, transform: `scale(${a}) rotate(${-4 * a}deg)`, borderStyle: 'dashed', borderColor: C.red, borderWidth: 3}}>
        <div style={{fontFamily: F.mono, fontSize: 22, color: C.mute, letterSpacing: '0.14em'}}>USE CODE</div>
        <div style={{fontFamily: F.mono, fontSize: 84, fontWeight: 500, color: C.red, marginTop: 6}}>MAYA15</div>
        <div style={{fontSize: 30, color: C.ink, marginTop: 4}}>15% off your first order</div>
      </div>
      <div style={{...card, left: 800, top: 300, transform: `scale(${b}) rotate(${3 * b}deg)`}}>
        <div style={{fontSize: 64, fontWeight: 600}}>Link in bio ↗</div>
      </div>
      <div style={{...card, left: 1250, top: 150, transform: `scale(${c}) rotate(${-2 * c}deg)`, background: C.red, borderColor: C.red}}>
        <div style={{fontFamily: F.mono, fontSize: 22, color: C.bg, letterSpacing: '0.14em'}}>LIMITED TIME · ENDS IN</div>
        <div style={{fontFamily: F.mono, fontSize: 80, fontWeight: 500, color: C.bg, marginTop: 6}}>
          {hh}:{mm}:{ss}
        </div>
      </div>
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 180px 150px'}}>
        <Words text="And suddenly the whole thing / becomes *very* easy." size={110} delay={90} />
      </AbsoluteFill>
    </Stage>
  );
};

// 20 — Watch. Trust. Click. Buy.
export const WatchTrustClickBuy: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['Watch.', 'Trust.', 'Click.', 'Buy.'];
  const beat = 16;
  const rowStart = 4 * beat + 14;
  const row = useS(rowStart);
  const rowS = [0, 1, 2, 3].map((i) => lerp(f, rowStart + i * 4, rowStart + i * 4 + 14));
  if (f < rowStart) {
    const i = Math.min(3, Math.floor(f / beat));
    const local = f - i * beat;
    const sc = lerp(local, 0, 6, 1.35, 1);
    return (
      <Stage>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: F.serif, fontSize: 380, transform: `scale(${sc})`, color: i === 3 ? C.red : C.ink, fontStyle: i === 3 ? 'italic' : undefined}}>{words[i]}</div>
        </AbsoluteFill>
      </Stage>
    );
  }
  return (
    <Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 40}}>
        {words.map((w, i) => {
          const s = rowS[i];
          return (
            <React.Fragment key={w}>
              {i > 0 && <div style={{fontFamily: F.sans, fontSize: 60, color: C.dim, opacity: s}}>→</div>}
              <div style={{fontFamily: F.serif, fontSize: 170, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, color: i === 3 ? C.red : C.ink, fontStyle: i === 3 ? 'italic' : undefined}}>{w}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 260, right: 260, top: 720, height: 4, background: C.line, opacity: row}}>
        <div style={{height: '100%', width: `${lerp(f, rowStart + 10, rowStart + 70) * 100}%`, background: C.red}} />
      </div>
    </Stage>
  );
};

// 21 — Not reach. Access.
export const ReachVsAccess: React.FC = () => {
  const f = useCurrentFrame();
  const pts = Array.from({length: 70}).map((_, i) => [random(`x${i}`), random(`y${i}`)]);
  const left = useS(40);
  const right = useS(110);
  const strike = lerp(f, 90, 110);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 110, fontFamily: F.serif, fontSize: 96, lineHeight: 1.1}}>
        <span style={{opacity: left}}>
          They’re not buying <Strike progress={strike}><span style={{color: C.mute}}>reach.</span></Strike>
        </span>{' '}
        <span style={{opacity: right}}>
          They’re buying <span style={{color: C.red, fontStyle: 'italic'}}>access.</span>
        </span>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {pts.map(([x, y], i) => {
          const s = lerp(f, 40 + i * 0.6, 60 + i * 0.6);
          return <circle key={i} cx={180 + x * 700} cy={400 + y * 540} r={10} fill={C.mute} opacity={s * (1 - strike * 0.6)} />;
        })}
        {pts.slice(0, 24).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const cx = 1400;
          const cy = 670;
          const R = 250;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          const p = lerp(f, 120 + i * 2, 150 + i * 2);
          return (
            <g key={i} opacity={right}>
              <line x1={cx} y1={cy} x2={cx + (x - cx) * p} y2={cy + (y - cy) * p} stroke={C.red} strokeWidth={2.5} opacity={0.7} />
              <circle cx={x} cy={y} r={12} fill={p > 0.9 ? C.red : C.dim} />
            </g>
          );
        })}
        <circle cx={1400} cy={670} r={54 * right} fill={C.ink} />
      </svg>
      <div style={{position: 'absolute', left: 180, top: 960, fontFamily: F.mono, fontSize: 22, color: C.mute, letterSpacing: '0.14em', opacity: left}}>AN AUDIENCE</div>
      <div style={{position: 'absolute', left: 1150, top: 960, width: 500, textAlign: 'center', fontFamily: F.mono, fontSize: 22, color: C.red, letterSpacing: '0.14em', opacity: right}}>A RELATIONSHIP</div>
    </Stage>
  );
};

// 22 — A brand takes years. An influencer already has it.
export const YearsVsAlready: React.FC = () => {
  const f = useCurrentFrame();
  const slow = lerp(f, 30, 210, 0, 0.34, (x) => x);
  const fast = useS(70, 20);
  const yr = 1 + Math.floor(lerp(f, 30, 210, 0, 4.99, (x) => x));
  const Row: React.FC<{title: string; tag: string; v: number; hot?: boolean; delay: number}> = ({title, tag, v, hot, delay}) => {
    const s = useS(delay);
    return (
      <div style={{marginBottom: 90, opacity: s}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24}}>
          <div style={{fontFamily: F.serif, fontSize: 76, fontStyle: hot ? 'italic' : undefined}}>{title}</div>
          <div style={{fontFamily: F.mono, fontSize: 26, color: hot ? C.red : C.mute, letterSpacing: '0.1em'}}>{tag}</div>
        </div>
        <div style={{height: 56, borderRadius: 28, background: C.card, border: `1px solid ${C.line}`, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${v * 100}%`, background: hot ? C.red : C.mute, borderRadius: 28}} />
        </div>
      </div>
    );
  };
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <Kicker>Building trust with a customer</Kicker>
        <div style={{height: 60}} />
        <Row title="A brand" tag={`YEAR ${yr} · ${Math.round(slow * 100)}%`} v={slow} delay={8} />
        <Row title="An influencer" tag={f > 75 ? 'ALREADY THERE' : ''} v={fast} hot delay={60} />
      </AbsoluteFill>
    </Stage>
  );
};

export {Typed, fmt};
