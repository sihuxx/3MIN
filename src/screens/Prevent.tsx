import { useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TabBar } from '../components/ui'
import { SCENARIOS } from '../content'
import { sfx } from '../sfx'

export type PreventTab = 'refuse' | 'quiz' | 'inside' | 'lung'
const PTABS: [PreventTab, string, 'prevent' | 'quiz' | 'inside' | 'lung'][] = [
  ['refuse', '거절 연습', 'prevent'],
  ['quiz', 'OX 퀴즈', 'quiz'],
  ['inside', '성분 까보기', 'inside'],
  ['lung', '숨 체크', 'lung'],
]

export function PreventTabs({ on }: { on: PreventTab }) {
  const { go } = useApp()
  return (
    <div style={{ paddingTop: 58 }}>
      <h1 className="pad" style={{ fontSize: 32 }}>예방</h1>
      <div className="pad no-bar" role="tablist" style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {PTABS.map(([k, l, r]) => (
          <button key={k} role="tab" aria-selected={on === k} className={'pill' + (on === k ? ' on' : '')} style={{ flex: 'none' }} onClick={() => go(r)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

const bubbleL = { alignSelf: 'flex-start', maxWidth: '78%', padding: '13px 16px', borderRadius: '20px 20px 20px 6px', background: 'var(--card)', fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-line' } as const

// 메신저 대화처럼 생긴 거절 연습
export default function Prevent() {
  const { go, update } = useApp()
  const [idx, setIdx] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [counted, setCounted] = useState(false)
  const sc = SCENARIOS[idx]
  const chosen = pick !== null ? sc.options[pick] : null

  const choose = (i: number) => {
    setPick(i)
    if (sc.options[i].good) sfx.correct()
    else sfx.wrong()
    if (sc.options[i].good && !counted) {
      setCounted(true)
      update((d) => ({ ...d, refusals: d.refusals + 1 }))
    }
  }
  const next = () => {
    setIdx((idx + 1) % SCENARIOS.length)
    setPick(null)
    setCounted(false)
  }

  return (
    <div className="screen with-tab narrow">
      <PreventTabs on="refuse" />
      <div key={idx} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '26px 24px 0' }}>
        <span style={{ alignSelf: 'center', fontSize: 12, fontWeight: 700, color: 'var(--mute)', padding: '5px 12px', borderRadius: 8, background: 'var(--soft)' }}>
          {sc.place} · 상황 {idx + 1}/{SCENARIOS.length}
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 17, background: '#E9DCCD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{sc.friend.slice(0, 2)}</span>
          <div style={bubbleL}>{sc.line}</div>
        </div>
        <div role="radiogroup" aria-label="대답 고르기" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sc.options.map((o, i) => {
            const on = pick === i
            return (
              <button key={o.text} role="radio" aria-checked={on} onClick={() => choose(i)} style={{ alignSelf: 'flex-end', maxWidth: '82%', textAlign: 'left', padding: '13px 16px', borderRadius: '20px 20px 6px 20px', border: 'none', background: on ? (o.good ? 'var(--pri)' : '#E5DACD') : 'var(--soft)', fontSize: 15, fontWeight: on ? 800 : 500 }}>
                {o.text}
              </button>
            )
          })}
        </div>
        {chosen && (
          <div className="fade-in" style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 10 }}>
            <Mascot mood={chosen.good ? 'cheer' : 'worried'} size={72} />
            <div style={bubbleL}>{chosen.reply}</div>
          </div>
        )}
        {chosen?.good && (
          <button className="btn" style={{ marginTop: 10 }} onClick={next}>
            다음 상황
          </button>
        )}
      </div>
      <TabBar on="prevent" go={go} />
    </div>
  )
}
