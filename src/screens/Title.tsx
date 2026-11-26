import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { demoData } from '../store'
import { useDesktop } from '../components/ui'

export default function Title() {
  const { go, update } = useApp()
  const desk = useDesktop()
  const demo = () => {
    update(() => demoData())
    go('home')
  }
  if (desk)
    return (
      <div className="screen wide" style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1, background: 'var(--tint)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw', gap: 20 }}>
          <span style={{ fontSize: 'clamp(80px, 9vw, 140px)', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1 }}>
            3분만<span style={{ color: 'var(--ac)' }}>.</span>
          </span>
          <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.5 }}>
            담배 생각날 때,
            <br />딱 3분만 호롱이랑 버티자
          </span>
        </div>
        <svg viewBox="0 0 40 800" width="40" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', height: '100%', marginLeft: -39, flex: 'none' }}>
          <path d="M22 0 C8 66 8 133 22 200 C36 266 36 333 22 400 C8 466 8 533 22 600 C36 666 36 733 22 800 H40 V0 Z" fill="var(--bg)" />
        </svg>
        <div style={{ width: 'min(520px, 44vw)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 56px' }}>
          <Mascot mood="happy" size={260} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button className="btn" onClick={() => go('onboarding')}>
              시작하기
            </button>
            <button className="btn2" onClick={demo}>
              예시 데이터로 둘러보기
            </button>
          </div>
        </div>
      </div>
    )
  return (
    <div className="screen">
      <div style={{ height: 360, background: 'var(--tint)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, flex: 'none' }}>
        <span style={{ fontSize: 76, fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1 }}>
          3분만<span style={{ color: 'var(--ac)' }}>.</span>
        </span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>담배 생각날 때, 딱 3분만</span>
      </div>
      <svg viewBox="0 0 390 40" width="100%" height="40" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', marginTop: -39, flex: 'none' }}>
        <path d="M0 22 C32 8 64 8 97 22 C130 36 162 36 195 22 C228 8 260 8 292 22 C325 36 357 36 390 22 V40 H0 Z" fill="var(--bg)" />
      </svg>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <Mascot mood="happy" size={210} />
      </div>
      <div style={{ padding: '0 24px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn" onClick={() => go('onboarding')}>
          시작하기
        </button>
        <button className="btn2" onClick={demo}>
          예시 데이터로 둘러보기
        </button>
      </div>
    </div>
  )
}
