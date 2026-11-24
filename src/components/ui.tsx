import type { ReactNode } from 'react'
import { LEVELS } from '../content'

const PATHS = {
  back: <path d="M15 5 L8 12 L15 19" />,
  x: <path d="M6 6 L18 18 M18 6 L6 18" />,
  wave: (
    <>
      <path d="M3 15 C6 11 9 11 12 15 C15 19 18 19 21 15" />
      <path d="M3 9 C6 5 9 5 12 9 C15 13 18 13 21 9" />
    </>
  ),
  check: <path d="M5 12 L10 17 L19 7" />,
  arrow: <path d="M4 12 H20 M14 6 L20 12 L14 18" />,
}
export type IconName = keyof typeof PATHS

export function Icon({ name, color = '#3B2A20', size = 22, width = 1.8 }: { name: IconName; color?: string; size?: number; width?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} style={{ strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round', flex: 'none' }} aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}

export function TopBar({ onBack, onClose, right, label }: { onBack?: () => void; onClose?: () => void; right?: ReactNode; label?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0', minHeight: 58 }}>
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="뒤로">
          <Icon name="back" />
        </button>
      ) : label ? (
        <span style={{ fontSize: 14, fontWeight: 800, paddingLeft: 8 }}>{label}</span>
      ) : (
        <span style={{ width: 44 }} />
      )}
      {onClose ? (
        <button className="icon-btn" onClick={onClose} aria-label="닫기" style={{ justifyContent: 'flex-end' }}>
          <Icon name="x" />
        </button>
      ) : (
        <span style={{ minWidth: 44, textAlign: 'right' }}>{right}</span>
      )}
    </div>
  )
}

export type Tab = 'home' | 'record' | 'prevent' | 'my'
export function TabBar({ on, go, bg = 'var(--bg)' }: { on: Tab; go: (t: Tab) => void; bg?: string }) {
  const items: [Tab, string][] = [
    ['home', '홈'],
    ['record', '기록'],
    ['prevent', '예방'],
    ['my', '나'],
  ]
  return (
    <nav style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, paddingBottom: 10, background: bg, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 5 }}>
      {items.map(([k, l]) => (
        <button key={k} onClick={() => go(k)} aria-current={k === on ? 'page' : undefined} style={{ border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 56, minHeight: 44, justifyContent: 'center', fontSize: 14, fontWeight: k === on ? 800 : 600, color: k === on ? 'var(--ink)' : 'var(--mute)' }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: k === on ? 'var(--ac)' : 'transparent' }} />
          {l}
        </button>
      ))}
    </nav>
  )
}

const SHADES = ['#FBD9BF', '#F8C29A', '#F2A672', '#EC8A4C', '#E06A1F']
// 막대가 점점 길어지는 강도 선택 (1~5)
export function LevelBars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label="피우고 싶은 정도" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {LEVELS.map((l, i) => {
        const v = i + 1
        const on = v === value
        return (
          <button key={l} role="radio" aria-checked={on} onClick={() => onChange(v)} style={{ display: 'flex', alignItems: 'center', gap: 14, border: 'none', background: 'transparent', padding: 0, textAlign: 'left', minHeight: 36 }}>
            <span style={{ height: 34, width: 56 + i * 40, borderRadius: 10, background: v <= value ? SHADES[i] : 'var(--soft)', transition: 'background .2s' }} />
            <span style={{ fontSize: 15, fontWeight: on ? 800 : 500, color: on ? 'var(--ink)' : 'var(--mute)' }}>{l}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} style={{ width: 46, height: 28, borderRadius: 14, border: 'none', padding: 0, background: on ? 'var(--ac)' : '#E5DACD', position: 'relative', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 11, background: '#fff', transition: 'left .2s' }} />
    </button>
  )
}

export function Tags({ items, value, onToggle }: { items: string[]; value: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="tags">
      {items.map((t) => (
        <button key={t} className={'tag' + (value.includes(t) ? ' on' : '')} aria-pressed={value.includes(t)} onClick={() => onToggle(t)}>
          {t}
        </button>
      ))}
    </div>
  )
}
