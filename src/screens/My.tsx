import { useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { TabBar, Toggle } from '../components/ui'
import { dayCount, emptyData, save, won } from '../store'
import { Pick } from './Onboarding'

export default function My() {
  const { data, update, go } = useApp()
  const p = data.profile
  const [sheet, setSheet] = useState<null | 'mode' | 'cost' | 'reset' | 'school'>(null)
  const [cost, setCost] = useState(String(p ? Math.round(p.weeklyCost / 7) : 0))
  const close = () => setSheet(null)
  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 52, fontSize: 16, fontWeight: 600 } as const
  const plain = { border: 'none', background: 'transparent', padding: 0 } as const

  return (
    <div className="screen with-tab">
      <div className="pad fade-in" style={{ paddingTop: 52, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 84, height: 84, borderRadius: 42, background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Mascot mood="happy" size={72} />
        </span>
        <div>
          <h1 style={{ fontSize: 30 }}>{p?.nickname ?? '친구'}</h1>
          <p style={{ marginTop: 4, fontSize: 14, color: 'var(--mute)' }}>
            {p?.mode === 'prevent' ? '예방 모드' : '금연 모드'} · {dayCount(p)}일째 ·{' '}
            <button className="u" style={{ ...plain, fontSize: 14, fontWeight: 700 }} onClick={() => setSheet('mode')}>
              바꾸기
            </button>
          </p>
        </div>
      </div>

      <a href="tel:15449030" style={{ display: 'block', margin: '26px 20px 0', padding: '22px 24px', borderRadius: 28, background: 'var(--deep)', color: '#fff' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>혼자 버티기 힘들면</div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 2 }}>1544-9030</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>금연상담전화 바로 걸기</div>
      </a>
      <button style={{ ...plain, margin: '14px 28px 0', fontSize: 14, fontWeight: 700, textAlign: 'left', minHeight: 36, alignSelf: 'flex-start' }} onClick={() => setSheet('school')}>
        학교 보건실 찾아가기 →
      </button>

      <div className="pad" style={{ marginTop: 14 }}>
        {p?.mode !== 'prevent' && (
          <div style={row}>
            <span>하루 담배값</span>
            <button style={{ ...plain, fontSize: 15, color: 'var(--mute)', minHeight: 44 }} onClick={() => setSheet('cost')}>
              {won(p ? Math.round(p.weeklyCost / 7) : 0)} ›
            </button>
          </div>
        )}
        <div style={row}>
          <span>파도 소리</span>
          <Toggle label="파도 소리" on={data.settings.sound} onChange={(v) => update((d) => ({ ...d, settings: { ...d.settings, sound: v } }))} />
        </div>
        <div style={row}>
          <span>진동 호흡 가이드</span>
          <Toggle label="진동 호흡 가이드" on={data.settings.vibrate} onChange={(v) => update((d) => ({ ...d, settings: { ...d.settings, vibrate: v } }))} />
        </div>
      </div>
      <button className="u" style={{ ...plain, margin: '6px 28px 0', fontSize: 13, color: '#A23B2A', textAlign: 'left', minHeight: 36, alignSelf: 'flex-start' }} onClick={() => setSheet('reset')}>
        기록 초기화
      </button>

      <TabBar on="my" go={go} />

      {sheet && (
        <div className="sheet" onClick={close}>
          <div onClick={(e) => e.stopPropagation()} className="fade-in">
            {sheet === 'mode' && (
              <>
                <h2 style={{ fontSize: 22, marginBottom: 16 }}>모드 바꾸기</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Pick on={p?.mode !== 'prevent'} onClick={() => { update((d) => (d.profile ? { ...d, profile: { ...d.profile, mode: 'quit' } } : d)); close() }} title="금연 모드" sub="담배를 끊고 싶어" />
                  <Pick on={p?.mode === 'prevent'} onClick={() => { update((d) => (d.profile ? { ...d, profile: { ...d.profile, mode: 'prevent' } } : d)); close() }} title="예방 모드" sub="권유받을 때 거절하고 싶어" />
                </div>
              </>
            )}
            {sheet === 'cost' && (
              <>
                <h2 style={{ fontSize: 22, marginBottom: 16 }}>하루 담배값</h2>
                <input className="field" inputMode="numeric" aria-label="하루 담배값" value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ''))} style={{ background: 'var(--card)' }} />
                <button className="btn" style={{ marginTop: 14 }} onClick={() => { update((d) => (d.profile ? { ...d, profile: { ...d.profile, weeklyCost: (Number(cost) || 0) * 7 } } : d)); close() }}>
                  저장
                </button>
              </>
            )}
            {sheet === 'school' && (
              <>
                <h2 style={{ fontSize: 22, lineHeight: 1.4 }}>보건실에서도 도와줘</h2>
                <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: '#5C4636' }}>보건 선생님께 “금연하고 싶어요”라고만 말해도 돼. 혼내지 않고 같이 방법을 찾아줄 거야.</p>
                <button className="btn" style={{ marginTop: 18 }} onClick={close}>
                  알겠어
                </button>
              </>
            )}
            {sheet === 'reset' && (
              <>
                <h2 style={{ fontSize: 22, lineHeight: 1.4 }}>기록을 전부 지울까?</h2>
                <p style={{ marginTop: 8, fontSize: 15, color: '#5C4636' }}>버틴 기록, 스티커, 설정이 모두 사라지고 되돌릴 수 없어.</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn2" style={{ flex: 1 }} onClick={close}>
                    취소
                  </button>
                  <button
                    className="btn"
                    style={{ flex: 1, background: '#A23B2A', color: '#fff' }}
                    onClick={() => {
                      const fresh = emptyData()
                      save(fresh)
                      update(() => fresh)
                      go('title')
                    }}
                  >
                    지우기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
