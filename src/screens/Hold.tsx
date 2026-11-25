import { useCallback, useEffect, useRef, useState } from 'react'
import { HOLD_SECONDS, useApp } from '../App'
import Mascot from '../components/Mascot'
import MissionCard from '../components/MissionCard'
import { Icon, useDesktop } from '../components/ui'
import { missionById } from '../content'

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function useRemaining() {
  const { session } = useApp()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [])
  if (!session) return 0
  return Math.max(0, HOLD_SECONDS - (now - session.startedAt) / 1000)
}

// 파도 소리: 브라운 노이즈를 천천히 커졌다 작아지게
function useWaveSound(on: boolean) {
  useEffect(() => {
    if (!on) return
    let ctx: AudioContext
    try {
      ctx = new AudioContext()
    } catch {
      return
    }
    const len = ctx.sampleRate * 4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const ch = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
      ch[i] = last * 3.5
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    const gain = ctx.createGain()
    gain.gain.value = 0.25
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.12
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.2
    lfo.connect(lfoGain).connect(gain.gain)
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start()
    lfo.start()
    return () => {
      ctx.close()
    }
  }, [on])
}

// 호롱이를 둘러싼 3분 원형 타이머
function Ring({ remaining, size, cheer }: { remaining: number; size: number; cheer: boolean }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  const pct = remaining / HOLD_SECONDS
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ac)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: 'stroke-dashoffset .25s linear' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mascot mood={cheer ? 'cheer' : 'calm'} size={size * 0.62} />
      </div>
    </div>
  )
}

export default function Hold() {
  const { session, setSession, go, data } = useApp()
  const remaining = useRemaining()
  const desk = useDesktop()
  const [sound, setSound] = useState(false)
  const [askEnd, setAskEnd] = useState(false)
  const [cheer, setCheer] = useState<string | null>(null)
  const cheerTimer = useRef<number | undefined>(undefined)
  useWaveSound(sound && data.settings.sound)

  useEffect(() => {
    if (!session) go('home')
    else if (remaining <= 0) go('result')
  }, [remaining, session, go])

  const complete = useCallback(
    (id: string) => {
      if (!session || session.done.includes(id)) return
      const done = [...session.done, id]
      const nextIdx = session.missions.findIndex((m) => !done.includes(m))
      setSession({ ...session, done, cur: nextIdx === -1 ? session.cur : nextIdx })
      setCheer(missionById(id).short)
      if (navigator.vibrate && data.settings.vibrate) navigator.vibrate([60, 40, 60])
      window.clearTimeout(cheerTimer.current)
      cheerTimer.current = window.setTimeout(() => setCheer(null), 1800)
    },
    [session, setSession, data.settings.vibrate],
  )

  // 게임 미션을 하고 돌아왔을 때 목표를 채웠으면 완료 처리
  useEffect(() => {
    if (!session) return
    const g = session.missions.find((id) => missionById(id).kind === 'game')
    if (g && !session.done.includes(g) && session.bubbles >= (missionById(g).target ?? 15)) complete(g)
  }, [session, complete])

  if (!session) return null
  const allDone = session.done.length >= session.missions.length
  const curId = session.missions[session.cur]
  const mission = missionById(curId)
  const onDone = () => complete(curId)

  const chips = (
    <div style={{ display: 'flex', gap: 8 }} role="tablist" aria-label="이번 미션">
      {session.missions.map((id, i) => {
        const m = missionById(id)
        const done = session.done.includes(id)
        const on = i === session.cur && !allDone
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            disabled={done}
            onClick={() => setSession({ ...session, cur: i })}
            style={{ flex: 1, minHeight: 46, border: 'none', borderRadius: 14, padding: '8px 6px', background: done ? 'var(--ac)' : on ? 'var(--card)' : 'rgba(255,255,255,.45)', color: done ? '#fff' : 'var(--ink)', fontSize: 13, fontWeight: on || done ? 800 : 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            {done && <Icon name="check" color="#fff" size={14} width={3} />}
            {m.short}
          </button>
        )
      })}
    </div>
  )

  const card = allDone ? (
    <div className="fade-in" style={{ background: 'var(--card)', borderRadius: 26, padding: 22 }}>
      <div className="cap" style={{ color: 'var(--ac)' }}>미션 완료</div>
      <h2 style={{ marginTop: 6, fontSize: 24, lineHeight: 1.35 }}>
        3개 다 해냈어!
        <br />
        남은 시간은 쉬어도 돼
      </h2>
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button className="btn2" style={{ flex: 1, height: 52 }} onClick={() => setSound(!sound)}>
          {sound ? '소리 끄기' : '파도 소리'}
        </button>
        <button className="btn" style={{ flex: 1, height: 52 }} onClick={() => go('result')}>
          지금 끝내기
        </button>
      </div>
    </div>
  ) : (
    <MissionCard key={curId} mission={mission} index={session.cur} onDone={onDone} />
  )

  const tools = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <button style={{ border: 'none', background: 'transparent', fontSize: 15, fontWeight: 700, minHeight: 44, color: sound ? 'var(--ac)' : 'var(--ink)' }} onClick={() => setSound(!sound)} aria-pressed={sound}>
        파도 소리{sound ? ' 켜짐' : ''}
      </button>
      <span style={{ color: '#D9B79A' }}>·</span>
      <button style={{ border: 'none', background: 'transparent', fontSize: 15, fontWeight: 700, minHeight: 44, color: 'var(--deep)' }} onClick={() => go('my')}>
        도움 받기
      </button>
    </div>
  )

  const timer = (big: boolean) => (
    <button onClick={() => setAskEnd(true)} aria-label={`남은 시간 ${mmss(remaining)}, 누르면 일찍 끝내기`} style={{ border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <Ring remaining={remaining} size={big ? 340 : 200} cheer={!!cheer} />
      <span style={{ fontSize: big ? 96 : 60, fontWeight: 900, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: big ? 12 : 6 }}>{mmss(remaining)}</span>
    </button>
  )

  const toast = cheer && (
    <div role="status" className="fade-in" style={{ position: 'fixed', left: '50%', top: 24, transform: 'translateX(-50%)', zIndex: 30, background: 'var(--deep)', color: '#fff', borderRadius: 999, padding: '12px 20px', fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {cheer} 완료! <span style={{ color: '#FFC46B' }}>+10XP</span>
    </div>
  )

  const endSheet = askEnd && (
    <div className="sheet" onClick={() => setAskEnd(false)}>
      <div onClick={(e) => e.stopPropagation()} className="fade-in">
        <h2 style={{ fontSize: 22, lineHeight: 1.4 }}>벌써 괜찮아졌어?</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn2" style={{ flex: 1 }} onClick={() => setAskEnd(false)}>
            더 버틸래
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={() => go('result')}>
            괜찮아졌어
          </button>
        </div>
      </div>
    </div>
  )

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: desk ? '28px 40px 0' : '16px 22px 0 28px' }}>
      <span style={{ fontSize: 14, fontWeight: 800 }}>
        미션 {session.done.length} / {session.missions.length}
      </span>
      <button className="icon-btn" style={{ justifyContent: 'flex-end' }} aria-label="그만하기" onClick={() => { setSession(null); go('home') }}>
        <Icon name="x" />
      </button>
    </div>
  )

  if (desk) {
    return (
      <div className="screen wide2" style={{ background: 'var(--tint)' }}>
        {header}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,440px)', gap: 64, alignItems: 'center', padding: '0 56px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{timer(true)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {chips}
            {card}
            {tools}
          </div>
        </div>
        {toast}
        {endSheet}
      </div>
    )
  }

  return (
    <div className="screen" style={{ background: 'var(--tint)' }}>
      {header}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>{timer(false)}</div>
      <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chips}
        {card}
      </div>
      <div style={{ marginTop: 'auto', padding: '14px 20px 26px' }}>{tools}</div>
      {toast}
      {endSheet}
    </div>
  )
}
