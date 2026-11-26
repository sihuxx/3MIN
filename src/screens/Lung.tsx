import { useRef, useState } from 'react'
import { useApp } from '../App'
import { TabBar, useDesktop } from '../components/ui'
import { sfx } from '../sfx'
import { PreventTabs } from './Prevent'

type Phase = 'idle' | 'blow' | 'done'
const MAX = 60

// 숨 체크: 버튼을 꾹 누른 채 '후~' 길게 내쉬는 시간을 재서 기록
export default function Lung() {
  const { data, update, go } = useApp()
  const desk = useDesktop()
  const [phase, setPhase] = useState<Phase>('idle')
  const [sec, setSec] = useState(0)
  const [msg, setMsg] = useState('')
  const [last, setLast] = useState<number | null>(null)
  const pressStart = useRef(0)
  const pressTimer = useRef<number>(0)

  const list = data.breaths ?? []
  const best = list.reduce((m, b) => Math.max(m, b.sec), 0)
  const first = list[0]?.sec

  const save = (s: number) => {
    const v = Math.round(s * 10) / 10
    setLast(list.length ? list[list.length - 1].sec : null)
    setSec(v)
    setPhase('done')
    sfx.success()
    update((d) => ({ ...d, breaths: [...(d.breaths ?? []), { at: new Date().toISOString(), sec: v }].slice(-30) }))
  }

  const pressDown = () => {
    setMsg('')
    pressStart.current = performance.now()
    setPhase('blow')
    setSec(0)
    pressTimer.current = window.setInterval(() => setSec((performance.now() - pressStart.current) / 1000), 100)
  }
  const pressUp = () => {
    if (phase !== 'blow') return
    clearInterval(pressTimer.current)
    const s = (performance.now() - pressStart.current) / 1000
    if (s < 0.8) {
      setPhase('idle')
      setMsg('너무 짧았어. 내쉬는 동안 계속 누르고 있어')
    } else save(Math.min(MAX, s))
  }

  const scale = phase === 'blow' ? 1.06 : 1
  const guide: Record<Phase, string> = {
    idle: '숨 크게 들이쉬고, 내쉬는 동안 버튼을 꾹 누르고 있어',
    blow: '계속, 끝까지 길게',
    done: last !== null ? (sec >= last ? `지난번보다 ${(sec - last).toFixed(1)}초 길어졌어` : `지난번(${last}초)보다 조금 짧았어. 컨디션 따라 달라져`) : '첫 기록! 며칠 뒤에 다시 재봐',
  }

  const meter = (
    <div style={{ background: 'var(--tint)', borderRadius: 32, padding: '26px 20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: desk ? 240 : 200,
          height: desk ? 240 : 200,
          borderRadius: '50%',
          background: phase === 'blow' || phase === 'done' ? 'var(--ac)' : '#fff',
          color: phase === 'blow' || phase === 'done' ? '#fff' : 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transition: 'transform .12s, background .2s',
        }}
        className={phase === 'idle' ? 'pulse' : undefined}
      >
        {phase === 'idle' ? (
          <span style={{ fontSize: desk ? 40 : 34, fontWeight: 900, color: 'var(--ac)', letterSpacing: '-0.03em' }}>후~</span>
        ) : (
          <>
            <span style={{ fontSize: desk ? 72 : 60, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{sec.toFixed(1)}</span>
            <span style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>초</span>
          </>
        )}
      </div>
      <p role="status" style={{ marginTop: 22, fontSize: 17, fontWeight: 800, textAlign: 'center', lineHeight: 1.45, minHeight: 50 }}>
        {guide[phase]}
      </p>
      {msg && <p className="cap" style={{ color: 'var(--deep)', marginTop: 4, textAlign: 'center' }}>{msg}</p>}
      <div style={{ width: '100%', marginTop: 16 }}>
        {phase !== 'done' ? (
          <button
            className="btn"
            onPointerDown={pressDown}
            onPointerUp={pressUp}
            onPointerLeave={pressUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {phase === 'blow' ? '내쉬는 중… 떼면 끝' : '꾹 누르고 내쉬기'}
          </button>
        ) : (
          <button className="btn" onClick={() => { setPhase('idle'); setSec(0) }}>
            다시 재기
          </button>
        )}
      </div>
    </div>
  )

  const recent = list.slice(-7)
  const top = Math.max(best, 10)
  const history = (
    <div>
      <h2 style={{ fontSize: 18 }}>내 숨 기록</h2>
      {list.length === 0 ? (
        <p style={{ marginTop: 10, fontSize: 15, color: 'var(--mute)' }}>아직 기록이 없어. 오늘 처음 재보자</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {[
              ['처음', `${first}초`],
              ['최고', `${best}초`],
              ['달라진 것', `${best - first! >= 0 ? '+' : ''}${(best - first!).toFixed(1)}초`],
            ].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: 'var(--card)', borderRadius: 16, padding: '12px 14px' }}>
                <div className="cap">{l}</div>
                <div style={{ fontSize: 20, fontWeight: 900, marginTop: 2, color: l === '달라진 것' ? 'var(--ac)' : 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, marginTop: 16, background: 'var(--card)', borderRadius: 18, padding: '16px 14px 10px' }}>
            {recent.map((b, i) => {
              const d = new Date(b.at)
              const isLast = i === recent.length - 1
              return (
                <div key={b.at} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isLast ? 'var(--ac)' : 'var(--mute)' }}>{b.sec}</span>
                  <div style={{ width: '100%', maxWidth: 28, height: `${(b.sec / top) * 70}%`, borderRadius: 8, background: isLast ? 'var(--ac)' : '#F6C8A2' }} />
                  <span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 600 }}>
                    {d.getMonth() + 1}/{d.getDate()}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
      <p className="cap" style={{ marginTop: 12, lineHeight: 1.6 }}>병원 폐활량 검사가 아니라 내 기록끼리 비교하는 용도야. 어지러우면 바로 멈춰.</p>
    </div>
  )

  return (
    <div className="screen with-tab">
      <PreventTabs on="lung" />
      {desk ? (
        <div className="desk-grid" style={{ marginTop: 28 }}>
          {meter}
          {history}
        </div>
      ) : (
        <div style={{ padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 26 }}>
          {meter}
          {history}
        </div>
      )}
      <TabBar on="prevent" go={go} />
    </div>
  )
}
