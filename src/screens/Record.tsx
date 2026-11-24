import { useApp } from '../App'
import { TabBar } from '../components/ui'
import { dangerTime, dayCount, dayKey, stickers } from '../store'

const SHADES = ['#FBD9BF', '#F8C29A', '#F2A672']

export default function Record() {
  const { data, go } = useApp()
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const days = dayCount(data.profile, now)
  const monthHolds = data.holds.filter((h) => {
    const d = new Date(h.at)
    return d.getFullYear() === y && d.getMonth() === m
  })
  const perDay = new Map<string, number>()
  for (const h of data.holds) perDay.set(dayKey(new Date(h.at)), (perDay.get(dayKey(new Date(h.at))) ?? 0) + 1)
  const danger = dangerTime(data.holds)
  const got = stickers(data).filter((s) => s.got).length

  const first = new Date(y, m, 1)
  const blanks = (first.getDay() + 6) % 7 // 월요일 시작
  const last = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < blanks; i++) cells.push(<span key={'b' + i} />)
  for (let d = 1; d <= last; d++) {
    const n = perDay.get(`${y}-${m + 1}-${d}`) ?? 0
    const today = d === now.getDate()
    const future = d > now.getDate()
    const bg = today ? 'var(--ac)' : future ? 'transparent' : n > 0 ? SHADES[Math.min(n, 3) - 1] : 'var(--soft)'
    const color = today ? '#fff' : future ? '#CDBFB1' : n > 0 ? 'var(--ink)' : 'var(--mute)'
    cells.push(
      <span key={d} aria-label={`${m + 1}월 ${d}일 ${n}번 버팀`} style={{ width: 34, height: 34, borderRadius: 10, background: bg, color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {d}
      </span>,
    )
  }

  return (
    <div className="screen with-tab fade-in">
      <div className="pad" style={{ paddingTop: 58 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="cap">{m + 1}월 기록</p>
          <button onClick={() => go('stickers')} style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 800, minHeight: 44, padding: 0 }}>
            스티커 {got}장 →
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 128, fontWeight: 900, letterSpacing: '-0.07em', lineHeight: 1, color: 'var(--ac)' }}>{days}</span>
          <span style={{ fontSize: 26, fontWeight: 800 }}>일째</span>
        </div>
        <p style={{ marginTop: 12, fontSize: 17, lineHeight: 1.65 }}>
          이번 달 <b>{monthHolds.length}번</b> 참았어.
          <br />
          {danger ? (
            <>
              제일 위험한 때는 <b style={{ color: 'var(--deep)' }}>{danger}</b>이야.
            </>
          ) : (
            '몇 번 더 기록하면 위험한 때를 알려줄게.'
          )}
        </p>
      </div>
      <div style={{ margin: '30px 28px 0', display: 'grid', gridTemplateColumns: 'repeat(7, 34px)', justifyContent: 'space-between', rowGap: 7 }}>
        {'월화수목금토일'.split('').map((d) => (
          <span key={d} style={{ width: 34, textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--mute)' }}>
            {d}
          </span>
        ))}
        {cells}
      </div>
      <TabBar on="record" go={go} />
    </div>
  )
}
