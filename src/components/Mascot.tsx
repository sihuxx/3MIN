// 마스코트 호롱이: 곁을 따뜻하게 지켜주는 작은 불꽃
export type Mood = 'happy' | 'calm' | 'cheer' | 'worried' | 'sleepy'

const MOTION: Record<Mood, { dur: string; hop: string; size: string; shadow: string; flick: string; flickDur: string }> = {
  happy: { dur: '1.8s', hop: '0 0;0 0;0 -12;0 0;0 0', size: '1 1;1.06 0.94;0.97 1.05;1.05 0.95;1 1', shadow: '44;50;36;50;44', flick: '0;5;-4;3;0', flickDur: '1.2s' },
  cheer: { dur: '0.9s', hop: '0 0;0 0;0 -20;0 0;0 0', size: '1 1;1.1 0.9;0.95 1.12;1.08 0.92;1 1', shadow: '44;52;30;52;44', flick: '0;9;-8;6;0', flickDur: '0.6s' },
  calm: { dur: '4s', hop: '0 0;0 0;0 0;0 0;0 0', size: '1 1;1 0.96;1 0.92;1 0.96;1 1', shadow: '44;44;44;44;44', flick: '0;2;-2;1;0', flickDur: '2.4s' },
  worried: { dur: '2s', hop: '0 0;0 0;0 0;0 0;0 0', size: '0.94 0.9;0.94 0.88;0.94 0.9;0.94 0.88;0.94 0.9', shadow: '42;42;42;42;42', flick: '0;6;-6;6;0', flickDur: '0.35s' },
  sleepy: { dur: '3.6s', hop: '0 0;0 0;0 0;0 0;0 0', size: '0.92 0.86;0.92 0.84;0.92 0.82;0.92 0.84;0.92 0.86', shadow: '42;42;42;42;42', flick: '0;3;-3;2;0', flickDur: '3s' },
}
const KT = '0;0.2;0.45;0.7;1'
const INK = '#3B2A20'
const line = (w: number) => ({ strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })
const blink = { values: '15;15;2;15;15;2;15', y: '126;126;133;126;126;133;126', keyTimes: '0;0.6;0.63;0.66;0.9;0.93;1' }

export default function Mascot({ mood = 'happy', size = 160, label = '마스코트 호롱이' }: { mood?: Mood; size?: number; label?: string }) {
  const m = MOTION[mood]
  const cheer = mood === 'cheer'
  const show = (b: boolean) => (b ? 1 : 0)
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={label} style={{ display: 'block', flex: 'none' }}>
      <ellipse cx="100" cy="193" rx="44" ry="5" fill={INK} opacity="0.08">
        <animate attributeName="rx" values={m.shadow} keyTimes={KT} dur={m.dur} repeatCount="indefinite" />
      </ellipse>
      <g>
        <animateTransform attributeName="transform" type="translate" values={m.hop} keyTimes={KT} dur={m.dur} repeatCount="indefinite" />
        <rect x="74" y="168" width="20" height="22" rx="10" fill="#E8732F" />
        <rect x="106" y="168" width="20" height="22" rx="10" fill="#E8732F" />
        <g transform="translate(100 186)">
          <g>
            <animateTransform attributeName="transform" type="scale" values={m.size} keyTimes={KT} dur={m.dur} repeatCount="indefinite" />
            <g transform="translate(-100 -186)">
              {!cheer && (
                <g fill="#FF8A3D">
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 50 140;-22 50 140;0 50 140" dur="1.2s" repeatCount="indefinite" />
                    <ellipse cx="38" cy="150" rx="12" ry="17" transform="rotate(-28 38 150)" />
                  </g>
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 150 140;22 150 140;0 150 140" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                    <ellipse cx="162" cy="150" rx="12" ry="17" transform="rotate(28 162 150)" />
                  </g>
                </g>
              )}
              {cheer && (
                <g fill="#FF8A3D">
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 50 128;26 50 128;0 50 128" dur="0.5s" repeatCount="indefinite" />
                    <ellipse cx="34" cy="112" rx="12" ry="17" transform="rotate(40 34 112)" />
                  </g>
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 150 128;-26 150 128;0 150 128" dur="0.5s" repeatCount="indefinite" />
                    <ellipse cx="166" cy="112" rx="12" ry="17" transform="rotate(-40 166 112)" />
                  </g>
                </g>
              )}
              <g transform="translate(100 184)">
                <g>
                  <animateTransform attributeName="transform" type="skewX" values={m.flick} dur={m.flickDur} repeatCount="indefinite" />
                  <g transform="translate(-100 -184)">
                    <path d="M100 18 C114 44 152 70 160 112 C168 152 140 184 100 184 C60 184 32 152 40 112 C45 88 62 74 70 54 C75 72 82 80 90 84 C88 62 92 40 100 18 Z" fill="#FF8A3D" />
                    <path d="M100 80 C114 98 138 116 138 146 C138 168 122 180 100 180 C78 180 62 168 62 146 C62 116 86 98 100 80 Z" fill="#FFC46B">
                      <animate attributeName="opacity" values="1;0.85;1" dur="0.9s" repeatCount="indefinite" />
                    </path>
                  </g>
                </g>
              </g>
              <ellipse cx="74" cy="152" rx="8" ry="5" fill="#F2603A" opacity="0.45" />
              <ellipse cx="126" cy="152" rx="8" ry="5" fill="#F2603A" opacity="0.45" />
              <g opacity={show(mood === 'happy' || mood === 'worried')} fill={INK}>
                {[84, 108].map((x) => (
                  <rect key={x} x={x} y="126" width="8" height="15" rx="4">
                    <animate attributeName="height" values={blink.values} keyTimes={blink.keyTimes} dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="y" values={blink.y} keyTimes={blink.keyTimes} dur="3.5s" repeatCount="indefinite" />
                  </rect>
                ))}
              </g>
              <g opacity={show(cheer)} fill="none" stroke={INK} style={line(3.5)}>
                <path d="M82 137 L88 130 L94 137" />
                <path d="M106 137 L112 130 L118 137" />
              </g>
              <g opacity={show(mood === 'calm' || mood === 'sleepy')} fill="none" stroke={INK} style={line(3.5)}>
                <path d="M82 133 Q88 139 94 133" />
                <path d="M106 133 Q112 139 118 133" />
              </g>
              <g opacity={show(mood === 'worried')} fill="none" stroke={INK} style={line(3)}>
                <path d="M81 118 L93 122" />
                <path d="M119 118 L107 122" />
              </g>
              {mood === 'happy' && <path d="M94 150 Q100 156 106 150" fill="none" stroke={INK} style={line(3.5)} />}
              {mood === 'calm' && (
                <ellipse cx="100" cy="152" rx="3.5" ry="4.5" fill="none" stroke={INK} strokeWidth="3">
                  <animate attributeName="ry" values="4.5;2;4.5" dur="4s" repeatCount="indefinite" />
                </ellipse>
              )}
              {cheer && <path d="M92 148 Q100 162 108 148 Z" fill={INK} />}
              {mood === 'worried' && <path d="M93 154 Q96.5 150 100 154 Q103.5 158 107 154" fill="none" stroke={INK} style={line(3)} />}
              {mood === 'sleepy' && <path d="M96 152 H104" fill="none" stroke={INK} style={line(3)} />}
            </g>
          </g>
        </g>
      </g>
      {cheer && (
        <g fill="#FFC46B">
          <circle cx="40" cy="50" r="5">
            <animate attributeName="cy" values="70;30" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="60" r="4">
            <animate attributeName="cy" values="80;36" dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1.1s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {mood === 'sleepy' && (
        <text x="150" y="40" fill="#E9B48C" style={{ font: '700 16px sans-serif' }}>
          z
          <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 8;6 -6" dur="2.4s" repeatCount="indefinite" />
        </text>
      )}
      {mood === 'worried' && (
        <path d="M156 80 C156 80 149 91 149 95 C149 99 152 102 156 102 C160 102 163 99 163 95 C163 91 156 80 156 80 Z" fill="#E9B48C">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 10;0 0" dur="1.4s" repeatCount="indefinite" />
        </path>
      )}
    </svg>
  )
}
