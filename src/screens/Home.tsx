import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TabBar, useDesktop } from '../components/ui'
import { dayCount, savedMoney, won } from '../store'

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

export default function Home() {
  const { data, go } = useApp()
  const p = data.profile
  const now = new Date()
  const days = dayCount(p, now)
  const quit = p?.mode !== 'prevent'
  const dateText = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEK[now.getDay()]}요일`
  const desk = useDesktop()
  const short = typeof window !== 'undefined' && window.innerHeight < 720

  if (desk) {
    const recent = [...data.holds].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4)
    return (
      <div className="screen fade-in" style={{ paddingTop: 64 }}>
        <div className="desk-grid" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="cap" style={{ fontSize: 15 }}>{dateText}</p>
            <h1 style={{ marginTop: 14, fontSize: 56, lineHeight: 1.2 }}>
              {p?.nickname ?? '친구'},<br />
              <span style={{ color: 'var(--ac)' }}>{days}일째</span> {quit ? '버티는 중' : '지키는 중'}
            </h1>
            <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
              {(quit
                ? [[`${data.holds.length}번`, '참은 횟수'], [won(savedMoney(p, now)), '아낀 돈']]
                : [[`${data.refusals}번`, '거절 연습 성공'], [`${data.holds.length}번`, '참은 횟수']]
              ).map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em' }}>{v}</div>
                  <div className="cap" style={{ fontSize: 14, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <h2 style={{ marginTop: 48, fontSize: 18 }}>최근 버틴 기록</h2>
            <div style={{ marginTop: 10 }}>
              {recent.length === 0 && <p style={{ fontSize: 15, color: 'var(--mute)', marginTop: 8 }}>아직 기록이 없어. 생각나면 SOS를 눌러봐</p>}
              {recent.map((h) => {
                const d = new Date(h.at)
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', fontSize: 16 }}>
                    <span style={{ width: 96, color: 'var(--mute)', fontWeight: 600, fontSize: 14 }}>
                      {d.getMonth() + 1}/{d.getDate()} {String(d.getHours()).padStart(2, '0')}:{String(d.getMinutes()).padStart(2, '0')}
                    </span>
                    <span style={{ flex: 1, fontWeight: 700 }}>{h.place} · {h.mood}</span>
                    <span style={{ fontWeight: 800 }}>
                      <span style={{ color: '#C7BBB0' }}>{h.before}</span> → <span style={{ color: 'var(--ac)' }}>{h.after ?? '-'}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 600, background: 'var(--tint)', borderRadius: 44, overflow: 'hidden' }}>
            <button
             
              onClick={() => go('check')}
              aria-label="SOS, 담배 생각날 때 누르기"
              style={{ position: 'absolute', left: '50%', top: 64, marginLeft: -110, width: 220, height: 220, borderRadius: 110, background: 'var(--ac)', border: '14px solid var(--bg)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>SOS</span>
              <span style={{ fontSize: 20, fontWeight: 800 }}>3분만</span>
            </button>
            <div style={{ position: 'absolute', left: 24, bottom: 16 }}>
              <Mascot mood="happy" size={230} />
            </div>
            <p style={{ position: 'absolute', right: 40, bottom: 70, textAlign: 'right', fontSize: 26, fontWeight: 800, lineHeight: 1.45 }}>
              생각나면
              <br />
              바로 눌러.
              <br />
              <span style={{ color: 'var(--ac)' }}>같이 참자</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="pad fade-in" style={{ paddingTop: short ? 26 : 58 }}>
        <p className="cap">{dateText}</p>
        <h1 style={{ marginTop: 10, fontSize: short ? 32 : 36, lineHeight: 1.25 }}>
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
      <div style={{ flex: 1, minHeight: 96 }} />
      <div style={{ position: 'relative', height: short ? 324 : 420, flex: 'none', background: 'var(--tint)', borderRadius: '48px 48px 0 0' }}>
        <button
         
          onClick={() => go('check')}
          aria-label="SOS, 담배 생각날 때 누르기"
          style={{ position: 'absolute', left: '50%', top: -78, zIndex: 2, marginLeft: -84, width: 168, height: 168, borderRadius: 84, background: 'var(--ac)', border: '10px solid var(--bg)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.14)' }}
        >
          <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>SOS</span>
          <span style={{ fontSize: 18, fontWeight: 800 }}>3분만</span>
        </button>
        <div style={{ position: 'absolute', left: 10, bottom: 84 }}>
          <Mascot mood="happy" size={short ? 140 : 176} />
        </div>
        <div style={{ position: 'absolute', right: 24, top: short ? 104 : 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
          <p style={{ textAlign: 'right', fontSize: short ? 18 : 21, fontWeight: 800, lineHeight: 1.45 }}>
            생각나면
            <br />
            바로 눌러.
            <br />
            <span style={{ color: 'var(--ac)' }}>같이 참자</span>
          </p>
        </div>
        <TabBar on="home" go={go} bg="var(--tint)" />
      </div>
    </div>
  )
}
