import { useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { Icon, Tags } from '../components/ui'
import type { Mode, Profile } from '../store'

const one = (setter: (v: string) => void) => (v: string) => setter(v)

export default function Onboarding() {
  const { go, update } = useApp()
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<Mode>('quit')
  const [nickname, setNickname] = useState('')
  const [period, setPeriod] = useState('')
  const [kind, setKind] = useState('')
  const [count, setCount] = useState('')
  const [weekly, setWeekly] = useState('')
  const [reasons, setReasons] = useState<string[]>([])
  const [times, setTimes] = useState<string[]>([])
  const [confidence, setConfidence] = useState(3)

  const quit = mode === 'quit'
  const toggle = (list: string[], set: (v: string[]) => void) => (v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const finish = () => {
    const profile: Profile = {
      nickname: nickname.trim() || '친구',
      mode,
      period,
      kind,
      count,
      weeklyCost: Number(weekly.replace(/[^0-9]/g, '')) || 0,
      reasons,
      times,
      confidence,
      startDate: new Date().toISOString(),
    }
    update((d) => ({ ...d, profile }))
    setStep(4)
  }

  if (step === 4) {
    return (
      <div className="screen fade-in">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 24px' }}>
          <span style={{ width: 250, height: 250, borderRadius: 125, background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mascot mood="cheer" size={200} />
          </span>
          <h1 style={{ marginTop: 12, fontSize: 30, lineHeight: 1.35, textAlign: 'center' }}>
            준비 끝!
            <br />
            {quit ? '첫 목표는 7일 버티기' : '첫 목표는 거절 연습 5번'}
          </h1>
        </div>
        <div style={{ padding: '0 24px 34px' }}>
          <button className="btn" onClick={() => go('home')}>
            호롱이랑 시작하기
          </button>
        </div>
      </div>
    )
  }

  const canNext = step === 1 ? nickname.trim().length > 0 : true
  const heading = step === 1 ? '반가워!\n너에 대해 알려줘' : step === 2 ? (quit ? '평소에\n어떻게 피워?' : '담배를 권유받은\n적 있어?') : quit ? '왜 끊고 싶어?' : '왜 안 피우고 싶어?'
  const mood = step === 1 ? 'happy' : step === 2 ? 'calm' : 'cheer'

  return (
    <div className="screen fade-in" key={step}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px 0' }}>
        <button className="icon-btn" aria-label="뒤로" onClick={() => (step === 1 ? go('title') : setStep(step - 1))}>
          <Icon name="back" />
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {[1, 2, 3].map((i) => (
            <span key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? 'var(--ac)' : 'var(--soft)' }} />
          ))}
        </div>
        <span style={{ width: 44, textAlign: 'right', fontSize: 13, fontWeight: 800 }}>{step}/3</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 24px 0' }}>
        <h1 style={{ flex: 1, fontSize: 28, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{heading}</h1>
        <Mascot mood={mood} size={92} />
      </div>

      {step === 1 && (
        <>
          <Section title="어떤 모드로 시작할까?">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Pick on={quit} onClick={() => setMode('quit')} title="금연 모드" sub="담배를 끊고 싶어" />
              <Pick on={!quit} onClick={() => setMode('prevent')} title="예방 모드" sub="권유받을 때 거절하고 싶어" />
            </div>
          </Section>
          <Section title="뭐라고 불러줄까?">
            <input className="field" aria-label="닉네임" placeholder="닉네임 입력" maxLength={10} value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </Section>
        </>
      )}

      {step === 2 && quit && (
        <>
          <Section title="피운 지 얼마나 됐어?">
            <Tags items={['한 달 안', '반년 안', '1년 안', '1년 넘게']} value={[period]} onToggle={one(setPeriod)} />
          </Section>
          <Section title="주로 뭘 피워?">
            <Tags items={['연초', '전자담배', '궐련형', '섞어서']} value={[kind]} onToggle={one(setKind)} />
          </Section>
          <Section title="하루에 얼마나?">
            <Tags items={['가끔', '1~5번', '6~10번', '그 이상']} value={[count]} onToggle={one(setCount)} />
          </Section>
          <Section title="일주일 담배값은?">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="field" inputMode="numeric" aria-label="일주일 담배값" placeholder="₩ 금액" value={weekly} onChange={(e) => setWeekly(e.target.value)} style={{ flex: 1 }} />
              {['10000', '20000', '30000'].map((v, i) => (
                <button key={v} className={'tag' + (weekly === v ? ' on' : '')} onClick={() => setWeekly(v)}>
                  {['1만', '2만', '3만+'][i]}
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {step === 2 && !quit && (
        <>
          <Section title="권유받은 적 있어?">
            <Tags items={['없어', '한두 번', '자주']} value={[period]} onToggle={one(setPeriod)} />
          </Section>
          <Section title="주로 어디서?">
            <Tags items={['학교', '하교길', '학원', '노래방', 'PC방', '온라인']} value={times} onToggle={toggle(times, setTimes)} />
          </Section>
        </>
      )}

      {step === 3 && (
        <>
          <Section title={quit ? '끊고 싶은 이유' : '안 피우고 싶은 이유'}>
            <Tags items={['건강', '돈', '냄새', '운동', '가족', '집중력']} value={reasons} onToggle={toggle(reasons, setReasons)} />
          </Section>
          {quit && (
            <Section title="언제 제일 피우고 싶어?">
              <Tags items={['아침', '쉬는 시간', '점심 후', '하교길', '밤', '스트레스 받을 때']} value={times} onToggle={toggle(times, setTimes)} />
            </Section>
          )}
          <Section title={quit ? '지금 끊을 자신은?' : '권유받으면 거절할 자신은?'}>
            <div role="radiogroup" aria-label="자신감" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} role="radio" aria-checked={confidence === i} onClick={() => setConfidence(i)} style={{ width: 52, height: 52, borderRadius: 26, border: 'none', background: confidence === i ? 'var(--pri)' : 'var(--soft)', fontSize: 18, fontWeight: 800 }}>
                  {i}
                </button>
              ))}
            </div>
            <div className="cap" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontWeight: 600 }}>
              <span>자신 없어</span>
              <span>완전 자신 있어</span>
            </div>
          </Section>
        </>
      )}

      <div style={{ marginTop: 'auto', padding: '28px 24px 34px' }}>
        <button className="btn" disabled={!canNext} onClick={() => (step === 3 ? finish() : setStep(step + 1))}>
          {step === 3 ? '완료' : '다음'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: '24px 24px 0' }}>
      <h2 style={{ marginBottom: 12, fontSize: 16 }}>{title}</h2>
      {children}
    </section>
  )
}

export function Pick({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub?: string }) {
  return (
    <button role="radio" aria-checked={on} onClick={onClick} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 18, border: 'none', background: on ? 'var(--tint)' : 'var(--card)' }}>
      <span style={{ width: 22, height: 22, borderRadius: 11, flex: 'none', background: on ? 'var(--ac)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <span style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 17, fontWeight: 800 }}>{title}</span>
        {sub && <span className="cap" style={{ fontWeight: 600 }}>{sub}</span>}
      </span>
    </button>
  )
}
