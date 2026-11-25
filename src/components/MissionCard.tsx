import { useEffect, useRef, useState } from 'react'
import { useApp } from '../App'
import type { Mission } from '../content'
import { dayCount, savedMoney, won } from '../store'
import { Icon } from './ui'

// 4-7-8 호흡: 들이쉬기 4초, 참기 7초, 내쉬기 8초
const PHASES = [
  { t: '들이쉬기', s: 4, scale: 1.35 },
  { t: '참기', s: 7, scale: 1.35 },
  { t: '내쉬기', s: 8, scale: 0.8 },
]
const ROUNDS = 2

function useTicker(active: boolean, onTick: () => void) {
  const cb = useRef(onTick)
  cb.current = onTick
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => cb.current(), 1000)
    return () => clearInterval(t)
  }, [active])
}

function Bar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 10, borderRadius: 5, background: 'var(--soft)', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: 'var(--ac)', transition: 'width 1s linear' }} />
    </div>
  )
}

function Breath({ onDone, vibrate }: { onDone: () => void; vibrate: boolean }) {
  const [st, setSt] = useState({ round: 0, i: 0, left: PHASES[0].s })
  const finished = st.round >= ROUNDS
  useTicker(!finished, () =>
    setSt((p) => {
      if (p.left > 1) return { ...p, left: p.left - 1 }
      const ni = (p.i + 1) % 3
      return { round: p.round + (ni === 0 ? 1 : 0), i: ni, left: PHASES[ni].s }
    }),
  )
  useEffect(() => {
    if (finished) onDone()
  }, [finished, onDone])
  useEffect(() => {
    if (vibrate && navigator.vibrate) navigator.vibrate(st.i === 0 ? 200 : st.i === 2 ? [100, 100, 100] : 0)
  }, [st.i, vibrate])
  const ph = PHASES[st.i]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <span style={{ width: 60, height: 60, borderRadius: 30, background: 'var(--tint)', transform: `scale(${ph.scale})`, transition: `transform ${ph.s}s ease-in-out`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--ac)', transform: `scale(${1 / ph.scale})` }}>{st.left}</span>
        </span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 900 }} aria-live="polite">{ph.t}</div>
        <div className="cap" style={{ marginTop: 4 }}>{Math.min(st.round + 1, ROUNDS)} / {ROUNDS}번째</div>
      </div>
    </div>
  )
}

function Countdown({ seconds, label, onDone }: { seconds: number; label: string; onDone: () => void }) {
  const [left, setLeft] = useState(seconds)
  useTicker(left > 0, () => setLeft((l) => l - 1))
  useEffect(() => {
    if (left <= 0) onDone()
  }, [left, onDone])
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--ac)', fontVariantNumeric: 'tabular-nums' }}>{left}초</span>
      </div>
      <Bar pct={((seconds - left) / seconds) * 100} />
    </div>
  )
}

function Steps({ steps, seconds, onDone }: { steps: string[]; seconds: number; onDone: () => void }) {
  const [st, setSt] = useState({ i: 0, left: seconds })
  const finished = st.i >= steps.length
  useTicker(!finished, () => setSt((p) => (p.left > 1 ? { ...p, left: p.left - 1 } : { i: p.i + 1, left: seconds })))
  useEffect(() => {
    if (finished) onDone()
  }, [finished, onDone])
  if (finished) return null
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {steps.map((_, i) => (
          <span key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < st.i ? 'var(--ac)' : i === st.i ? '#F8C29A' : 'var(--soft)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span key={st.i} className="fade-in" style={{ fontSize: 18, fontWeight: 800 }}>{steps[st.i]}</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--ac)', fontVariantNumeric: 'tabular-nums' }}>{st.left}</span>
      </div>
    </div>
  )
}

export default function MissionCard({ mission, index, onDone }: { mission: Mission; index: number; onDone: () => void }) {
  const { data, session, go } = useApp()
  const [started, setStarted] = useState(false)
  const [note, setNote] = useState('')
  const p = data.profile

  const start = async () => {
    if (mission.kind === 'tap') return onDone()
    if (mission.kind === 'game') return go('game')
    if (mission.kind === 'share') {
      const text = `나 지금 담배 생각 참는 중! 3분만 응원해줘`
      try {
        if (navigator.share) await navigator.share({ text })
        else {
          await navigator.clipboard.writeText(text)
          setNote('메시지를 복사했어. 친구한테 붙여넣기!')
        }
        onDone()
      } catch {
        setNote('보내기를 취소했어. 다시 눌러도 돼')
      }
      return
    }
    setStarted(true)
  }

  let body: React.ReactNode = null
  if (started) {
    if (mission.kind === 'breath') body = <Breath onDone={onDone} vibrate={data.settings.vibrate} />
    if (mission.kind === 'timer') body = <Countdown seconds={mission.seconds ?? 30} label={mission.doing ?? ''} onDone={onDone} />
    if (mission.kind === 'steps') body = <Steps steps={mission.steps ?? []} seconds={mission.seconds ?? 10} onDone={onDone} />
    if (mission.kind === 'reasons')
      body = (
        <div>
          <div className="tags" style={{ marginBottom: 14 }}>
            {(p?.reasons.length ? p.reasons : ['건강', '돈']).map((r) => (
              <span key={r} className="tag on" style={{ fontSize: 16 }}>{r}</span>
            ))}
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6 }}>
            벌써 <b>{dayCount(p)}일</b> 버텼고 <b>{won(savedMoney(p))}</b> 아꼈어.
            <br />
            여기서 무너지면 아깝잖아.
          </p>
          <div style={{ marginTop: 14 }}>
            <Countdown seconds={mission.seconds ?? 8} label="천천히 다시 읽어보기" onDone={onDone} />
          </div>
        </div>
      )
  }
  if (mission.kind === 'game') {
    const n = session?.bubbles ?? 0
    const t = mission.target ?? 15
    body = (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 16, fontWeight: 700 }}>
          <span>터뜨린 방울</span>
          <span style={{ color: 'var(--ac)', fontWeight: 900 }}>{Math.min(n, t)} / {t}</span>
        </div>
        <Bar pct={(Math.min(n, t) / t) * 100} />
      </div>
    )
  }

  const showButton = !started || mission.kind === 'game'
  return (
    <div className="fade-in" key={mission.id} style={{ background: 'var(--card)', borderRadius: 26, padding: '20px 20px 20px 22px' }}>
      <div className="cap" style={{ color: 'var(--ac)' }}>미션 {index + 1}</div>
      <h2 style={{ marginTop: 6, fontSize: 24, lineHeight: 1.35, whiteSpace: 'pre-line' }}>{mission.title}</h2>
      {body && <div style={{ marginTop: 18 }}>{body}</div>}
      {note && <p style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--deep)' }}>{note}</p>}
      {showButton && (
        <button className="btn" style={{ marginTop: 18, height: 52 }} onClick={start}>
          {mission.kind === 'share' && <Icon name="arrow" size={18} width={2.2} />}
          <span style={{ marginLeft: mission.kind === 'share' ? 8 : 0 }}>{mission.cta}</span>
        </button>
      )}
    </div>
  )
}
