// 효과음: 음원 파일 없이 Web Audio로 직접 만드는 짧은 소리들
let ctx: AudioContext | null = null
let enabled = true

export function setSfxEnabled(on: boolean) {
  enabled = on
}

function ac() {
  if (!enabled) return null
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// 부드러운 종소리 같은 음 하나
function tone(freq: number, at: number, dur: number, vol = 0.18, type: OscillatorType = 'sine', slideTo?: number) {
  const c = ac()
  if (!c) return
  const t = c.currentTime + at
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568 }

export const sfx = {
  // SOS 누르고 버티기 시작
  start() {
    tone(N.G5, 0, 0.35, 0.14)
    tone(N.C6, 0.09, 0.5, 0.14)
  },
  // 미션 하나 완료
  mission() {
    tone(N.E5, 0, 0.18, 0.16, 'triangle')
    tone(N.G5, 0.08, 0.18, 0.16, 'triangle')
    tone(N.C6, 0.16, 0.45, 0.16, 'triangle')
  },
  // 3분 버티기 성공
  success() {
    ;[N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone(f, i * 0.11, 0.4, 0.15, 'triangle'))
    tone(N.E6, 0.5, 0.7, 0.1)
    tone(N.G6, 0.62, 0.8, 0.08)
  },
  // 마지막 10초 째깍
  tick(last = false) {
    tone(last ? N.C6 : N.A5, 0, 0.08, 0.08, 'square')
  },
  // 호흡: 들이쉬기(올라감) · 참기(유지) · 내쉬기(내려감)
  breath(phase: number) {
    if (phase === 0) tone(330, 0, 1.2, 0.08, 'sine', 523)
    else if (phase === 1) tone(523, 0, 0.6, 0.05)
    else tone(523, 0, 1.4, 0.08, 'sine', 294)
  },
  // 스트레칭 다음 동작, 타이머 미션 시작
  step() {
    tone(N.D5, 0, 0.15, 0.1, 'triangle')
  },
  // 연기 방울 터뜨리기
  pop() {
    tone(600 + Math.random() * 300, 0, 0.09, 0.14, 'sine', 180)
  },
  correct() {
    tone(N.G5, 0, 0.15, 0.14, 'triangle')
    tone(N.C6, 0.1, 0.35, 0.14, 'triangle')
  },
  wrong() {
    tone(260, 0, 0.18, 0.1, 'triangle')
    tone(196, 0.14, 0.32, 0.1, 'triangle')
  },
}
