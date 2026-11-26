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
    setMarks([])
  }

  const [marks, setMarks] = useState<boolean[]>([])
  const pick = (v: boolean) => {
    if (ans !== null) return
    answer(v)
    setMarks((m) => [...m, v === q.answer])
  }

  const box = (v: boolean) => {
    const isAns = ans !== null && v === q.answer
    const isWrongPick = ans === v && v !== q.answer
    const faded = ans !== null && !isAns && !isWrongPick
    const ink = isAns ? '#fff' : isWrongPick ? '#C9BBAE' : v ? 'var(--ac)' : 'var(--deep)'
    return (
      <button
        key={String(v)}
        aria-label={v ? 'O, 맞아' : 'X, 아니야'}
        onClick={() => pick(v)}
        className={isWrongPick ? 'shake' : undefined}
        style={{
          flex: 1,
          height: 150,
          border: 'none',
          borderRadius: 28,
          background: isAns ? 'var(--ac)' : isWrongPick ? 'var(--soft)' : 'var(--card)',
          boxShadow: isAns ? 'inset 0 -5px 0 rgba(0,0,0,.14)' : 'inset 0 -5px 0 rgba(59,42,32,.07)',
          opacity: faded ? 0.45 : 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'background .2s, opacity .2s, transform .08s',
        }}
      >
        <svg viewBox="0 0 60 60" width="62" height="62" aria-hidden="true">
          {v ? <circle cx="30" cy="30" r="21" fill="none" stroke={ink} strokeWidth="9" /> : <path d="M13 13 L47 47 M47 13 L13 47" stroke={ink} strokeWidth="9" strokeLinecap="round" />}
        </svg>
        <span style={{ fontSize: 15, fontWeight: 800, color: isAns ? '#fff' : isWrongPick ? '#B3A598' : 'var(--ink)' }}>{v ? '맞아' : '아니야'}</span>
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
        <div style={{ padding: '22px 20px 28px' }}>
          <div style={{ display: 'flex', gap: 5 }} aria-label={`${QUIZ.length}문제 중 ${idx + 1}번째`}>
            {QUIZ.map((_, i) => (
              <span key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < marks.length ? (marks[i] ? 'var(--ac)' : '#D9CDC1') : i === idx ? '#F6C8A2' : 'var(--soft)' }} />
            ))}
          </div>
          <div key={idx} className="fade-in" style={{ marginTop: 16, background: 'var(--tint)', borderRadius: 28, padding: '22px 22px 24px', minHeight: 168 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--ac)' }}>Q{idx + 1}</span>
            <p style={{ marginTop: 8, fontSize: 23, fontWeight: 800, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{q.q}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            {box(true)}
            {box(false)}
          </div>
          {ans !== null && (
            <div className="fade-in" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--card)', borderRadius: 22, padding: '14px 16px 14px 8px' }}>
                <span style={{ flex: 'none', marginTop: -4 }}>
                  <Mascot mood={right ? 'cheer' : 'worried'} size={56} />
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.6 }}>
                  <b style={{ color: right ? 'var(--ac)' : 'var(--deep)' }}>{right ? '맞았어!' : `아쉬워, 정답은 ${q.answer ? 'O' : 'X'}`}</b>
                  <br />
                  {q.why}
                </p>
              </div>
              <button className="btn" style={{ marginTop: 12 }} onClick={next}>
                {idx === QUIZ.length - 1 ? '결과 보기' : '다음 문제'}
              </button>
            </div>
          )}
        </div>
      )}
      <TabBar on="prevent" go={go} />
    </div>
  )
}
