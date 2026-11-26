import { useEffect, useState } from 'react'
import { useApp } from '../App'
import { missionById, pickMissions } from '../content'
import { inDanger, nextAlertAt, type DangerPlan } from '../store'
import { Icon, Toggle } from './ui'

// 1분마다 다시 그려서 '지금 조심할 때'를 바로 반영
export function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

const canNotify = () => typeof window !== 'undefined' && 'Notification' in window

export async function turnOnAlert() {
  if (canNotify() && Notification.permission === 'default') {
    try {
      await Notification.requestPermission()
    } catch {
      /* 권한 창을 못 띄우는 브라우저 */
    }
  }
}

// 위험 시간 10분 전 알림 (앱이 열려 있는 동안)
export function fireAlert(plan: DangerPlan) {
  const body = `10분 뒤 ${plan.label}, ${plan.place}에서 자주 당겼어. 미리 대비하자`
  if (canNotify() && Notification.permission === 'granted') {
    try {
      new Notification('3분만', { body, tag: 'danger' })
    } catch {
      /* 일부 모바일 브라우저는 페이지 알림 미지원 */
    }
  }
  navigator.vibrate?.([120, 80, 120])
}

// 홈 패널 안의 '조심할 시간' 카드
export function DangerCard({ plan, onOpen, big = false }: { plan: DangerPlan; onOpen: () => void; big?: boolean }) {
  const { data } = useApp()
  const now = useNow()
  const hot = inDanger(plan, now)
  return (
    <button
      onClick={onOpen}
      aria-label={`조심할 시간 ${plan.label}, ${plan.place}. 자세히 보기`}
      style={{
        border: 'none',
        textAlign: 'right',
        padding: big ? '18px 22px' : '12px 16px',
        borderRadius: big ? 24 : 20,
        background: hot ? 'var(--btn)' : 'rgba(255,255,255,.75)',
        color: hot ? '#fff' : 'var(--ink)',
        boxShadow: hot ? 'inset 0 -4px 0 rgba(0,0,0,.16)' : 'inset 0 -3px 0 rgba(59,42,32,.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
      }}
    >
      <span style={{ fontSize: big ? 14 : 12, fontWeight: 800, color: hot ? '#FFE1C8' : 'var(--ac)' }}>{hot ? '지금 조심할 시간!' : '조심할 시간'}</span>
      <span style={{ fontSize: big ? 30 : 22, fontWeight: 900, letterSpacing: '-0.03em' }}>{plan.label}</span>
      <span style={{ fontSize: big ? 16 : 14, fontWeight: 700, color: hot ? '#fff' : '#5C4636' }}>
        {plan.place} · {plan.mood}
      </span>
      <span style={{ marginTop: 4, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, color: hot ? '#fff' : data.settings.alert ? 'var(--deep)' : 'var(--mute)' }}>
        <Icon name="bell" size={13} width={2.2} color={hot ? '#fff' : data.settings.alert ? 'var(--deep)' : 'var(--mute)'} />
        {hot ? '미리 대비하기' : data.settings.alert ? '10분 전 알림 켜짐' : '알림 받기'}
      </span>
    </button>
  )
}

// 카드를 누르면 뜨는 시트
export function DangerSheet({ plan, onClose }: { plan: DangerPlan; onClose: () => void }) {
  const { data, update, go } = useApp()
  const prep = pickMissions({ place: plan.place, mood: plan.mood, with: '혼자' }, () => 0.5).slice(0, 3)
  const on = !!data.settings.alert
  const denied = canNotify() && Notification.permission === 'denied'
  const next = nextAlertAt(plan)
  const pct = Math.round((plan.count / plan.total) * 100)
  return (
    <div className="sheet" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="fade-in">
        <p className="cap" style={{ color: 'var(--ac)' }}>조심할 시간</p>
        <h2 style={{ fontSize: 26, marginTop: 4 }}>
          {plan.label}, {plan.place}
        </h2>
        <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: '#5C4636' }}>
          참은 {plan.total}번 중 <b style={{ color: 'var(--ink)' }}>{plan.count}번({pct}%)</b>이 이 시간대였어.
          <br />주로 <b style={{ color: 'var(--ink)' }}>{plan.mood}</b> 때 당겼어.
        </p>

        <h3 style={{ fontSize: 15, marginTop: 20 }}>그 시간 전에 미리 해두기</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {prep.map((id, i) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', borderRadius: 14, padding: '12px 14px', fontSize: 15, fontWeight: 700 }}>
              <span style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--tint)', color: 'var(--deep)', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              {missionById(id).title.replace('\n', ' ')}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, background: 'var(--card)', borderRadius: 16, padding: '14px 16px' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>10분 전에 알려주기</div>
            <div className="cap" style={{ marginTop: 2 }}>
              {on ? `다음 알림 ${next.getMonth() + 1}/${next.getDate()} ${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}` : '이 화면을 열어두면 알려줘'}
            </div>
          </div>
          <Toggle
            label="10분 전에 알려주기"
            on={on}
            onChange={(v) => {
              update((d) => ({ ...d, settings: { ...d.settings, alert: v } }))
              if (v) turnOnAlert()
            }}
          />
        </div>
        {on && denied && <p className="cap" style={{ marginTop: 8, color: 'var(--deep)' }}>브라우저 알림이 막혀 있어서 앱 안에서만 알려줄게</p>}

        <button className="btn" style={{ marginTop: 18 }} onClick={() => go('check')}>
          지금 미리 3분 버티기
        </button>
      </div>
    </div>
  )
}
