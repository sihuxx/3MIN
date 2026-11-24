import { useEffect, useRef, useState } from 'react'
import { HOLD_SECONDS, useApp } from '../App'
import Mascot from '../components/Mascot'
import { Icon } from '../components/ui'
import { MISSIONS } from '../content'

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
  const ref = useRef<AudioContext | null>(null)
  useEffect(() => {
    if (!on) return
    let ctx: AudioContext
    try {
      ctx = new AudioContext()
    } catch {
      return
    }
    ref.current = ctx
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

const BREATH = [
  { t: '들이쉬기', s: 4 },
  { t: '참기', s: 7 },
  { t: '내쉬기', s: 8 },
]

function Breath({ onClose, vibrate }: { onClose: () => void; vibrate: boolean }) {
  const [st, setSt] = useState({ i: 0, left: BREATH[0].s })
  const i = st.i
  useEffect(() => {
    const t = setInterval(() => setSt((p) => (p.left > 1 ? { ...p, left: p.left - 1 } : { i: (p.i + 1) % 3, left: BREATH[(p.i + 1) % 3].s })), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (vibrate && navigator.vibrate) navigator.vibrate(i === 0 ? 200 : i === 2 ? [100, 100, 100] : 0)
  }, [i, vibrate])
  const left = st.left
  const scale = i === 0 ? 1.25 : i === 1 ? 1.25 : 0.85
  return (
    <div className="sheet" style={{ alignItems: 'center', justifyContent: 'center', background: 'rgba(252,230,210,.97)' }} onClick={onClose}>
      <div style={{ background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ transform: `scale(${scale})`, transition: `transform ${BREATH[i].s}s ease-in-out` }}>
          <Mascot mood="calm" size={160} />
        </div>
        <span style={{ fontSize: 34, fontWeight: 900 }}>{BREATH[i].t}</span>
        <span style={{ fontSize: 60, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: 'var(--ac)' }}>{left}</span>
        <button className="btn2" style={{ width: 160, background: 'var(--bg)', marginTop: 10 }} onClick={onClose}>
          그만하기
        </button>
      </div>
    </div>
  )
}

export default function Hold() {
  const { session, setSession, go, data } = useApp()
  const remaining = useRemaining()
  const [breath, setBreath] = useState(false)
  const [sound, setSound] = useState(false)
  const [askEnd, setAskEnd] = useState(false)
  useWaveSound(sound && data.settings.sound)

  useEffect(() => {
    if (!session) go('home')
    else if (remaining <= 0) go('result')
  }, [remaining, session, go])
  if (!session) return null

  const mission = MISSIONS[session.mission % MISSIONS.length]
  const allDone = session.missionsDone >= 3
  const doMission = () => setSession({ ...session, missionsDone: session.missionsDone + 1, mission: session.mission + 1 })
  const link = { border: 'none', background: 'transparent', fontSize: 15, fontWeight: 700, minHeight: 44, padding: '0 2px' }

  return (
    <div className="screen" style={{ background: 'var(--tint)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px 0 28px' }}>
        <span style={{ fontSize: 14, fontWeight: 800 }}>{allDone ? '미션 완료' : `미션 ${session.missionsDone + 1} / 3`}</span>
        <button className="icon-btn" style={{ justifyContent: 'flex-end' }} aria-label="그만하기" onClick={() => { setSession(null); go('home') }}>
          <Icon name="x" />
        </button>
      </div>
      <button onClick={() => setAskEnd(true)} aria-label={`남은 시간 ${mmss(remaining)}, 누르면 일찍 끝내기`} style={{ border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <Mascot mood="calm" size={150} />
        <span style={{ fontSize: 104, fontWeight: 900, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: 6 }}>{mmss(remaining)}</span>
      </button>
      <p key={session.mission} className="fade-in" style={{ margin: '30px 28px 0', textAlign: 'center', fontSize: 22, fontWeight: 800, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
        {allDone ? '미션 다 했어!\n이제 시간만 지나가면 돼' : mission.text}
      </p>
      {!allDone && (
        <button onClick={doMission} style={{ alignSelf: 'center', marginTop: 18, fontSize: 15, fontWeight: 800, height: 46, padding: '0 26px', borderRadius: 23, border: 'none', background: 'var(--bg)' }}>
          {mission.done}
        </button>
      )}
      <div style={{ marginTop: 'auto', padding: '24px 20px 34px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <button style={link} onClick={() => setBreath(true)}>호흡</button>
        <span style={{ color: '#D9B79A' }}>·</span>
        <button style={link} onClick={() => go('game')}>게임</button>
        <span style={{ color: '#D9B79A' }}>·</span>
        <button style={{ ...link, color: sound ? 'var(--ac)' : 'var(--ink)' }} onClick={() => setSound(!sound)} aria-pressed={sound}>
          파도 소리{sound ? ' 켜짐' : ''}
        </button>
        <span style={{ color: '#D9B79A' }}>·</span>
        <button style={{ ...link, color: 'var(--deep)' }} onClick={() => go('my')}>도움 받기</button>
      </div>

      {breath && <Breath onClose={() => setBreath(false)} vibrate={data.settings.vibrate} />}
      {askEnd && (
        <div className="sheet" onClick={() => setAskEnd(false)}>
          <div onClick={(e) => e.stopPropagation()} className="fade-in">
            <h2 style={{ fontSize: 22, lineHeight: 1.4 }}>벌써 괜찮아졌어?</h2>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn2" style={{ flex: 1 }} onClick={() => setAskEnd(false)}>
                더 버틸래
              </button>
              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={() => go('result')}
              >
                괜찮아졌어
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
