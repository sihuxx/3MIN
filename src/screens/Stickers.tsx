import type { ReactNode } from 'react'
import { useApp } from '../App'
import { Icon, TopBar, useDesktop } from '../components/ui'
import { RECOVERY, stickers, xpOf } from '../store'

const LEVEL_NAMES = ['불씨', '반짝', '활활', '이글이글', '횃불']

// 스티커 시트 위 자리 (x, y, 회전)
const SPOTS: [number, number, number][] = [
  [6, 6, -8],
  [37, 22, 6],
  [66, 44, -5],
  [8, 46, 9],
  [68, 4, 4],
  [38, 72, -6],
  [8, 78, 7],
  [68, 78, -4],
]

function art(id: string): { bg: string; shape: string; inner: ReactNode } {
  const t = (s: string, c = 'var(--ac)') => <span style={{ fontSize: 20, fontWeight: 900, color: c }}>{s}</span>
  const moon = (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="var(--ac)" aria-hidden="true">
      <path d="M15 3 A9 9 0 1 0 21 15 A7 7 0 1 1 15 3 Z" />
    </svg>
  )
  switch (id) {
    case 'first': return { bg: 'var(--ac)', shape: '50%', inner: t('첫!', '#fff') }
    case 'three': return { bg: '#fff', shape: '22px', inner: t('3일') }
    case 'wave': return { bg: '#FBD9BF', shape: '60% 40% 55% 45% / 50% 60% 40% 50%', inner: <Icon name="wave" color="var(--ac)" size={32} width={2.4} /> }
    case 'night': return { bg: '#fff', shape: '50%', inner: moon }
    case 'seven': return { bg: '#F8C29A', shape: '18px', inner: t('7일', 'var(--ink)') }
    case 'game': return { bg: '#fff', shape: '50%', inner: t('팡!') }
    case 'refuse': return { bg: 'var(--ac)', shape: '40% 60% 50% 50%', inner: t('NO', '#fff') }
    default: return { bg: '#FBD9BF', shape: '50%', inner: t('30') }
  }
}

export default function Stickers() {
  const { data, go } = useApp()
  const list = stickers(data)
  const got = list.filter((s) => s.got).length
  const xp = xpOf(data)
  const level = Math.min(LEVEL_NAMES.length, Math.floor(xp / 100) + 1)
  const toNext = level >= LEVEL_NAMES.length ? 0 : level * 100 - xp

  const hours = data.profile ? (Date.now() - new Date(data.profile.startDate).getTime()) / 3600000 : 0
  const nextIdx = RECOVERY.findIndex((r) => r.hours > hours)
  const next = nextIdx === -1 ? null : RECOVERY[nextIdx]
  const prevHours = nextIdx > 0 ? RECOVERY[nextIdx - 1].hours : 0
  const pct = next ? Math.min(100, ((hours - prevHours) / (next.hours - prevHours)) * 100) : 100
  const leftText = (h: number) => (h < 1 ? `${Math.ceil(h * 60)}분` : h < 48 ? `${Math.ceil(h)}시간` : `${Math.ceil(h / 24)}일`)
  const done = RECOVERY.filter((r) => r.hours <= hours)
  const desk = useDesktop()

  return (
    <div className="screen fade-in">
      <TopBar onBack={() => go('record')} />
      <div className={desk ? 'desk-grid' : ''} style={desk ? { marginTop: 8 } : undefined}>
      <div>
      <div className="pad">
        <h1 style={{ fontSize: 32 }}>스티커 {got}장</h1>
        <p style={{ marginTop: 6, fontSize: 15, color: '#5C4636' }}>
          Lv.{level} {LEVEL_NAMES[level - 1]}
          {toNext > 0 && (
            <>
              {' '}· 다음 레벨까지 <b style={{ color: 'var(--ink)' }}>{Math.ceil(toNext / 10)}번</b> 더 버티기
            </>
          )}
        </p>
      </div>
      <div style={{ position: 'relative', height: desk ? 460 : 400, margin: desk ? '22px 0 0' : '22px 20px 0', background: 'var(--tint)', borderRadius: 32, flex: 'none' }}>
        {list.map((s, i) => {
          const [x, y, r] = SPOTS[i]
          if (!s.got)
            return (
              <span key={s.id} aria-label={`${s.label} 아직 못 받음`} style={{ position: 'absolute', left: `${x + 3}%`, top: `${y + 2}%`, width: 58, height: 58, borderRadius: '50%', background: '#F7D4B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#E9B48C' }}>
                ?
              </span>
            )
          const a = art(s.id)
          return (
            <div key={s.id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `rotate(${r}deg)` }}>
              <span style={{ width: 78, height: 78, borderRadius: a.shape, background: a.bg, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.inner}</span>
              <span style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
          )
        })}
      </div>
      </div>
      {data.profile?.mode !== 'prevent' && (
        <div className={desk ? '' : 'pad'} style={{ paddingTop: desk ? 110 : 28, paddingBottom: 34 }}>
          <p className="cap">몸이 회복되는 중</p>
          <p style={{ marginTop: 8, fontSize: desk ? 32 : 23, fontWeight: 800, lineHeight: 1.4 }}>
            {next ? (
              <>
                {leftText(next.hours - hours)}만 더 버티면
                <br />
                <span style={{ color: 'var(--ac)' }}>{next.key}</span>
                {next.rest}
              </>
            ) : (
              <>1년을 버텼어. 심장이 훨씬 건강해졌어</>
            )}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 5, background: 'var(--soft)' }}>
              <div style={{ width: `${pct}%`, height: 10, borderRadius: 5, background: 'var(--ac)' }} />
            </div>
            {next && <span style={{ fontSize: 14, fontWeight: 800 }}>{next.short}</span>}
          </div>
          {done.length > 0 && (
            <p style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, fontWeight: 700, color: 'var(--mute)' }}>
              {done.map((r) => (
                <span key={r.short} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="check" color="var(--ac)" size={16} width={2.6} />
                  {r.label}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
