import { useEffect, useState } from 'react'
import { useApp } from '../App'
import Mascot from '../components/Mascot'
import { Icon, LevelBars, TopBar } from '../components/ui'
import { stickers, uid, type Hold } from '../store'

export default function Result() {
  const { session, setSession, go, update, data } = useApp()
  const [after, setAfter] = useState(Math.max(1, (session?.before ?? 3) - 1))
  const [saved, setSaved] = useState<{ before: number; after: number; newSticker: string | null } | null>(null)

  const lost = !session && !saved
  useEffect(() => {
    if (lost) go('home')
  }, [lost, go])
  if (lost) return null

  const submit = () => {
    if (!session) return
    const hold: Hold = { id: uid(), at: new Date(session.startedAt).toISOString(), before: session.before, after, place: session.place, mood: session.mood, with: session.with }
    const had = new Set(stickers(data).filter((s) => s.got).map((s) => s.id))
    const next = { ...data, holds: [...data.holds, hold] }
    const got = stickers(next).find((s) => s.got && !had.has(s.id))
    update((d) => ({ ...d, holds: [...d.holds, hold] }))
    setSaved({ before: session.before, after, newSticker: got?.label ?? null })
    setSession(null)
  }

  const again = () => {
    setSession({ before: saved?.after ?? 3, place: session?.place ?? '학교', mood: session?.mood ?? '스트레스', with: session?.with ?? '혼자', startedAt: Date.now(), mission: Math.floor(Math.random() * 7), missionsDone: 0 })
    go('hold')
  }

  if (!saved) {
    return (
      <div className="screen fade-in">
        <TopBar />
        <div className="pad">
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ac)' }}>3분 버텼어!</div>
          <h1 style={{ marginTop: 8, fontSize: 30, lineHeight: 1.3 }}>
            지금은 얼마나
            <br />
            피우고 싶어?
          </h1>
        </div>
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

  return (
    <div className="screen fade-in">
      <TopBar onClose={() => go('home')} />
      <div className="pad" style={{ paddingTop: 6 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ac)' }}>3분 버텼어!</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: 120, fontWeight: 900, color: '#DCD1C6', lineHeight: 1, letterSpacing: '-0.05em' }}>{saved.before}</span>
          <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--mute)' }}>→</span>
          <span style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}>{saved.after}</span>
        </div>
        <p style={{ marginTop: 14, fontSize: 22, fontWeight: 800, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{msg}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '10px 20px 0 28px' }}>
        {saved.newSticker ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ width: 62, height: 62, borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', background: 'var(--tint)', border: '4px solid #fff', transform: 'rotate(-8deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="wave" color="var(--ac)" size={26} width={2.4} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>
              {saved.newSticker}
              <br />
              <span style={{ color: 'var(--mute)' }}>스티커 받음</span>
            </span>
          </div>
        ) : (
          <span />
        )}
        <Mascot mood="cheer" size={150} />
      </div>
      <div style={{ marginTop: 'auto', padding: '20px 24px 34px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button className="btn" onClick={() => go('home')}>
          홈으로
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 22 }}>
          <button className="u" style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, minHeight: 36 }} onClick={again}>
            아직 강해? 3분 더
          </button>
          <button className="u" style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, minHeight: 36 }} onClick={share}>
            친구한테 자랑
          </button>
        </div>
      </div>
    </div>
  )
}
