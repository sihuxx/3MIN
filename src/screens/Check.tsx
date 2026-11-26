import { useMemo, useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { LevelBars, TopBar, useDesktop } from '../components/ui'
import { sfx } from '../sfx'
import { MOODS, PLACES, WITH, missionById, pickMissions } from '../content'

type Field = 'place' | 'mood' | 'with'
const OPTIONS: Record<Field, string[]> = { place: PLACES, mood: MOODS, with: WITH }
const TITLES: Record<Field, string> = { place: '지금 어디야?', mood: '지금 기분은?', with: '누구랑 있어?' }

export default function Check() {
  const { go, setSession, data } = useApp()
  const last = data.holds[data.holds.length - 1]
  const [level, setLevel] = useState(4)
  const [ctx, setCtx] = useState<Record<Field, string>>({ place: last?.place ?? '학교', mood: last?.mood ?? '스트레스', with: last?.with ?? '혼자' })
  const [open, setOpen] = useState<Field | null>(null)
  const desk = useDesktop()
  // 상황이 바뀔 때마다 이번 미션 3개를 다시 고름
  const missions = useMemo(() => pickMissions(ctx, Math.random, data.holds[data.holds.length - 1]?.missions ?? []), [ctx]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    sfx.start()
    setSession({ before: level, ...ctx, startedAt: Date.now(), missions, done: [], cur: 0, bubbles: 0 })
    go('hold')
  }
  const word = (f: Field) => (
    <button className="ul-word" style={{ fontSize: 'inherit' }} onClick={() => setOpen(f)} aria-label={`${TITLES[f]} ${ctx[f]}, 바꾸기`}>
      {ctx[f]}
    </button>
  )

  const preview = (
    <div>
      <div className="cap" style={{ marginBottom: 8 }}>이번에 할 미션</div>
      <div className="tags">
        {missions.map((id, i) => (
          <span key={id} className="tag" style={{ background: 'var(--card)', fontWeight: 700 }}>
            <span style={{ color: 'var(--ac)', fontWeight: 900, marginRight: 6 }}>{i + 1}</span>
            {missionById(id).short}
          </span>
        ))}
      </div>
    </div>
  )
  const sentence = (size: number) => (
    <p style={{ fontSize: size, fontWeight: 800, lineHeight: 1.75 }}>
      지금 {word('place')}에서
      <br />
      {word('mood')} 상태고
      <br />
      {word('with')} 있어
    </p>
  )
  const sheet = open && (
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
  )

  if (desk)
    return (
      <div className="screen wide2 fade-in" style={{ padding: '0 56px' }}>
        <TopBar onBack={() => go('home')} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 72, alignItems: 'center', paddingBottom: 56 }}>
          <div>
            <h1 style={{ fontSize: 48, lineHeight: 1.25 }}>
              지금 얼마나
              <br />
              피우고 싶어?
            </h1>
            <div style={{ marginTop: 36 }}>
              <LevelBars value={level} onChange={setLevel} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {sentence(30)}
            {preview}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Mascot mood="worried" size={96} />
              <button className="btn" onClick={start} style={{ flex: 1, height: 60, fontSize: 17 }}>
                3분 버티기 시작
              </button>
            </div>
          </div>
        </div>
        {sheet}
      </div>
    )

  return (
    <div className="screen fade-in">
      <TopBar onBack={() => go('home')} />
      <h1 className="pad" style={{ marginTop: 6, fontSize: 'clamp(26px, 8vw, 32px)', lineHeight: 1.3 }}>
        지금 얼마나
        <br />
        피우고 싶어?
      </h1>
      <div className="pad" style={{ marginTop: 'clamp(16px, 3vh, 28px)' }}>
        <LevelBars value={level} onChange={setLevel} />
      </div>
      <div className="pad" style={{ marginTop: 32 }}>{sentence(23)}</div>
      <div className="pad" style={{ marginTop: 22 }}>{preview}</div>
      <div style={{ marginTop: 'auto', position: 'sticky', bottom: 0, zIndex: 5, padding: '16px 24px calc(20px + env(safe-area-inset-bottom))', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(rgba(250,246,240,0), var(--bg) 30%)' }}>
        <Mascot mood="worried" size={64} />
        <button className="btn" onClick={start} style={{ flex: 1 }}>
          3분 버티기 시작
        </button>
      </div>

      {sheet}
    </div>
  )
}
