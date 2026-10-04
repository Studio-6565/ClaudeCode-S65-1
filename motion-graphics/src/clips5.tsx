// Pack 3 — "card" versions: a graphic shrunk into a rounded card on the right of the frame, over a
// transparent left side so the presenter stays on screen. Rendered with alpha.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FlatStage, Overlay, lerp, useS} from './lib';

// Card geometry on the 1920x1080 grid: 55% wide, right-aligned, vertically centred.
const SCALE = 0.55;
const W = 1920 * SCALE;
const H = 1080 * SCALE;
const RIGHT = 72;
const LEFT = 1920 - RIGHT - W;
const TOP = (1080 - H) / 2;

export const Card: React.FC<{inner: React.FC<any>; innerProps?: any}> = ({inner: Inner, innerProps}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inn = useS(0, 18);
  const out = lerp(f, durationInFrames - 10, durationInFrames - 1, 0, 1);
  const x = (1 - inn) * 260 + out * 260;
  const o = Math.min(inn * 1.4, 1) * (1 - out);
  return (
    <Overlay>
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: TOP,
          width: W,
          height: H,
          borderRadius: 26,
          overflow: 'hidden',
          transform: `translateX(${x}px) scale(${interpolate(inn, [0, 1], [0.94, 1])})`,
          opacity: o,
          boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
          border: `1px solid ${C.line}`,
          background: C.bg,
        }}
      >
        <div style={{width: 1920, height: 1080, transform: `scale(${SCALE})`, transformOrigin: '0 0', position: 'relative'}}>
          <FlatStage.Provider value={true}>
            <Inner {...(innerProps ?? {})} />
          </FlatStage.Provider>
        </div>
      </div>
    </Overlay>
  );
};
