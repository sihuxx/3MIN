import { useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { LevelBars, TopBar } from '../components/ui'
import { MOODS, PLACES, WITH } from '../content'

type Field = 'place' | 'mood' | 'with'
const OPTIONS: Record<Field, string[]> = { place: PLACES, mood: MOODS, with: WITH }
const TITLES: Record<Field, string> = { place: '지금 어디야?', mood: '지금 기분은?', with: '누구랑 있어?' }

export default function Check() {
  const { go, setSession, data } = useApp()
  const last = data.holds[data.holds.length - 1]
  const [level, setLevel] = useState(4)
  const [ctx, setCtx] = useState<Record<Field, string>>({ place: last?.place ?? '학교', mood: last?.mood ?? '스트레스', with: last?.with ?? '혼자' })
  const [open, setOpen] = useState<Field | null>(null)

  const start = () => {
    setSession({ before: level, ...ctx, startedAt: Date.now(), mission: Math.floor(Math.random() * 7), missionsDone: 0 })
    go('hold')
  }
  const word = (f: Field) => (
    <button className="ul-word" style={{ fontSize: 'inherit' }} onClick={() => setOpen(f)} aria-label={`${TITLES[f]} ${ctx[f]}, 바꾸기`}>
      {ctx[f]}
    </button>
  )

  return (
    <div className="screen fade-in">
      <TopBar onBack={() => go('home')} />
      <h1 className="pad" style={{ marginTop: 6, fontSize: 32, lineHeight: 1.3 }}>
        지금 얼마나
        <br />
        피우고 싶어?
      </h1>
      <div className="pad" style={{ marginTop: 28 }}>
        <LevelBars value={level} onChange={setLevel} />
      </div>
      <p className="pad" style={{ marginTop: 40, fontSize: 23, fontWeight: 800, lineHeight: 1.75 }}>
        지금 {word('place')}에서
        <br />
        {word('mood')} 상태고
        <br />
        {word('with')} 있어
      </p>
      <div style={{ marginTop: 'auto', padding: '24px 24px 34px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mascot mood="worried" size={72} />
        <button className="btn" onClick={start} style={{ flex: 1 }}>
          3분 버티기 시작
        </button>
      </div>

      {open && (
        <div className="sheet" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="fade-in">
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>{TITLES[open]}</h2>
            <div className="tags">
              {OPTIONS[open].map((o) => (
                <button
                  key={o}
                  className={'tag' + (ctx[open] === o ? ' on' : '')}
                  style={{ fontSize: 16, padding: '12px 18px' }}
                  onClick={() => {
                    setCtx({ ...ctx, [open]: o })
                    setOpen(null)
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
