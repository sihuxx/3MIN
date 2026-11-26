import { useState } from 'react'
import { useApp } from '../App'
import { TabBar, useDesktop } from '../components/ui'
import { sfx } from '../sfx'
import { PreventTabs } from './Prevent'
import { PRODUCTS, STUFF } from '../content'
import { BodyMap, ProductArt, ThingArt } from '../components/InsideArt'

const CHEMS: Record<string, string[]> = {
  cig: ['니코틴', '타르', '일산화탄소', '벤젠', '카드뮴'],
  heat: ['니코틴', '타르', '벤젠', '포름알데히드'],
  vape: ['니코틴', '포름알데히드', '프로필렌글리콜'],
}

export default function Inside() {
  const { go } = useApp()
  const desk = useDesktop()
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [seen, setSeen] = useState<Record<string, boolean>>({})

  const cards = PRODUCTS.map((p) => {
    const on = !!open[p.id]
    return (
      <div key={p.id} style={{ background: on ? 'var(--card)' : 'var(--tint)', borderRadius: 24, padding: '18px 20px 18px', transition: 'background .25s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--deep)' }}>{p.name}</span>
          {on && <span className="cap">속</span>}
        </div>
        <ProductArt id={p.id} open={on} chems={CHEMS[p.id]} onTap={() => !on && setOpen((o) => ({ ...o, [p.id]: true }))} />
        {!on ? (
          <div key="front" className="flip-in">
            <p style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.4, marginTop: 10 }}>“{p.claim}”</p>
            <button
              className="pill white"
              style={{ marginTop: 14 }}
              onClick={() => {
                setOpen({ ...open, [p.id]: true })
                sfx.step()
              }}
            >
              속 까보기
            </button>
          </div>
        ) : (
          <div key="back" className="flip-in">
            <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.facts.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ac)', marginTop: 9, flex: 'none' }} />
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 10 }}>
              <span className="cap" style={{ fontSize: 11 }}>출처 · {p.src}</span>
              <button className="pill" style={{ minHeight: 36, padding: '0 12px', fontSize: 13, flex: 'none' }} onClick={() => setOpen({ ...open, [p.id]: false })}>
                다시 덮기
              </button>
            </div>
          </div>
        )}
      </div>
    )
  })

  const stuff = (
    <div>
      <h2 style={{ fontSize: 18 }}>이런 것도 들어있어</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginTop: 12 }}>
        {STUFF.map((x) => {
          const on = !!seen[x.name]
          return (
            <button
              key={x.name}
              onClick={() => {
                setSeen({ ...seen, [x.name]: !on })
                sfx.step()
              }}
              aria-pressed={on}
              style={{ border: 'none', textAlign: 'left', borderRadius: 18, padding: '14px 14px 12px', minHeight: 148, background: on ? 'var(--tint)' : 'var(--card)', boxShadow: 'inset 0 -3px 0 rgba(59,42,32,.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <span style={{ fontSize: 16, fontWeight: 900 }}>{x.name}</span>
              {on ? (
                <span className="flip-in" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <ThingArt name={x.name} size={52} />
                  <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.45, color: '#5C4636' }}>
                    <b style={{ color: 'var(--deep)' }}>{x.also}</b>에도 있는 것
                    <br />
                    {x.hurt}
                  </span>
                </span>
              ) : (
                <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: 'var(--ac)' }}>?</span>
                  <span className="cap">어디에 쓰일까?</span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  const bottom = (
    <div style={{ background: 'var(--btn)', color: '#fff', borderRadius: 22, padding: '18px 20px' }}>
      <p style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.45 }}>덜 해로운 담배는 없어</p>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6, marginTop: 6, color: '#FFE6D2' }}>
        식약처는 검출량이 적다고 덜 해로운 게 아니고, 담배 종류끼리 숫자로 단순 비교할 수도 없다고 했어.
      </p>
    </div>
  )

  return (
    <div className={'screen with-tab' + (desk ? '' : ' narrow')}>
      <PreventTabs on="inside" />
      {desk ? (
        <div className="desk-grid" style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BodyMap />
            <div style={{ height: 8 }} />
            {cards}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {stuff}
            {bottom}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 20px 28px' }}>
          <BodyMap />
          <h2 style={{ fontSize: 18, marginTop: 18 }}>담배 속 까보기</h2>
          {cards}
          <div style={{ marginTop: 14 }}>{stuff}</div>
          <div style={{ marginTop: 8 }}>{bottom}</div>
        </div>
      )}
      <TabBar on="prevent" go={go} />
    </div>
  )
}
