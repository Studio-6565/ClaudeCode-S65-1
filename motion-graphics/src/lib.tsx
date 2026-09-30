import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Design tokens. Everything is laid out on a 1920x1080 grid and rendered at scale 2 (3840x2160).
export const C = {
  bg: '#0C0B0A',
  card: '#161513',
  card2: '#1E1C1A',
  ink: '#F3EEE4',
  mute: '#8B867D',
  dim: '#3A3733',
  line: '#2B2926',
  red: '#FF3B2F',
  redDeep: '#7A1C16',
};

export const F = {
  serif: '"Instrument Serif", Georgia, serif',
  sans: 'Inter, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", Menlo, monospace',
};

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const lerp = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = EASE,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const useS = (delay = 0, damping = 200, mass = 1) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass}});
};

export const FontGate: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 40px Inter'),
      document.fonts.load('500 40px Inter'),
      document.fonts.load('600 40px Inter'),
      document.fonts.load('700 40px Inter'),
      document.fonts.load('400 40px "Instrument Serif"'),
      document.fonts.load('italic 400 40px "Instrument Serif"'),
      document.fonts.load('400 40px "JetBrains Mono"'),
      document.fonts.load('500 40px "JetBrains Mono"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
  return null;
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

export const Stage: React.FC<{children: React.ReactNode; bg?: string; grain?: boolean}> = ({
  children,
  bg = C.bg,
  grain = true,
}) => (
  <AbsoluteFill style={{background: bg, fontFamily: F.sans, color: C.ink}}>
    <FontGate />
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.035), transparent 65%)'}}
    />
    {children}
    {grain && <Grain />}
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45))', pointerEvents: 'none'}}
    />
  </AbsoluteFill>
);

// Word-by-word masked rise. "/" forces a line break, *wrapped words* get the accent treatment.
export const Words: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  font?: string;
  color?: string;
  accent?: string;
  weight?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  italicAccent?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  size = 80,
  font = F.serif,
  color = C.ink,
  accent = C.red,
  weight = 400,
  lineHeight = 1.08,
  align = 'left',
  italicAccent = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let on = false;
  const tokens = text.split(' ').map((t) => {
    if (t === '/') return {br: true, w: '', em: false};
    let em = on;
    if (t.startsWith('*')) {
      em = true;
      on = true;
    }
    if (t.slice(1).includes('*')) on = false;
    return {br: false, w: t.replace(/\*/g, ''), em};
  });
  let idx = 0;
  return (
    <div style={{fontFamily: font, fontSize: size, lineHeight, color, fontWeight: weight, textAlign: align, ...style}}>
      {tokens.map((t, i) => {
        if (t.br) return <br key={i} />;
        const s = spring({frame: frame - delay - idx++ * stagger, fps, config: {damping: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'top',
              padding: '0.06em 0.08em 0.12em 0.02em',
              margin: '-0.06em 0.14em -0.12em -0.02em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 110}%)`,
                color: t.em ? accent : undefined,
                fontStyle: t.em && italicAccent && font === F.serif ? 'italic' : undefined,
              }}
            >
              {t.w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{children: React.ReactNode; delay?: number; color?: string; dot?: boolean}> = ({
  children,
  delay = 0,
  color = C.mute,
  dot = true,
}) => {
  const s = useS(delay);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 22,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: s,
        transform: `translateY(${(1 - s) * 14}px)`,
      }}
    >
      {dot && (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: C.red,
            opacity: 0.55 + 0.45 * Math.cos(frame / 9),
          }}
        />
      )}
      {children}
    </div>
  );
};

// Red strike line that draws across whatever it wraps.
export const Strike: React.FC<{children: React.ReactNode; progress: number; color?: string; thickness?: number}> = ({
  children,
  progress,
  color = C.red,
  thickness = 0.07,
}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    {children}
    <span
      style={{
        position: 'absolute',
        left: '-3%',
        top: '54%',
        width: '106%',
        height: `${thickness}em`,
        background: color,
        transform: `scaleX(${progress})`,
        transformOrigin: 'left center',
        borderRadius: 4,
      }}
    />
  </span>
);

export const Typed: React.FC<{text: string; start: number; cps?: number; caret?: boolean; style?: React.CSSProperties}> = ({
  text,
  start,
  cps = 2,
  caret = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) * cps)));
  const done = n >= text.length;
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && frame >= start && (
        <span style={{opacity: done ? (blink ? 1 : 0) : 1, color: C.red, marginLeft: 2}}>|</span>
      )}
    </span>
  );
};

export const Avatar: React.FC<{size?: number; warm?: boolean; style?: React.CSSProperties}> = ({
  size = 120,
  warm = true,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      overflow: 'hidden',
      background: warm
        ? 'radial-gradient(circle at 30% 25%, #F7C59F, #D9774F 55%, #8E3322)'
        : 'radial-gradient(circle at 30% 25%, #5A5752, #2E2C29)',
      position: 'relative',
      flexShrink: 0,
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        width: size * 0.38,
        height: size * 0.38,
        borderRadius: size,
        left: size * 0.31,
        top: size * 0.2,
        background: warm ? 'rgba(255,240,225,0.85)' : 'rgba(160,155,148,0.6)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: size * 0.74,
        height: size * 0.5,
        borderRadius: `${size}px ${size}px 0 0`,
        left: size * 0.13,
        top: size * 0.64,
        background: warm ? 'rgba(255,240,225,0.85)' : 'rgba(160,155,148,0.6)',
      }}
    />
  </div>
);

export const Pill: React.FC<{children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties}> = ({
  children,
  color = C.ink,
  bg = C.card2,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 26px',
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: F.sans,
      fontWeight: 600,
      fontSize: 30,
      border: `1px solid ${C.line}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// A generic social post in a phone frame. `label` renders under the handle (e.g. "Paid partnership").
export const Phone: React.FC<{
  label?: React.ReactNode;
  caption?: React.ReactNode;
  overlay?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({label, caption, overlay, style}) => (
  <div
    style={{
      width: 460,
      height: 940,
      borderRadius: 68,
      background: '#050505',
      padding: 14,
      boxShadow: '0 50px 140px rgba(0,0,0,0.7)',
      border: '1px solid #2a2826',
      ...style,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 56,
        overflow: 'hidden',
        background: '#121110',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{height: 70}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px 18px'}}>
        <Avatar size={64} />
        <div>
          <div style={{fontWeight: 600, fontSize: 24}}>maya.mornings</div>
          <div style={{fontSize: 19, color: C.mute, minHeight: 24}}>{label}</div>
        </div>
      </div>
      <div
        style={{
          height: 520,
          background: 'linear-gradient(160deg, #F2C9A8 0%, #E4936B 45%, #A9472F 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 170,
            top: 140,
            width: 110,
            height: 250,
            borderRadius: '30px 30px 22px 22px',
            background: 'linear-gradient(180deg, #FFF7EE, #F0DCC8)',
            boxShadow: '0 30px 60px rgba(90,20,10,0.35)',
          }}
        />
        <div
          style={{position: 'absolute', left: 195, top: 105, width: 60, height: 48, borderRadius: 10, background: '#2B1B16'}}
        />
        <div
          style={{
            position: 'absolute',
            left: 185,
            top: 240,
            width: 80,
            height: 6,
            borderRadius: 3,
            background: 'rgba(120,50,30,0.35)',
          }}
        />
        {overlay}
      </div>
      <div style={{display: 'flex', gap: 18, padding: '22px 24px 10px'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 34, height: 34, borderRadius: 10, border: `3px solid ${C.ink}`, opacity: 0.8}} />
        ))}
      </div>
      <div style={{padding: '4px 24px', fontSize: 21, lineHeight: 1.4, color: C.ink}}>{caption}</div>
    </div>
  </div>
);

export const Check: React.FC<{p: number; size?: number}> = ({p, size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{flexShrink: 0}}>
    <rect x="2" y="2" width="40" height="40" rx="10" fill={p > 0 ? C.red : 'none'} stroke={C.red} strokeWidth="3" opacity={Math.min(1, p * 2)} />
    <path
      d="M12 23 L19 30 L32 15"
      fill="none"
      stroke={C.bg}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="40"
      strokeDashoffset={40 * (1 - p)}
    />
  </svg>
);

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// Transparent-background wrapper for overlays rendered with alpha (ProRes 4444).
export const Overlay: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{fontFamily: F.sans, color: C.ink}}>
    <FontGate />
    {children}
  </AbsoluteFill>
);
