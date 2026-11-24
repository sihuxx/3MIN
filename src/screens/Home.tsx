import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TabBar } from '../components/ui'
import { dayCount, savedMoney, won } from '../store'

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

export default function Home() {
  const { data, go } = useApp()
  const p = data.profile
  const now = new Date()
  const days = dayCount(p, now)
  const quit = p?.mode !== 'prevent'
  const dateText = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEK[now.getDay()]}요일`

  return (
    <div className="screen">
      <div className="pad fade-in" style={{ paddingTop: 58 }}>
        <p className="cap">{dateText}</p>
        <h1 style={{ marginTop: 10, fontSize: 36, lineHeight: 1.25 }}>
          {p?.nickname ?? '친구'},<br />
          <span style={{ color: 'var(--ac)' }}>{days}일째</span> {quit ? '버티는 중' : '지키는 중'}
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.65, color: '#5C4636' }}>
          {quit ? (
            <>
              지금까지 <b style={{ color: 'var(--ink)' }}>{data.holds.length}번</b> 참았고
              <br />
              <b style={{ color: 'var(--ink)' }}>{won(savedMoney(p, now))}</b> 아꼈어
            </>
          ) : (
            <>
              거절 연습 <b style={{ color: 'var(--ink)' }}>{data.refusals}번</b> 성공,
              <br />
              궁금해질 땐 <b style={{ color: 'var(--ink)' }}>{data.holds.length}번</b> 참았어
            </>
          )}
        </p>
      </div>
      <div style={{ position: 'relative', marginTop: 'auto', height: 420, flex: 'none', background: 'var(--tint)', borderRadius: '48px 48px 0 0' }}>
        <button
          onClick={() => go('check')}
          aria-label="SOS, 담배 생각날 때 누르기"
          style={{ position: 'absolute', left: '50%', top: -78, marginLeft: -84, width: 168, height: 168, borderRadius: 84, background: 'var(--ac)', border: '10px solid var(--bg)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
        >
          <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>SOS</span>
          <span style={{ fontSize: 18, fontWeight: 800 }}>3분만</span>
        </button>
        <div style={{ position: 'absolute', left: 14, bottom: 86 }}>
          <Mascot mood="happy" size={176} />
        </div>
        <p style={{ position: 'absolute', right: 30, top: 132, textAlign: 'right', fontSize: 21, fontWeight: 800, lineHeight: 1.45 }}>
          생각나면
          <br />
          바로 눌러.
          <br />
          <span style={{ color: 'var(--ac)' }}>같이 참자</span>
        </p>
        <TabBar on="home" go={go} bg="var(--tint)" />
      </div>
    </div>
  )
}
