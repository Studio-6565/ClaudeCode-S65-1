import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Avatar, C, Check, F, Kicker, Phone, Pill, Stage, Strike, Words, lerp, useS} from './lib';

// 23 — "Trust our company." → "Trust this person you already like."
export const TrustSwap: React.FC = () => {
  const f = useCurrentFrame();
  const a = useS(6);
  const strike = lerp(f, 45, 65);
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <Kicker>The pitch, translated</Kicker>
        <div style={{height: 50}} />
        <div style={{fontFamily: F.serif, fontSize: 110, color: C.mute, opacity: a * (1 - strike * 0.5)}}>
          <Strike progress={strike}>“Trust our company.”</Strike>
        </div>
        <div style={{height: 40}} />
        <Words text="“Trust this person / you already *like.”*" size={170} delay={72} lineHeight={1} />
      </AbsoluteFill>
    </Stage>
  );
};

// 24 — Disclosure labels stamp onto a post
export const DisclosureLabels: React.FC = () => {
  const f = useCurrentFrame();
  const phone = useS(4);
  const l1 = useS(40, 12);
  const l2 = useS(75, 12);
  const l3 = useS(110, 12);
  const Stamp: React.FC<{p: number; text: string; x: number; y: number; r: number}> = ({p, text, x, y, r}) => (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${2 - p}) rotate(${r}deg)`, opacity: Math.min(1, p * 1.5)}}>
      <Pill bg={C.red} color={C.bg} style={{fontSize: 44, fontWeight: 700, border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        {text}
      </Pill>
    </div>
  );
  return (
    <Stage>
      <div style={{position: 'absolute', left: 260, top: 70, transform: `translateY(${(1 - phone) * 200}px)`, opacity: phone}}>
        <Phone
          label={f > 40 ? <span style={{color: C.ink}}>Paid partnership with Brand</span> : 'Original audio'}
          caption={
            <>
              <b>maya.mornings</b> my current AM routine {f > 110 && <span style={{color: C.red}}>#ad</span>}
            </>
          }
        />
      </div>
      <Stamp p={l1} text="Paid partnership" x={600} y={200} r={-6} />
      <Stamp p={l2} text="Sponsored" x={620} y={520} r={4} />
      <Stamp p={l3} text="#ad" x={560} y={820} r={-3} />
      <AbsoluteFill style={{left: 1080, justifyContent: 'center', paddingRight: 140}}>
        <Words text="People should know / when *money* is / involved." size={100} delay={140} />
      </AbsoluteFill>
    </Stage>
  );
};

// 25 — The "ad" label barely dents three years of trust
export const DisclosureVsTrust: React.FC = () => {
  const f = useCurrentFrame();
  const bar = lerp(f, 10, 50);
  const drop = useS(70, 9);
  const dip = f < 78 ? 0 : Math.max(0, Math.sin(Math.min(1, (f - 78) / 40) * Math.PI)) * 0.14 + lerp(f, 78, 130) * 0.06;
  const v = bar * (1 - dip);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 150}}>
        <Kicker>Trust built over three years</Kicker>
      </div>
      <div style={{position: 'absolute', left: 180, right: 180, top: 380}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', fontFamily: F.mono, fontSize: 40, marginBottom: 20}}>{Math.round(v * 100)}%</div>
        <div style={{height: 110, borderRadius: 30, background: C.card, border: `1px solid ${C.line}`, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${v * 100}%`, background: C.red}} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1250,
          top: -200 + drop * 520,
          transform: `rotate(${(1 - drop) * 20 - 6}deg)`,
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 90,
          padding: '10px 44px',
          background: C.ink,
          color: C.bg,
          borderRadius: 24,
          opacity: f >= 70 ? 1 : 0,
        }}
      >
        AD
      </div>
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 180px 150px'}}>
        <Words text="The label changes what you *know.* / Not how you *feel.*" size={100} delay={140} />
      </AbsoluteFill>
    </Stage>
  );
};

// 26 — To be fair: the real benefits
export const Benefits: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    'Small businesses reach exactly the right people',
    'Creators get paid for their work',
    'People discover products they genuinely like',
    'Some creators are extremely selective',
  ];
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 200px', justifyContent: 'center'}}>
        <Kicker>To be fair</Kicker>
        <div style={{height: 20}} />
        <Words text="It’s not *automatically* bad." size={120} delay={6} />
        <div style={{height: 50}} />
        {items.map((t, i) => {
          const d = 40 + i * 26;
          const s = useS(d);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '22px 0', borderTop: `1px solid ${C.line}`, opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>
              <Check p={lerp(f, d + 4, d + 18)} />
              <div style={{fontSize: 50, fontWeight: 500}}>{t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// 27 — "Influencers get paid, therefore it's bad" → TOO SIMPLE
export const TooSimple: React.FC = () => {
  const f = useCurrentFrame();
  const a = useS(6);
  const b = useS(30);
  const stamp = useS(75, 10, 0.6);
  return (
    <Stage>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 30}}>
        <div style={{fontFamily: F.serif, fontSize: 120, opacity: a * (f > 75 ? 0.45 : 1)}}>Influencers get paid</div>
        <div style={{fontFamily: F.sans, fontSize: 70, color: C.mute, opacity: b}}>↓</div>
        <div style={{fontFamily: F.serif, fontSize: 120, opacity: b * (f > 75 ? 0.45 : 1)}}>therefore influencer marketing is bad.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            opacity: f >= 75 ? 1 : 0,
            transform: `scale(${2.2 - 1.2 * stamp}) rotate(-8deg)`,
            border: `10px solid ${C.red}`,
            color: C.red,
            fontFamily: F.sans,
            fontWeight: 700,
            fontSize: 160,
            letterSpacing: '0.08em',
            padding: '10px 60px',
            borderRadius: 24,
            background: 'rgba(12,11,10,0.85)',
          }}
        >
          TOO SIMPLE
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// 28 — The relationship, for rent
export const ForRent: React.FC = () => {
  const f = useCurrentFrame();
  const card = useS(4);
  const tagIn = useS(40, 14);
  const t = Math.max(0, f - 40);
  const swing = 22 * Math.exp(-t / 45) * Math.cos(t / 7);
  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 230,
          width: 700,
          height: 560,
          borderRadius: 40,
          background: C.card,
          border: `1px solid ${C.line}`,
          padding: 50,
          opacity: card,
          transform: `translateY(${(1 - card) * 50}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Avatar size={110} warm={false} />
          <svg width="70" height="64" viewBox="0 0 24 22"><path d="M12 21 C5 15 1 11.5 1 7 A5.5 5.5 0 0 1 12 4 A5.5 5.5 0 0 1 23 7 C23 11.5 19 15 12 21Z" fill={C.red} /></svg>
          <Avatar size={110} />
        </div>
        <div>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.mute, letterSpacing: '0.14em'}}>BUILT OVER 3 YEARS</div>
          <div style={{fontFamily: F.serif, fontSize: 96, marginTop: 10}}>The relationship</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 250, transformOrigin: '0 0', transform: `rotate(${swing + 10}deg) scale(${tagIn})`}}>
        <div style={{width: 3, height: 90, background: C.mute, marginLeft: 30}} />
        <div
          style={{
            width: 300,
            padding: '30px 30px 34px',
            background: C.red,
            color: C.bg,
            borderRadius: '16px 60px 16px 16px',
            fontFamily: F.sans,
            fontWeight: 700,
          }}
        >
          <div style={{fontSize: 56, letterSpacing: '0.04em'}}>FOR RENT</div>
          <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 24, marginTop: 8}}>$ / sponsored post</div>
        </div>
      </div>
      <AbsoluteFill style={{left: 1180, justifyContent: 'center', paddingRight: 140}}>
        <Words text="When the relationship / itself can be *rented,* / the line gets *blurry.*" size={80} delay={80} />
      </AbsoluteFill>
    </Stage>
  );
};

// 29 — Younger audiences grew up with them
export const GrewUp: React.FC = () => {
  const f = useCurrentFrame();
  const age = Math.round(lerp(f, 10, 170, 9, 19, (x) => x));
  const types = ['YouTubers', 'TikTok creators', 'Streamers'];
  const habits = ['Talk straight to camera', 'Reply to comments', 'Share personal stories'];
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 120, display: 'flex', alignItems: 'baseline', gap: 30}}>
        <Kicker>Growing up online</Kicker>
        <div style={{fontFamily: F.mono, fontSize: 30, color: C.red}}>AGE {age}</div>
      </div>
      <div style={{position: 'absolute', left: 180, top: 230, display: 'flex', gap: 24}}>
        {types.map((t, i) => {
          const s = useS(14 + i * 12);
          return (
            <div key={t} style={{opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
              <Pill style={{fontSize: 44, padding: '20px 36px'}}>{t}</Pill>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 180, top: 400}}>
        {habits.map((h, i) => {
          const s = useS(60 + i * 18);
          return (
            <div key={h} style={{fontFamily: F.serif, fontSize: 84, lineHeight: 1.15, color: C.mute, opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>
              — {h}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 180px 120px'}}>
        <Words text="It can feel like you *grew* *up* with them." size={96} delay={130} />
      </AbsoluteFill>
    </Stage>
  );
};

// 30 — "I trust this person" ≠ "I trust this product"
export const PersonVsProduct: React.FC = () => {
  const f = useCurrentFrame();
  const a = useS(6);
  const b = useS(24);
  const merge = lerp(f, 60, 100) * (1 - lerp(f, 140, 175));
  const neq = useS(165, 12);
  const off = 150 * (1 - merge);
  const line = (text: React.ReactNode, y: number, o: number) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: 540 + y - 90, textAlign: 'center', fontFamily: F.serif, fontSize: 160, lineHeight: 1, opacity: o}}>{text}</div>
  );
  return (
    <Stage>
      {line(<>“I trust this <span style={{fontStyle: 'italic'}}>person.</span>”</>, -off, a * (1 - merge * 0.4))}
      {line(<>“I trust this <span style={{fontStyle: 'italic', color: C.red}}>product.</span>”</>, off, b * (1 - merge * 0.4))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 540 - 70, textAlign: 'center', fontFamily: F.sans, fontWeight: 300, fontSize: 130, color: C.red, opacity: neq, transform: `scale(${neq})`}}>≠</div>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <Words text="Not necessarily the same thing." size={56} font={F.sans} weight={500} color={C.mute} delay={185} align="center" stagger={2} />
      </AbsoluteFill>
    </Stage>
  );
};

// 31 — What's really being sold
export const WhatsBeingSold: React.FC = () => {
  const items = [
    ['The product', 56, C.mute],
    ['Attention', 84, C.ink],
    ['Access', 110, C.ink],
    ['Credibility', 140, C.ink],
    ['Trust.', 250, C.red],
  ] as const;
  return (
    <Stage>
      <div style={{position: 'absolute', left: 180, top: 110}}>
        <Kicker>So what’s really being sold?</Kicker>
      </div>
      <div style={{position: 'absolute', left: 180, bottom: 90}}>
        {items.map(([t, size, col], i) => {
          const s = useS(16 + i * 26, i === 4 ? 14 : 200);
          return (
            <div
              key={t}
              style={{
                fontFamily: F.serif,
                fontSize: size,
                lineHeight: 1.02,
                color: col,
                fontStyle: i === 4 ? 'italic' : undefined,
                opacity: s,
                transform: `translateY(${(1 - s) * 40}px)`,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// 32 — Ending statement
export const Ending: React.FC = () => {
  const f = useCurrentFrame();
  const dim = lerp(f, 120, 150);
  return (
    <Stage>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <div style={{opacity: 1 - dim * 0.6}}>
          <Words text="Sometimes the most valuable thing in the deal / isn’t the product." size={84} delay={10} stagger={2.5} />
        </div>
        <div style={{height: 60}} />
        <Words text="It’s the *trust* that existed / before the ad ever started." size={120} delay={130} stagger={3} />
      </AbsoluteFill>
    </Stage>
  );
};

// Quote card — reused for every creator line in the script
export const Quote: React.FC<{quote: string; who: string; context: string; thought?: boolean}> = ({quote, who, context, thought}) => {
  const f = useCurrentFrame();
  const mark = useS(0, 14);
  const meta = useS(10);
  const line = lerp(f, 6, 40);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 150, top: 40, fontFamily: F.serif, fontSize: 420, lineHeight: 1, color: thought ? C.dim : C.red, transform: `scale(${mark})`, transformOrigin: 'left top'}}>
        “
      </div>
      <AbsoluteFill style={{padding: '0 180px', justifyContent: 'center'}}>
        <Words text={quote} size={thought ? 100 : 118} delay={14} stagger={2.6} lineHeight={1.05} style={{maxWidth: 1560, fontStyle: thought ? 'italic' : undefined}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 180, bottom: 110, display: 'flex', alignItems: 'center', gap: 26, opacity: meta}}>
        {thought ? <Avatar size={72} warm={false} /> : <Avatar size={72} />}
        <div>
          <div style={{fontSize: 32, fontWeight: 600}}>{who}</div>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.mute, letterSpacing: '0.14em', marginTop: 6}}>{context.toUpperCase()}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 180, bottom: 220, height: 2, width: 500 * line, background: C.line}} />
    </Stage>
  );
};
