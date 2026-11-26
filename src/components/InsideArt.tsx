import { useState } from 'react'
import { sfx } from '../sfx'

// 성분 까보기 그림들 (주황 톤만 사용)
const INK = '#3B2A20'
const OR = '#E06A1F'
const PRI = '#F59A52'
const LIGHT = '#FBD9BF'
const SMOKE = '#E9DCCD'

// 담배 종류 그림 + '속 까보기' 하면 연기 속에서 성분 이름이 떠오름
export function ProductArt({ id, open, chems, onTap }: { id: string; open: boolean; chems: string[]; onTap?: () => void }) {
  // 열리면 성분 이름이 연기처럼 담배 끝에서 하나씩 피어올라 흔들리며 사라짐 (줄을 나눠서 안 겹치게)
  const tipX = id === 'cig' ? 76 : id === 'heat' ? 68 : 56
  const dur = 5
  const lanes = [-14, 4, -4, 14, -10, 10]
  const tap = () => {
    sfx.pop()
    onTap?.()
  }
  return (
    <button onClick={tap} aria-label="그림 누르면 성분 연기 보기" style={{ position: 'relative', display: 'block', width: '100%', height: 132, marginTop: 6, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', overflow: 'visible' }}>
      {open &&
        chems.map((c, i) => (
          <span
            key={c}
            className="smoke-word"
            style={{
              position: 'absolute',
              left: `${tipX + lanes[i % lanes.length]}%`,
              top: 70,
              zIndex: 3,
              animationDuration: `${dur}s`,
              animationDelay: `${(i * dur) / chems.length}s`,
              fontSize: 13,
              fontWeight: 900,
              padding: '5px 11px',
              borderRadius: 14,
              background: 'rgba(241,230,218,.92)',
              color: 'var(--deep)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {c}
          </span>
        ))}
      {!open && (
        <span className="pulse-dot" style={{ position: 'absolute', left: `${tipX}%`, top: '64%', width: 14, height: 14, marginLeft: -7, borderRadius: 7, background: 'var(--ac)', pointerEvents: 'none' }} />
      )}
      <svg viewBox="0 0 240 132" width="100%" height="132" aria-hidden="true" style={{ display: 'block' }}>
        {/* 연기 */}
        <g fill={SMOKE} opacity={open ? 1 : 0.7}>
          <circle cx={id === 'cig' ? 196 : 168} cy="58" r="16" />
          <circle cx={id === 'cig' ? 212 : 186} cy="40" r="20" />
          <circle cx={id === 'cig' ? 196 : 166} cy="26" r="14" />
          {id === 'vape' && <circle cx="204" cy="56" r="13" />}
        </g>
        {id === 'cig' && (
          <g>
            <rect x="20" y="86" width="150" height="20" rx="4" fill="#F3E6D8" />
            <rect x="20" y="86" width="44" height="20" rx="4" fill={PRI} />
            <path d="M30 90 h4 M42 96 h4 M34 101 h4 M50 92 h4" stroke={OR} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="166" y="86" width="12" height="20" rx="3" fill={OR} />
            <circle cx="178" cy="96" r="5" fill="#FFC46B" />
            <path d="M184 80 q8 -10 2 -20" fill="none" stroke={SMOKE} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {id === 'heat' && (
          <g>
            <rect x="40" y="72" width="104" height="42" rx="21" fill={PRI} />
            <rect x="54" y="84" width="40" height="8" rx="4" fill="#fff" opacity=".6" />
            <circle cx="118" cy="93" r="6" fill="#fff" opacity=".8" />
            <rect x="140" y="82" width="22" height="22" rx="4" fill="#F3E6D8" />
            <rect x="140" y="82" width="8" height="22" rx="3" fill={LIGHT} />
            <path d="M162 76 q8 -10 2 -20" fill="none" stroke={SMOKE} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {id === 'vape' && (
          <g>
            <rect x="96" y="58" width="40" height="64" rx="14" fill={PRI} />
            <rect x="104" y="40" width="24" height="24" rx="8" fill={OR} />
            <rect x="110" y="30" width="12" height="14" rx="5" fill={INK} opacity=".75" />
            <rect x="104" y="74" width="24" height="26" rx="6" fill="#fff" opacity=".55" />
            {/* 과일 향 */}
            <g transform="translate(36 76)">
              <path d="M18 6 C30 6 34 20 26 32 C22 38 14 38 10 32 C2 20 6 6 18 6 Z" fill="#F05A5A" />
              <path d="M12 6 L18 0 L24 6 Z" fill="#7BB661" />
              <circle cx="14" cy="18" r="1.6" fill="#FFE2A8" />
              <circle cx="22" cy="16" r="1.6" fill="#FFE2A8" />
              <circle cx="18" cy="26" r="1.6" fill="#FFE2A8" />
            </g>
            <path d="M136 44 q10 -6 18 2" fill="none" stroke={SMOKE} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </button>
  )
}

// 성분이 '또 들어있는 곳' 그림
export function ThingArt({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      {name === '일산화탄소' && (
        <g>
          <circle cx="10" cy="22" r="6" fill={SMOKE} />
          <circle cx="6" cy="32" r="4" fill={SMOKE} />
          <path d="M14 40 L18 28 Q20 24 25 24 H44 Q49 24 51 28 L56 38 V46 H14 Z" fill={PRI} />
          <path d="M23 29 H33 V37 H20 Z M37 29 H46 L50 37 H37 Z" fill="#fff" opacity=".8" />
          <circle cx="24" cy="47" r="6" fill={INK} opacity=".8" />
          <circle cx="47" cy="47" r="6" fill={INK} opacity=".8" />
          <rect x="10" y="40" width="6" height="4" rx="2" fill={OR} />
        </g>
      )}
      {name === '니코틴' && (
        <g>
          <rect x="24" y="8" width="18" height="10" rx="3" fill={OR} />
          <path d="M42 10 H52 V14 H42 Z" fill={OR} />
          <circle cx="57" cy="9" r="1.6" fill={SMOKE} />
          <circle cx="60" cy="14" r="1.6" fill={SMOKE} />
          <rect x="28" y="18" width="10" height="6" fill={PRI} />
          <path d="M22 24 H44 Q48 24 48 28 V54 Q48 58 44 58 H22 Q18 58 18 54 V28 Q18 24 22 24 Z" fill={PRI} />
          <rect x="22" y="34" width="22" height="14" rx="3" fill="#fff" opacity=".8" />
          <path d="M27 41 h12" stroke={OR} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {name === '타르' && (
        <g>
          <path d="M8 14 H56 V20 Q52 20 50 26 Q48 34 44 26 Q42 20 38 22 Q34 24 34 34 Q34 46 30 46 Q26 46 26 34 Q26 24 22 22 Q18 20 16 26 Q14 32 12 26 Q10 20 8 20 Z" fill="#8A4B22" />
          <ellipse cx="30" cy="52" rx="5" ry="6" fill="#8A4B22" />
          <path d="M14 16 H26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".5" />
        </g>
      )}
      {name === '벤젠' && (
        <g>
          <rect x="18" y="14" width="10" height="8" rx="2" fill={OR} />
          <path d="M14 20 H44 L52 28 V54 Q52 56 50 56 H16 Q14 56 14 54 Z" fill={PRI} />
          <path d="M22 32 L42 48 M42 32 L22 48" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
          <path d="M34 14 H46 L50 20" fill="none" stroke={OR} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {name === '포름알데히드' && (
        <g>
          <rect x="24" y="8" width="16" height="8" rx="3" fill={OR} />
          <path d="M26 16 H38 V26 L50 50 Q52 56 46 56 H18 Q12 56 14 50 L26 26 Z" fill="#fff" />
          <path d="M19 42 H45 L49 50 Q50 54 46 54 H18 Q14 54 15 50 Z" fill={PRI} />
          <circle cx="28" cy="36" r="2.5" fill={LIGHT} />
          <circle cx="36" cy="32" r="2" fill={LIGHT} />
        </g>
      )}
      {name === '카드뮴' && (
        <g>
          <rect x="26" y="8" width="12" height="6" rx="2" fill={INK} opacity=".7" />
          <rect x="18" y="13" width="28" height="44" rx="7" fill={PRI} />
          <rect x="18" y="13" width="28" height="14" rx="7" fill={OR} />
          <path d="M34 32 L27 44 H33 L30 53 L38 40 H32 Z" fill="#fff" />
        </g>
      )}
    </svg>
  )
}

// 몸 지도: 부위를 누르면 담배가 그곳에 하는 일
export const BODY = [
  { id: 'brain', name: '뇌', x: 100, y: 34, title: '7초 만에 뇌로', text: '니코틴은 피우고 7초 만에 뇌에 도착해. 뇌는 20대 중반까지 자라서, 청소년 때 니코틴은 집중력과 기억력에 더 큰 영향을 줄 수 있어', src: '국민건강보험공단, 미국 CDC' },
  { id: 'mouth', name: '입', x: 100, y: 66, title: '누런 이, 붓는 잇몸', text: '치아가 누렇게 변하고 잇몸병이 잘 생겨. 입·목 안쪽 암 위험도 높아져', src: '호주 Cancer Council' },
  { id: 'lung', name: '폐', x: 82, y: 128, title: '숨이 차고 기침이 나', text: '폐암 대부분이 흡연 때문이야. 기관지염, 숨길이 좁아지는 만성폐쇄성폐질환(COPD)의 가장 큰 원인이기도 해', src: '국민건강보험공단' },
  { id: 'heart', name: '심장', x: 112, y: 140, title: '심장이 더 빨리 뛰어', text: '니코틴이 혈압과 맥박을 올리고, 일산화탄소가 피 속 산소를 밀어내서 심장이 더 힘들게 일해', src: '국민건강보험공단' },
  { id: 'skin', name: '피부', x: 146, y: 176, title: '피부가 빨리 늙어', text: '피가 잘 안 돌아서 피부가 칙칙해지고 주름이 빨리 생겨. 상처도 늦게 나아', src: '호주 Cancer Council' },
  { id: 'leg', name: '다리', x: 84, y: 232, title: '체력이 떨어져', text: '산소가 덜 가니까 조금만 뛰어도 숨이 차. 체육 시간이나 계단에서 바로 느껴져', src: '국민건강보험공단' },
]

export function BodyMap() {
  const [on, setOn] = useState<string | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const cur = BODY.find((b) => b.id === on)
  const pick = (id: string) => {
    setOn(id)
    if (!seen.includes(id)) setSeen([...seen, id])
    sfx.step()
  }
  const hot = (id: string) => on === id
  const fill = (id: string, base: string) => (hot(id) ? OR : base)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ fontSize: 18 }}>담배가 몸에 하는 일</h2>
        <span className="cap">{seen.length}/{BODY.length} 확인</span>
      </div>
      <div style={{ marginTop: 12, background: 'var(--tint)', borderRadius: 28, padding: '16px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 280" width="100%" style={{ maxWidth: 260, display: 'block' }} role="img" aria-label="사람 몸 그림">
          {/* 몸 */}
          <g fill="#FFF3E6">
            <circle cx="100" cy="44" r="32" />
            <rect x="90" y="72" width="20" height="14" />
            <path d="M58 92 Q58 84 70 84 H130 Q142 84 142 92 L146 190 Q146 198 138 198 H62 Q54 198 54 190 Z" />
            <path d="M58 92 L36 168 Q34 178 42 180 Q48 181 50 174 L66 112 Z" />
            <path d="M142 92 L164 168 Q166 178 158 180 Q152 181 150 174 L134 112 Z" />
            <path d="M66 196 H98 L96 262 Q96 270 86 270 Q76 270 76 262 Z" />
            <path d="M134 196 H102 L104 262 Q104 270 114 270 Q124 270 124 262 Z" />
          </g>
          {/* 장기 */}
          <path d="M80 30 Q80 14 100 14 Q120 14 120 30 Q124 42 114 46 H86 Q76 42 80 30 Z" fill={fill('brain', '#F8C29A')} />
          <path d="M88 64 Q100 74 112 64" fill="none" stroke={fill('mouth', '#E8A47A')} strokeWidth="4" strokeLinecap="round" />
          <circle cx="88" cy="48" r="3" fill="#C9A58A" />
          <circle cx="112" cy="48" r="3" fill="#C9A58A" />
          <path d="M96 96 V112 M96 112 L84 120 M104 96 V112 M104 112 L116 120" stroke={fill('lung', '#E8A47A')} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M70 118 Q70 104 82 108 Q92 112 92 128 V156 Q92 164 82 162 Q70 158 70 146 Z" fill={fill('lung', '#F8C29A')} />
          <path d="M130 118 Q130 104 118 108 Q108 112 108 128 V156 Q108 164 118 162 Q130 158 130 146 Z" fill={fill('lung', '#F8C29A')} />
          <path d="M112 152 C100 144 98 136 104 132 C108 129 112 132 112 135 C112 132 116 129 120 132 C126 136 124 144 112 152 Z" fill={fill('heart', '#F2A672')} />
          <path d="M140 160 Q148 172 144 190" fill="none" stroke={fill('skin', '#EFD7C2')} strokeWidth="8" strokeLinecap="round" />
          <path d="M80 214 V250 M120 214 V250" stroke={fill('leg', '#EFD7C2')} strokeWidth="8" strokeLinecap="round" />
          {/* 누르는 점 */}
          {BODY.map((b) => (
            <g key={b.id} onClick={() => pick(b.id)} style={{ cursor: 'pointer', outline: 'none' }} role="button" aria-label={`${b.name} 보기`} tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(b.id)}>
              <circle cx={b.x} cy={b.y} r="18" fill="transparent" />
              {!seen.includes(b.id) && <circle cx={b.x} cy={b.y} r="9" fill={OR} opacity=".35" className="ring" />}
              <circle cx={b.x} cy={b.y} r={hot(b.id) ? 8 : 6} fill={hot(b.id) ? '#fff' : OR} stroke={OR} strokeWidth={hot(b.id) ? 3 : 0} />
            </g>
          ))}
        </svg>
        <div key={on ?? 'none'} className="fade-in" style={{ width: '100%', marginTop: 10, background: 'var(--card)', borderRadius: 20, padding: '14px 16px', minHeight: 112 }}>
          {cur ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--ac)' }}>{cur.name}</div>
              <div style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>{cur.title}</div>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.55, marginTop: 6, color: '#5C4636' }}>{cur.text}</p>
              <p className="cap" style={{ fontSize: 11, marginTop: 6 }}>출처 · {cur.src}</p>
            </>
          ) : (
            <p style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.5, paddingTop: 22, textAlign: 'center' }}>몸 위의 주황 점을 눌러봐</p>
          )}
        </div>
      </div>
    </div>
  )
}
