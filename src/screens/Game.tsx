import { useEffect, useRef, useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TopBar } from '../components/ui'
import { mmss, useRemaining } from './Hold'
import { missionById } from '../content'
import { sfx } from '../sfx'

interface Bubble {
  id: number
  x: number
  size: number
  dur: number
  warm: boolean
  popped: boolean
  delay: number
}

// 버블 팡: 위로 떠오르는 연기 방울을 톡톡 터뜨리는 게임
export default function Game() {
  const { go, session, setSession, update } = useApp()
  const remaining = useRemaining()
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)
  const seq = useRef(0)
  const scoreRef = useRef(0)

  useEffect(() => {
    const spawn = (delay = 0) => {
      const id = ++seq.current
      setBubbles((b) => [...b.filter((x) => id - x.id < 16), { id, x: 6 + Math.random() * 74, size: 40 + Math.random() * 50, dur: 5 + Math.random() * 3, warm: Math.random() < 0.4, popped: false, delay }])
    }
    for (let i = 0; i < 5; i++) spawn(-i * 1.1)
    const t = setInterval(() => spawn(), 650)
    return () => clearInterval(t)
  }, [])

  // 나갈 때 터뜨린 개수를 누적 저장
  useEffect(() => () => update((d) => ({ ...d, bubbles: d.bubbles + scoreRef.current })), [update])

  useEffect(() => {
    if (session && remaining <= 0) go('result')
  }, [remaining, session, go])

  const pop = (id: number) => {
    setBubbles((b) => b.map((x) => (x.id === id ? { ...x, popped: true } : x)))
    sfx.pop()
    scoreRef.current += 1
    setScore(scoreRef.current)
    setSession((s) => (s ? { ...s, bubbles: s.bubbles + 1 } : s))
    if (navigator.vibrate) navigator.vibrate(15)
  }

  const back = () => go(session ? 'hold' : 'home')
  const gm = session?.missions.find((id) => missionById(id).kind === 'game')
  const target = gm ? missionById(gm).target ?? 15 : 0
  const got = session?.bubbles ?? 0
  const cleared = !!gm && got >= target
  useEffect(() => {
    if (cleared) sfx.mission()
  }, [cleared])
  return (
    <div className="screen wide2">
      <TopBar onBack={back} right={session ? <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{mmss(remaining)}</span> : undefined} />
      <h1 className="pad" style={{ fontSize: 26, marginTop: 2 }}>버블 팡</h1>
      <div style={{ position: 'relative', flex: 1, minHeight: 420, marginTop: 18, background: 'var(--tint)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 28, top: 22, zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#8A5A3A' }}>방울 터뜨림</div>
        </div>
        {bubbles.map((b) => (
          <button
            key={b.id}
            aria-label="연기 방울 터뜨리기"
            onPointerDown={() => !b.popped && pop(b.id)}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              bottom: -100,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              background: b.warm ? '#F8D2B4' : '#fff',
              animation: b.popped ? 'pop .25s ease-out forwards' : `rise ${b.dur}s linear ${b.delay}s forwards`,
              pointerEvents: b.popped ? 'none' : 'auto',
            }}
          />
        ))}
        {gm && (
          <div style={{ position: 'absolute', right: 20, top: 22, zIndex: 3, background: cleared ? 'var(--ac)' : 'rgba(255,255,255,.85)', color: cleared ? '#fff' : 'var(--ink)', borderRadius: 16, padding: '10px 14px', fontSize: 14, fontWeight: 800 }}>
            {cleared ? '미션 완료!' : `미션 ${Math.min(got, target)} / ${target}`}
          </div>
        )}
        {cleared && (
          <button className="btn fade-in" onClick={back} style={{ position: 'absolute', left: 24, right: 24, bottom: 120, width: 'auto', zIndex: 4 }}>
            미션 완료! 돌아가기
          </button>
        )}
        <div style={{ position: 'absolute', right: 16, bottom: -14, pointerEvents: 'none' }}>
          <Mascot mood="cheer" size={140} />
        </div>
      </div>
      <div style={{ padding: '14px 28px 30px' }}>
        <button className="btn2" onClick={back}>
          {session ? '미션으로 돌아가기' : '홈으로'}
        </button>
      </div>
    </div>
  )
}
