import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { demoData } from '../store'

export default function Title() {
  const { go, update } = useApp()
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
      <div style={{ padding: '0 24px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button className="btn" onClick={() => go('onboarding')}>
          시작하기
        </button>
        <button
          className="u"
          style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, color: 'var(--mute)', minHeight: 32 }}
          onClick={() => {
            update(() => demoData())
            go('home')
          }}
        >
          예시 데이터로 둘러보기
        </button>
      </div>
    </div>
  )
}
