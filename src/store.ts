// 앱 데이터는 전부 이 기기의 localStorage에만 저장함 (서버로 보내지 않음)

export type Mode = 'quit' | 'prevent'

export interface Profile {
  nickname: string
  mode: Mode
  period: string
  kind: string
  count: string
  weeklyCost: number
  reasons: string[]
  times: string[]
  confidence: number
  startDate: string // 금연(또는 예방) 시작일 ISO
}

export interface Hold {
  id: string
  at: string // 시작 시각 ISO
  before: number // 시작할 때 강도 1~5
  after: number | null // 끝난 뒤 강도
  place: string
  mood: string
  with: string
  missions?: string[] // 이번에 완료한 미션 id
}

export interface Breath {
  at: string
  sec: number // 한 번에 내쉰 시간(초)
}

export interface Settings {
  sound: boolean
  vibrate: boolean
  sfx?: boolean // 효과음 (없으면 켜짐)
  alert?: boolean // 위험 시간 10분 전 알림
}


export interface Data {
  profile: Profile | null
  holds: Hold[]
  settings: Settings
  breaths?: Breath[] // 숨 체크 기록
  bubbles: number // 미니게임에서 터뜨린 방울 누적
  refusals: number // 거절 연습에서 좋은 답을 고른 횟수
  quizBest: number
}

const KEY = 'sanbunman:v1'

export const emptyData = (): Data => ({
  profile: null,
  holds: [],
  settings: { sound: true, vibrate: true, sfx: true },
  bubbles: 0,
  refusals: 0,
  quizBest: 0,
})

export function load(): Data {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyData()
    return { ...emptyData(), ...JSON.parse(raw) }
  } catch {
    return emptyData()
  }
}

export function save(d: Data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d))
  } catch {
    /* 저장 공간이 없거나 막힌 환경에서는 메모리로만 동작 */
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10)

const DAY = 86400000
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

// 시작일부터 오늘까지 며칠째인지 (시작한 날 = 1일째)
export function dayCount(p: Profile | null, now = new Date()) {
  if (!p) return 0
  const s = startOfDay(new Date(p.startDate)).getTime()
  return Math.max(1, Math.floor((startOfDay(now).getTime() - s) / DAY) + 1)
}

export function savedMoney(p: Profile | null, now = new Date()) {
  if (!p || p.mode !== 'quit') return 0
  const days = (now.getTime() - new Date(p.startDate).getTime()) / DAY
  return Math.max(0, Math.round(((p.weeklyCost / 7) * days) / 100) * 100)
}

export const won = (n: number) => '₩' + n.toLocaleString('ko-KR')

// 가장 자주 약해진 상황 (장소 + 시간대)
export function dangerTime(holds: Hold[]) {
  if (holds.length < 2) return null
  const count = new Map<string, number>()
  for (const h of holds) {
    const hour = new Date(h.at).getHours()
    const slot = hour < 12 ? '아침' : hour < 15 ? '점심쯤' : hour < 18 ? `${hour - 12}시쯤` : hour < 22 ? '저녁' : '밤늦게'
    const k = `${h.place} ${slot}`
    count.set(k, (count.get(k) ?? 0) + 1)
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

// XP: 버티기 10, 미션 하나 10, 거절 연습 성공 5, 방울 5개당 1
export function xpOf(d: Data) {
  return d.holds.length * 10 + d.holds.reduce((n, h) => n + (h.missions?.length ?? 0) * 10, 0) + d.refusals * 5 + Math.floor(d.bubbles / 5)
}

export interface Sticker {
  id: string
  label: string
  got: boolean
}

export function stickers(d: Data): Sticker[] {
  const days = dayCount(d.profile)
  const late = d.holds.some((h) => {
    const hr = new Date(h.at).getHours()
    return hr >= 22 || hr < 5
  })
  return [
    { id: 'first', label: '첫 버티기', got: d.holds.length >= 1 },
    { id: 'three', label: '3일 연속', got: days >= 3 },
    { id: 'wave', label: '하교길 파도타기', got: d.holds.some((h) => h.place === '하교길') },
    { id: 'night', label: '밤늦게 버티기', got: late },
    { id: 'seven', label: '7일 연속', got: days >= 7 },
    { id: 'game', label: '미니게임 마스터', got: d.bubbles >= 50 },
    { id: 'refuse', label: '거절 고수', got: d.refusals >= 5 },
    { id: 'thirty', label: '30일 연속', got: days >= 30 },
  ]
}

// 금연 후 몸의 회복 단계 (WHO 금연 효과 안내 기준)
export const RECOVERY = [
  { hours: 1 / 3, short: '20분', label: '혈압 안정', key: '심박수와 혈압', rest: '이 안정되기 시작해' },
  { hours: 12, short: '12시간', label: '일산화탄소 정상', key: '일산화탄소', rest: '가 정상으로 돌아와' },
  { hours: 24 * 14, short: '2주', label: '폐 기능 개선', key: '폐 기능', rest: '이 좋아지기 시작해' },
  { hours: 24 * 365, short: '1년', label: '심장 위험 감소', key: '심장질환 위험', rest: '이 크게 줄어들어' },
]

// 예시 데이터: 심사·시연용으로 12일째 사용자처럼 채움
export function demoData(): Data {
  const now = new Date()
  const start = new Date(now.getTime() - 11 * DAY - 3 * 3600000)
  const places = ['하교길', '하교길', '학교', '집', '학원']
  const moods = ['스트레스', '심심함', '스트레스', '피곤함']
  const holds: Hold[] = []
  for (let i = 0; i < 27; i++) {
    const day = (i * 7) % 11
    const at = new Date(startOfDay(new Date(now.getTime() - day * DAY)).getTime() + (i % 3 === 0 ? 22.5 : 16.2) * 3600000)
    if (at > now) continue
    const before = 3 + (i % 3)
    holds.push({
      id: uid(),
      at: at.toISOString(),
      before,
      after: Math.max(1, before - 1 - (i % 2)),
      place: places[i % places.length],
      mood: moods[i % moods.length],
      with: i % 4 === 0 ? '친구' : '혼자',
      missions: [['breath', 'water', 'walk'], ['breath', 'bubble'], ['stretch', 'water', 'message'], ['walk', 'reasons', 'breath']][i % 4],
    })
  }
  return {
    ...emptyData(),
    profile: {
      nickname: '하준',
      mode: 'quit',
      period: '반년 안',
      kind: '전자담배',
      count: '1~5번',
      weeklyCost: 10500,
      reasons: ['건강', '돈'],
      times: ['하교길', '스트레스 받을 때'],
      confidence: 3,
      startDate: start.toISOString(),
    },
    holds,
    breaths: [14.2, 15.1, 14.8, 16.3, 17.0, 18.4].map((sec, i) => ({ at: new Date(now.getTime() - (10 - i * 2) * DAY).toISOString(), sec })),
    bubbles: 32,
    refusals: 3,
  }
}

// 미션별로 평균 몇 단계 내려갔는지 (2번 이상 한 미션만)
export function missionEffect(holds: Hold[]) {
  const m = new Map<string, { sum: number; n: number }>()
  for (const h of holds) {
    if (h.after == null || !h.missions) continue
    for (const id of h.missions) {
      const v = m.get(id) ?? { sum: 0, n: 0 }
      v.sum += h.before - h.after
      v.n += 1
      m.set(id, v)
    }
  }
  return [...m.entries()].filter(([, v]) => v.n >= 2).map(([id, v]) => ({ id, avg: v.sum / v.n, n: v.n })).sort((a, b) => b.avg - a.avg)
}


// ---------- 위험 시간 ----------
export function hourLabel(h: number) {
  if (h < 5) return `새벽 ${h === 0 ? 12 : h}시쯤`
  if (h < 12) return `오전 ${h}시쯤`
  if (h === 12) return '낮 12시쯤'
  if (h < 18) return `오후 ${h - 12}시쯤`
  return `밤 ${h - 12}시쯤`
}

export interface DangerPlan {
  hour: number
  label: string
  place: string
  mood: string
  count: number
  total: number
}

const mode = (xs: string[]) => {
  const c = new Map<string, number>()
  xs.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1))
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
}

// 기록에서 제일 많이 당긴 시간대(1시간 단위)와 그때 주로 있던 장소·기분
export function dangerPlan(holds: Hold[]): DangerPlan | null {
  if (holds.length < 3) return null
  const byHour = new Map<number, Hold[]>()
  holds.forEach((h) => {
    const k = new Date(h.at).getHours()
    byHour.set(k, [...(byHour.get(k) ?? []), h])
  })
  const [hour, list] = [...byHour.entries()].sort((a, b) => b[1].length - a[1].length)[0]
  if (list.length < 2) return null
  return { hour, label: hourLabel(hour), place: mode(list.map((h) => h.place)), mood: mode(list.map((h) => h.mood)), count: list.length, total: holds.length }
}

// 위험 시간 15분 전부터 1시간 동안은 '지금 조심할 때'
export function inDanger(plan: DangerPlan, now = new Date()) {
  const m = now.getHours() * 60 + now.getMinutes()
  const start = plan.hour * 60 - 15
  return m >= start && m < plan.hour * 60 + 60
}

// 다음 알림 시각: 위험 시간 10분 전
export function nextAlertAt(plan: DangerPlan, now = new Date()) {
  const t = new Date(now)
  t.setHours(plan.hour, 0, 0, 0)
  t.setMinutes(-10)
  if (t <= now) t.setDate(t.getDate() + 1)
  return t
}
