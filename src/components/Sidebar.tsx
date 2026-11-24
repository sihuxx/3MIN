import { useApp, type Route } from '../App'
import { dayCount } from '../store'
import Mascot from './Mascot'
import { Icon } from './ui'

const ITEMS: { label: string; route: Route; also?: Route[] }[] = [
  { label: '홈', route: 'home' },
  { label: '기록', route: 'record', also: ['stickers'] },
  { label: '예방', route: 'prevent', also: ['quiz'] },
  { label: '나', route: 'my' },
]

// 컴퓨터 화면에서 하단 탭 대신 쓰는 왼쪽 메뉴
export default function Sidebar({ route }: { route: Route }) {
  const { go, data } = useApp()
  const p = data.profile
  return (
    <aside style={{ width: 264, flex: 'none', padding: '40px 24px 32px', display: 'flex', flexDirection: 'column', gap: 6, background: '#F4EDE4' }}>
      <button onClick={() => go('home')} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '0 16px', marginBottom: 32, fontSize: 36, fontWeight: 900, letterSpacing: '-0.06em' }}>
        3분만<span style={{ color: 'var(--ac)' }}>.</span>
      </button>
      {ITEMS.map((it) => {
        const on = route === it.route || !!it.also?.includes(route)
        return (
          <button key={it.route} className={'side-item' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined} onClick={() => go(it.route)}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: on ? 'var(--ac)' : 'transparent' }} />
            {it.label}
          </button>
        )
      })}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 18px' }}>
        <span style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Mascot mood="happy" size={42} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.nickname ?? '친구'}</div>
          <div className="cap">{dayCount(p)}일째</div>
        </div>
      </div>
      <button onClick={() => go('check')} style={{ border: 'none', borderRadius: 20, background: 'var(--ac)', color: '#fff', padding: '18px 20px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>
          <span style={{ display: 'block', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>SOS</span>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 800, marginTop: 4 }}>3분만 버티기</span>
        </span>
        <Icon name="wave" color="#fff" size={30} width={2.2} />
      </button>
    </aside>
  )
}
