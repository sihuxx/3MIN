import { useEffect, useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { Icon, LevelBars, TopBar, useDesktop } from '../components/ui'
import { stickers, uid, type Hold } from '../store'
import { missionById, pickMissions } from '../content'
import { sfx } from '../sfx'

export default function Result() {
  const { session, setSession, go, update, data } = useApp()
  const [after, setAfter] = useState(Math.max(1, (session?.before ?? 3) - 1))
  const [saved, setSaved] = useState<{ before: number; after: number; newSticker: string | null; missions: string[] } | null>(null)

  const desk = useDesktop()
  const lost = !session && !saved
  const last = data.holds[data.holds.length - 1]
  useEffect(() => {
    if (lost) go('home')
  }, [lost, go])
  if (lost) return null

  const submit = () => {
    if (!session) return
    const hold: Hold = { id: uid(), at: new Date(session.startedAt).toISOString(), before: session.before, after, place: session.place, mood: session.mood, with: session.with, missions: session.done }
    const had = new Set(stickers(data).filter((s) => s.got).map((s) => s.id))
    const next = { ...data, holds: [...data.holds, hold] }
    const got = stickers(next).find((s) => s.got && !had.has(s.id))
    update((d) => ({ ...d, holds: [...d.holds, hold] }))
    sfx.success()
    setSaved({ before: session.before, after, newSticker: got?.label ?? null, missions: session.done })
    setSession(null)
  }

  const again = () => {
    const ctx = { place: last?.place ?? '학교', mood: last?.mood ?? '스트레스', with: last?.with ?? '혼자' }
    setSession({ before: saved?.after ?? 3, ...ctx, startedAt: Date.now(), missions: pickMissions(ctx), done: [], cur: 0, bubbles: 0 })
    go('hold')
  }

  if (!saved) {
    const head = (
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ac)' }}>3분 버텼어!</div>
        <h1 style={{ marginTop: 8, fontSize: desk ? 44 : 30, lineHeight: 1.3 }}>
          지금은 얼마나
          <br />
          피우고 싶어?
        </h1>
        <p style={{ marginTop: 12, fontSize: 15, color: 'var(--mute)', fontWeight: 600 }}>시작할 때는 {session?.before}단계였어</p>
      </div>
    )
    if (desk)
      return (
        <div className="screen wide2 fade-in" style={{ justifyContent: 'center', padding: '0 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 64, alignItems: 'center' }}>
            <div>
              {head}
              <div style={{ marginTop: 32 }}><Mascot mood="happy" size={180} /></div>
            </div>
            <div>
              <LevelBars value={after} onChange={setAfter} />
              <button className="btn" style={{ marginTop: 32 }} onClick={submit}>결과 보기</button>
            </div>
          </div>
        </div>
      )
    return (
      <div className="screen fade-in">
        <TopBar />
        <div className="pad">{head}</div>
        <div className="pad" style={{ marginTop: 28 }}>
          <LevelBars value={after} onChange={setAfter} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Mascot mood="happy" size={130} />
        </div>
        <div style={{ marginTop: 'auto', padding: '20px 24px 34px' }}>
          <button className="btn" onClick={submit}>
            결과 보기
          </button>
        </div>
      </div>
    )
  }

  const diff = saved.before - saved.after
  const msg = diff > 0 ? `참으니까\n${diff}단계나 내려갔어` : diff === 0 ? '그대로여도 괜찮아.\n3분 버틴 것 자체가 성공이야' : '더 힘들었구나.\n한 번 더 같이 버텨볼까?'
  const share = async () => {
    const text = `나 방금 담배 생각 3분 참았다! ${saved.before}단계 → ${saved.after}단계 (3분만 앱)`
    try {
      if (navigator.share) await navigator.share({ text })
      else await navigator.clipboard.writeText(text)
    } catch {
      /* 사용자가 공유를 취소함 */
    }
  }

  const numbers = (
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ac)' }}>3분 버텼어!</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 4 }}>
        <span style={{ fontSize: desk ? 160 : 120, fontWeight: 900, color: '#DCD1C6', lineHeight: 1, letterSpacing: '-0.05em' }}>{saved.before}</span>
        <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--mute)' }}>→</span>
        <span style={{ fontSize: desk ? 160 : 120, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}>{saved.after}</span>
      </div>
      <p style={{ marginTop: 14, fontSize: desk ? 28 : 22, fontWeight: 800, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{msg}</p>
    </div>
  )
  const missions = (
    <div style={{ background: 'var(--card)', borderRadius: 22, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 15, fontWeight: 800 }}>해낸 미션</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ac)' }}>{saved.missions.length}개</span>
      </div>
      {saved.missions.length === 0 ? (
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--mute)' }}>이번엔 미션 없이 버텼어. 그것도 대단해</p>
      ) : (
        <div className="tags" style={{ marginTop: 10 }}>
          {saved.missions.map((id) => (
            <span key={id} className="tag on" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="check" color="#C9581A" size={14} width={3} />
              {missionById(id).short}
            </span>
          ))}
        </div>
      )}
    </div>
  )
  const sticker = saved.newSticker && (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 62, height: 62, borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', background: 'var(--tint)', border: '4px solid #fff', transform: 'rotate(-8deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name="wave" color="var(--ac)" size={26} width={2.4} />
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>
        {saved.newSticker}
        <br />
        <span style={{ color: 'var(--mute)' }}>스티커 받음</span>
      </span>
    </div>
  )
  const actions = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="pill" style={{ flex: 1 }} onClick={again}>
          3분 더 버티기
        </button>
        <button className="pill" style={{ flex: 1 }} onClick={share}>
          친구한테 자랑
        </button>
      </div>
      <button className="btn" onClick={() => go('home')}>
        홈으로
      </button>
    </div>
  )

  if (desk)
    return (
      <div className="screen wide2 fade-in" style={{ justifyContent: 'center', padding: '0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)', gap: 64, alignItems: 'center' }}>
          <div>
            {numbers}
            <div style={{ marginTop: 20 }}><Mascot mood="cheer" size={200} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {missions}
            {sticker}
            {actions}
          </div>
        </div>
      </div>
    )

  return (
    <div className="screen fade-in">
      <TopBar onClose={() => go('home')} />
      <div className="pad" style={{ paddingTop: 6 }}>{numbers}</div>
      <div style={{ margin: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {missions}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '4px 20px 0 28px' }}>
        {sticker || <span />}
        <Mascot mood="cheer" size={130} />
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 24px 30px' }}>{actions}</div>
    </div>
  )
}
