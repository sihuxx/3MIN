import { useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TabBar } from '../components/ui'
import { QUIZ } from '../content'
import { PreventTabs } from './Prevent'
import { sfx } from '../sfx'

export default function Quiz() {
  const { go, update, data } = useApp()
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)
  const q = QUIZ[idx]
  const right = ans !== null && ans === q.answer

  const answer = (v: boolean) => {
    if (ans !== null) return
    setAns(v)
    if (v === q.answer) sfx.correct()
    else sfx.wrong()
    if (v === q.answer) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx === QUIZ.length - 1) {
      setOver(true)
      update((d) => ({ ...d, quizBest: Math.max(d.quizBest, score) }))
      return
    }
    setIdx(idx + 1)
    setAns(null)
  }
  const restart = () => {
    setIdx(0)
    setAns(null)
    setScore(0)
    setOver(false)
  }

  const box = (v: boolean) => {
    const label = v ? 'O' : 'X'
    let bg = 'var(--card)'
    let color = 'var(--ink)'
    if (ans !== null) {
      if (v === q.answer) {
        bg = 'var(--ac)'
        color = '#fff'
      } else {
        bg = 'var(--soft)'
        color = '#D2C5B8'
      }
    }
    return (
      <button key={label} aria-label={label} onClick={() => answer(v)} style={{ flex: 1, border: 'none', background: bg, fontSize: 80, fontWeight: 900, color, transition: 'background .2s' }}>
        {label}
      </button>
    )
  }

  return (
    <div className="screen with-tab narrow">
      <PreventTabs on="quiz" />
      {over ? (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 28px 0', gap: 10 }}>
          <Mascot mood={score >= 7 ? 'cheer' : 'happy'} size={160} />
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>
            {score}
            <span style={{ fontSize: 32, color: 'var(--mute)' }}> / {QUIZ.length}</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', lineHeight: 1.5 }}>{score >= 8 ? '담배 박사네!' : score >= 5 ? '꽤 잘 알고 있어' : '이제 제대로 알았지?'}</p>
          <p className="cap">최고 기록 {Math.max(data.quizBest, score)}점</p>
          <button className="btn" style={{ marginTop: 20 }} onClick={restart}>
            다시 풀기
          </button>
        </div>
      ) : (
        <>
          <div key={idx} className="pad fade-in" style={{ paddingTop: 30 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ac)' }}>
              {idx + 1} / {QUIZ.length}
            </div>
            <p style={{ marginTop: 10, fontSize: 27, fontWeight: 800, lineHeight: 1.4, whiteSpace: 'pre-line', minHeight: 114 }}>{q.q}</p>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 28, height: 150, flex: 'none', background: 'var(--soft)' }}>
            {box(true)}
            {box(false)}
          </div>
          {ans !== null && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 24px 0 14px' }}>
                <Mascot mood={right ? 'cheer' : 'worried'} size={72} />
                <p style={{ fontSize: 15, lineHeight: 1.55 }}>
                  <b>{right ? '맞았어!' : `정답은 ${q.answer ? 'O' : 'X'}.`}</b> {q.why}
                </p>
              </div>
              <div style={{ padding: '16px 24px 0' }}>
                <button className="btn" onClick={next}>
                  {idx === QUIZ.length - 1 ? '결과 보기' : '다음 문제'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <TabBar on="prevent" go={go} />
    </div>
  )
}
