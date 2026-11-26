import { useState } from 'react'
import { useApp } from '../App'
import { SCENARIOS, dailyFact } from '../content'
import { dayIndex, dayKey, preventStreak } from '../store'
import { sfx } from '../sfx'
import Mascot from './Mascot'
import { Icon } from './ui'
import { ThingArt } from './InsideArt'

// 예방 모드 홈: 하루 한 번 하는 거절 연습 + 성분 카드
function useToday() {
  const { data, update } = useApp()
  const key = dayKey(new Date())
  const today = data.daily?.[key] ?? {}
  const mark = (k: 'refuse' | 'fact') =>
    update((d) => ({ ...d, daily: { ...(d.daily ?? {}), [key]: { ...(d.daily?.[key] ?? {}), [k]: true } } }))
  return { today, mark }
}

export function TodayHead() {
  const { data } = useApp()
  const { today } = useToday()
  const n = (today.refuse ? 1 : 0) + (today.fact ? 1 : 0)
  const streak = preventStreak(data)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <h2 style={{ fontSize: 19 }}>
        오늘의 예방 <span style={{ color: 'var(--ac)' }}>{n}/2</span>
      </h2>
      <span className="cap">{streak > 0 ? `${streak}일 연속` : n === 2 ? '오늘 완료!' : '하루 두 개면 끝'}</span>
    </div>
  )
}

export function RefuseToday() {
  const { update } = useApp()
  const { today, mark } = useToday()
  const sc = SCENARIOS[dayIndex() % SCENARIOS.length]
  const [pick, setPick] = useState<number | null>(today.refuse ? sc.options.findIndex((o) => o.good) : null)
  const chosen = pick !== null ? sc.options[pick] : null

  const choose = (i: number) => {
    if (today.refuse) return
    setPick(i)
    const good = sc.options[i].good
    if (good) {
      sfx.correct()
      mark('refuse')
      update((d) => ({ ...d, refusals: d.refusals + 1 }))
    } else sfx.wrong()
  }

  return (
    <div style={{ background: 'var(--card)', borderRadius: 26, padding: '18px 18px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--deep)' }}>오늘의 거절 연습</span>
        {today.refuse ? <Done /> : <span className="cap">{sc.place}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 12 }}>
        <span style={{ width: 32, height: 32, flex: 'none', borderRadius: 16, background: '#E9DCCD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{sc.friend.slice(0, 2)}</span>
        <div style={{ maxWidth: '82%', padding: '12px 15px', borderRadius: '18px 18px 18px 6px', background: 'var(--soft)', fontSize: 15, fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{sc.line}</div>
      </div>
      <div role="radiogroup" aria-label="오늘의 거절 연습 대답" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, marginTop: 10 }}>
        {sc.options.map((o, i) => {
          const on = pick === i
          if (today.refuse && !o.good) return null
          return (
            <button
              key={o.text}
              role="radio"
              aria-checked={on}
              onClick={() => choose(i)}
              className={on && !o.good ? 'shake' : undefined}
              style={{ maxWidth: '86%', textAlign: 'left', padding: '11px 15px', borderRadius: '18px 18px 6px 18px', border: 'none', fontSize: 14, fontWeight: 700, background: on ? (o.good ? 'var(--ac)' : '#E5DACD') : 'var(--tint)', color: on && o.good ? '#fff' : 'var(--ink)', boxShadow: on ? 'none' : 'inset 0 -3px 0 rgba(59,42,32,.06)' }}
            >
              {o.text}
            </button>
          )
        })}
      </div>
      {chosen && (
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <Mascot mood={chosen.good ? 'cheer' : 'worried'} size={46} />
          <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: '#5C4636' }}>{chosen.reply}</p>
        </div>
      )}
    </div>
  )
}

export function FactToday() {
  const { today, mark } = useToday()
  const f = dailyFact(dayIndex())
  const [pick, setPick] = useState<string | null>(today.fact ? f.also : null)
  const answered = pick !== null

  const choose = (o: string) => {
    if (answered) return
    setPick(o)
    if (o === f.also) sfx.correct()
    else sfx.wrong()
    mark('fact')
  }

  return (
    <div style={{ background: 'var(--card)', borderRadius: 26, padding: '18px 18px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--deep)' }}>오늘의 성분</span>
        {today.fact && <Done />}
      </div>
      <p style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.4, marginTop: 10 }}>
        담배 속 <span style={{ color: 'var(--ac)' }}>{f.name}</span>,<br />또 어디에 들어있을까?
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {f.options.map((o) => {
          const right = o === f.also
          const on = pick === o
          const show = answered && right
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              className={on && !right ? 'shake' : undefined}
              style={{ flex: 1, minHeight: 52, padding: '8px 6px', border: 'none', borderRadius: 16, fontSize: 14, fontWeight: 800, lineHeight: 1.3, background: show ? 'var(--ac)' : on ? '#E5DACD' : 'var(--tint)', color: show ? '#fff' : answered ? '#A3968A' : 'var(--ink)', boxShadow: show || on ? 'none' : 'inset 0 -3px 0 rgba(59,42,32,.06)' }}
            >
              {o}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <ThingArt name={f.name} size={48} />
        <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.55, color: '#5C4636' }}>
          <b style={{ color: pick === f.also ? 'var(--ac)' : 'var(--deep)' }}>{pick === f.also ? '맞았어!' : '아쉬워!'}</b> {f.name}{josa(f.name)} <b>{f.also}</b>에도 쓰여. {f.hurt}.
        </p>
        </div>
      )}
    </div>
  )
}

function Done() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 900, color: 'var(--ac)' }}>
      <Icon name="check" size={14} width={3} color="var(--ac)" />
      완료
    </span>
  )
}

// 받침 있으면 '은', 없으면 '는'
function josa(w: string) {
  const c = w.charCodeAt(w.length - 1) - 0xac00
  return c >= 0 && c <= 11171 && c % 28 !== 0 ? '은' : '는'
}
