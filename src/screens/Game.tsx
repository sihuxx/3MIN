import { useEffect, useRef, useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TopBar } from '../components/ui'
import { mmss, useRemaining } from './Hold'

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
  const { go, session, update } = useApp()
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
    scoreRef.current += 1
    setScore(scoreRef.current)
    if (navigator.vibrate) navigator.vibrate(15)
  }

  const back = () => go(session ? 'hold' : 'home')
  return (
    <div className="screen">
      <TopBar onBack={back} right={session ? <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{mmss(remaining)}</span> : undefined} />
      <div className="pad" style={{ display: 'flex', gap: 20, marginTop: 4 }}>
        {['버블 팡', '담배 피하기', '거절 퀴즈'].map((t, i) => (
          <button
            key={t}
            onClick={() => i === 2 && go('quiz')}
            style={{ border: 'none', background: 'transparent', padding: '0 0 6px', fontSize: 16, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? 'var(--ink)' : i === 1 ? '#C9BDB2' : 'var(--mute)', boxShadow: i === 0 ? 'inset 0 -3px 0 var(--ac)' : 'none' }}
            aria-disabled={i === 1}
          >
            {t}
            {i === 1 && <span style={{ fontSize: 11, marginLeft: 4 }}>준비 중</span>}
          </button>
        ))}
      </div>
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
        <div style={{ position: 'absolute', right: 16, bottom: -14, pointerEvents: 'none' }}>
          <Mascot mood="cheer" size={140} />
        </div>
      </div>
      <div style={{ padding: '14px 28px 30px' }}>
        <button onClick={back} style={{ border: 'none', background: 'transparent', fontSize: 15, fontWeight: 700, minHeight: 44, padding: 0 }}>
          ← {session ? '미션으로 돌아가기' : '홈으로'}
        </button>
      </div>
    </div>
  )
}
