import { useState } from 'react'
import { useApp } from '../App'
import { TabBar, useDesktop } from '../components/ui'
import { sfx } from '../sfx'
import { PreventTabs } from './Prevent'

// 담배 종류별 '겉으로 하는 말' vs '실제로 들어있는 것'
const PRODUCTS = [
  {
    id: 'cig',
    name: '일반 담배',
    claim: '그냥 한 개비인데 뭐 어때',
    facts: [
      '담배에는 화학물질 7,000여 종, 발암물질 70여 종이 들어있어 (WHO 기준)',
      '2026년 식약처 검사에서 모든 일반 담배 제품에서 포름알데히드·벤젠·카드뮴 같은 1급 발암물질이 나왔어',
      '니코틴은 피우고 7초 만에 뇌에 도착해서 또 피우고 싶게 만들어',
    ],
    src: '식품의약품안전처(2026), 국민건강보험공단',
  },
  {
    id: 'heat',
    name: '궐련형 전자담배',
    claim: '태우는 게 아니라 찌는 거라 덜 해롭대',
    facts: [
      '2018년 식약처 분석에서 니코틴은 일반 담배랑 비슷한 수준이었어',
      '타르는 두 제품에서 9.1~9.3mg으로, 일반 담배(0.1~8.0mg)보다 높게 나왔어',
      '벤젠·포름알데히드 같은 1급 발암물질도 나왔어. 식약처는 “덜 해롭다는 근거가 없다”고 했어',
    ],
    src: '식품의약품안전처 궐련형 전자담배 유해성분 분석(2018)',
  },
  {
    id: 'vape',
    name: '액상형 전자담배',
    claim: '과일향 나는 수증기라 괜찮아',
    facts: [
      '들이마시는 건 수증기가 아니라 니코틴과 유해물질이 섞인 에어로졸이야',
      '2026년 식약처 검사에서 105개 제품 중 99개에서 포름알데히드가 나왔고, 전 제품에서 니코틴이 확인됐어',
      '과일·민트 향은 청소년이 쉽게 시작하게 만드는 장치로 꼽혀',
    ],
    src: '식품의약품안전처(2026), 질병관리청',
  },
]

const STUFF = [
  { name: '일산화탄소', also: '자동차 배기가스', hurt: '피가 산소를 못 나르게 막아' },
  { name: '니코틴', also: '중독을 만드는 물질', hurt: '혈압이랑 맥박을 올려' },
  { name: '타르', also: '끈적한 담뱃진', hurt: '발암물질이 뭉친 덩어리' },
  { name: '벤젠', also: '휘발유', hurt: '1급 발암물질' },
  { name: '포름알데히드', also: '포르말린(방부제)', hurt: '1급 발암물질' },
  { name: '카드뮴', also: '배터리 원료 중금속', hurt: '1급 발암물질' },
]

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
              style={{ border: 'none', textAlign: 'left', borderRadius: 18, padding: '14px 14px 12px', minHeight: 92, background: on ? 'var(--tint)' : 'var(--card)', boxShadow: 'inset 0 -3px 0 rgba(59,42,32,.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <span style={{ fontSize: 16, fontWeight: 900 }}>{x.name}</span>
              {on ? (
                <span className="flip-in" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.45, color: '#5C4636' }}>
                  <b style={{ color: 'var(--deep)' }}>{x.also}</b>에도 있는 것
                  <br />
                  {x.hurt}
                </span>
              ) : (
                <span className="cap">어디에 쓰일까?</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{cards}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {stuff}
            {bottom}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 20px 28px' }}>
          {cards}
          <div style={{ marginTop: 14 }}>{stuff}</div>
          <div style={{ marginTop: 8 }}>{bottom}</div>
        </div>
      )}
      <TabBar on="prevent" go={go} />
    </div>
  )
}
