export const LEVELS = ['살짝 생각나', '조금 당겨', '꽤 피우고 싶어', '많이 피우고 싶어', '참기 힘들어']

export const PLACES = ['학교', '집', '하교길', '학원', '기타']
export const MOODS = ['스트레스', '심심함', '피곤함', '화남']
export const WITH = ['혼자', '친구', '가족']

// 3분 동안 하는 행동 미션: 종류마다 화면에서 실제로 하는 방식이 다름
export type MissionKind = 'breath' | 'timer' | 'steps' | 'game' | 'share' | 'reasons' | 'tap'
export interface Mission {
  id: string
  title: string
  kind: MissionKind
  seconds?: number // timer, steps(단계별), reasons
  steps?: string[]
  target?: number // game
  doing?: string // 진행 중 문구
  cta: string // 시작 버튼
  short: string // 기록·통계용 짧은 이름
}

export const MISSIONS: Mission[] = [
  { id: 'breath', title: '숨 크게\n세 번 쉬기', kind: 'breath', cta: '같이 숨 쉬기', short: '호흡' },
  { id: 'water', title: '물 한 컵\n천천히 마시기', kind: 'timer', seconds: 30, doing: '한 모금씩 천천히', cta: '마시기 시작', short: '물 마시기' },
  { id: 'stretch', title: '자리에서 일어나\n스트레칭', kind: 'steps', seconds: 10, steps: ['두 팔을 위로 쭉 뻗기', '목을 천천히 한 바퀴', '어깨 으쓱 올렸다 툭'], cta: '따라 하기', short: '스트레칭' },
  { id: 'wash', title: '찬물로\n손 씻고 오기', kind: 'timer', seconds: 20, doing: '손가락 사이까지 꼼꼼히', cta: '씻으러 가기', short: '손 씻기' },
  { id: 'walk', title: '30걸음\n걸어보기', kind: 'timer', seconds: 30, doing: '하나, 둘, 셋… 걸음 세면서', cta: '걷기 시작', short: '걷기' },
  { id: 'bubble', title: '연기 방울\n15개 터뜨리기', kind: 'game', target: 15, cta: '게임하러 가기', short: '버블 팡' },
  { id: 'message', title: '친구한테\n“나 참는 중” 보내기', kind: 'share', cta: '보내기', short: '친구 알리기' },
  { id: 'reasons', title: '내가 끊는 이유\n다시 보기', kind: 'reasons', seconds: 8, cta: '이유 보기', short: '이유 보기' },
  { id: 'gum', title: '껌이나 사탕\n하나 먹기', kind: 'tap', cta: '먹었어', short: '껌·사탕' },
]
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id) ?? MISSIONS[0]

// 지금 상황에 맞는 미션 3개 고르기
export function pickMissions(ctx: { place: string; mood: string; with: string }, rand = Math.random, recent: string[] = []) {
  const score: Record<string, number> = {}
  // 무작위 폭을 넉넉히 둬서 같은 상황이어도 매번 조금씩 다르게
  for (const m of MISSIONS) score[m.id] = rand() * 5
  // 지난번에 한 미션은 살짝 덜 나오게
  recent.forEach((id) => score[id] !== undefined && (score[id] -= 2.5))
  const add = (ids: string[], n: number) => ids.forEach((id) => (score[id] += n))
  if (ctx.mood === '스트레스' || ctx.mood === '화남') add(['breath'], 6)
  if (ctx.mood === '심심함') add(['bubble', 'walk'], 4)
  if (ctx.mood === '피곤함') add(['water', 'stretch'], 4)
  if (ctx.place === '학교' || ctx.place === '학원') add(['water', 'stretch', 'wash'], 3)
  if (ctx.place === '하교길') add(['walk', 'message', 'reasons'], 3)
  if (ctx.place === '집') add(['wash', 'gum', 'stretch'], 3)
  if (ctx.with === '친구') add(['reasons', 'breath'], 3)
  if (ctx.with === '혼자') add(['message', 'bubble'], 2)
  if (ctx.with === '가족') add(['walk', 'reasons', 'water'], 2)
  const ranked = MISSIONS.map((m) => m.id).sort((a, b) => score[b] - score[a])
  // 같은 종류만 3개 나오지 않게
  const out: string[] = []
  const kinds = new Set<string>()
  for (const id of ranked) {
    const k = missionById(id).kind
    if (kinds.has(k) && ranked.length - out.length > 3) continue
    out.push(id)
    kinds.add(k)
    if (out.length === 3) break
  }
  return out
}

export interface Scenario {
  place: string
  friend: string
  line: string
  options: { text: string; good: boolean; reply: string }[]
}

// 거절 연습 상황들
export const SCENARIOS: Scenario[] = [
  {
    place: '노래방 · 친구 3명',
    friend: '민',
    line: '한 번만 해 봐.\n전자담배는 냄새도 안 나',
    options: [
      { text: '나 이거 안 해. 노래나 부르자', good: true, reply: '좋아! 짧게 거절하고 화제를 돌리면 분위기도 안 깨져' },
      { text: '다음에 할게…', good: false, reply: '“다음에”는 또 권해도 된다는 뜻으로 들릴 수 있어. 확실하게 말하자' },
      { text: '딱 한 번만 해 볼까', good: false, reply: '한 번이 두 번 되는 건 금방이야. 다시 골라볼래?' },
    ],
  },
  {
    place: '하교길 · 선배',
    friend: '선배',
    line: '야, 너도 하나 펴.\n다 피는데 뭐 어때',
    options: [
      { text: '저 끊었어요. 먼저 갈게요!', good: true, reply: '좋아! 이유 길게 말할 필요 없어. 자리를 뜨는 것도 방법이야' },
      { text: '그럼 하나만 주세요', good: false, reply: '선배라도 거절해도 괜찮아. 다시 골라볼래?' },
      { text: '아… 그게… 음…', good: false, reply: '머뭇거리면 계속 권할 수 있어. 짧고 분명하게!' },
    ],
  },
  {
    place: '쉬는 시간 · 화장실',
    friend: '준',
    line: '쌤 안 와.\n빨리 한 모금만 해',
    options: [
      { text: '들키는 게 문제가 아니라 난 안 해', good: true, reply: '좋아! 들킬까 봐가 아니라 내가 안 하는 거라고 말하는 게 제일 단단해' },
      { text: '망보고 있을게', good: false, reply: '같이 있으면 결국 권유받기 쉬워. 그 자리를 피하는 게 좋아' },
      { text: '쌤 오면 어떡해…', good: false, reply: '이유를 “들킬까 봐”로 하면 안 들킬 땐 거절하기 어려워져' },
    ],
  },
  {
    place: '시험 끝난 날 · 친구들',
    friend: '서',
    line: '시험 끝났잖아.\n오늘 같은 날은 한 대 해야지',
    options: [
      { text: '난 떡볶이로 축하할래. 같이 가자', good: true, reply: '좋아! 다른 축하 방법을 제안하면 거절이 훨씬 자연스러워' },
      { text: '오늘만 특별히?', good: false, reply: '“특별한 날”은 생각보다 자주 와. 다시 골라볼래?' },
      { text: '…', good: false, reply: '대답을 안 하면 동의로 받아들일 수 있어. 말로 분명하게!' },
    ],
  },
  {
    place: '단톡방 · 반 친구',
    friend: '현',
    line: '전자담배 새 맛 나왔대ㅋㅋ\n너도 한번 맡아봐',
    options: [
      { text: '난 패스ㅋㅋ 냄새도 별로야', good: true, reply: '좋아! 가볍게 웃으면서 거절해도 충분해' },
      { text: '무슨 맛인데?', good: false, reply: '관심을 보이면 대화가 계속 그쪽으로 흘러가. 다시 골라볼래?' },
      { text: '맛만 보는 건 괜찮지 않아?', good: false, reply: '맛만 봐도 니코틴은 들어가. 다시 골라볼래?' },
    ],
  },
]

export interface Quiz {
  q: string
  answer: boolean // true = O
  why: string
}

// OX 퀴즈 (WHO·보건복지부 금연 안내에 나오는 내용 기준)
export const QUIZ: Quiz[] = [
  { q: '전자담배는 냄새가\n안 나니까 몸에도\n덜 해롭다?', answer: false, why: '전자담배에도 니코틴이 들어 있어서 똑같이 중독될 수 있어' },
  { q: '담배를 끊으면 20분 만에\n심박수와 혈압이\n내려가기 시작한다?', answer: true, why: '몸은 생각보다 빨리 회복을 시작해' },
  { q: '가끔 한두 개비\n피우는 건\n중독되지 않는다?', answer: false, why: '청소년은 적은 양으로도 니코틴에 의존하게 될 수 있어' },
  { q: '담배가 당기는 마음은\n보통 몇 분 지나면\n약해진다?', answer: true, why: '그래서 딱 3분만 다른 데 집중해도 넘길 수 있어' },
  { q: '간접흡연은\n피우는 사람에게만\n해롭다?', answer: false, why: '연기는 옆 사람 몸에도 그대로 들어가' },
  { q: '금연 12시간 뒤면\n혈액 속 일산화탄소가\n정상으로 돌아온다?', answer: true, why: '반나절만 참아도 몸속 일산화탄소가 줄어들어' },
  { q: '청소년은 어른보다\n니코틴에 더 빨리\n중독될 수 있다?', answer: true, why: '자라는 중인 뇌는 니코틴에 더 민감해' },
  { q: '향이 좋은 액상은\n몸에 해롭지 않다?', answer: false, why: '좋은 향이어도 가열하면 몸에 해로운 물질이 생길 수 있어' },
  { q: '만 19세 미만에게\n담배를 파는 건\n법으로 금지돼 있다?', answer: true, why: '청소년보호법에서 담배를 청소년 유해약물로 정하고 있어' },
  { q: '담배를 끊고 1년이 지나면\n심장질환 위험이\n크게 줄어든다?', answer: true, why: '1년만 버텨도 심장이 훨씬 건강해져' },
]

// 담배 종류별 '겉으로 하는 말' vs '실제로 들어있는 것'
export const PRODUCTS = [
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

export const STUFF = [
  { name: '일산화탄소', also: '자동차 배기가스', hurt: '피가 산소를 못 나르게 막아' },
  { name: '니코틴', also: '살충제', hurt: '중독을 만들고 혈압·맥박을 올려' },
  { name: '타르', also: '아스팔트', hurt: '발암물질이 뭉친 끈적한 담뱃진' },
  { name: '벤젠', also: '휘발유', hurt: '1급 발암물질' },
  { name: '포름알데히드', also: '포르말린', hurt: '방부제로 쓰는 1급 발암물질' },
  { name: '카드뮴', also: '건전지', hurt: '중금속, 1급 발암물질' },
]

// 오늘의 성분 퀴즈: 이 물질은 또 어디에 들어있을까? (오답은 생활용품)
const SAFE = ['우유', '치약', '샴푸', '보리차', '비누', '딸기잼']
export function dailyFact(day: number) {
  const x = STUFF[day % STUFF.length]
  const a = SAFE[day % SAFE.length]
  const b = SAFE[(day + 3) % SAFE.length]
  const opts = [x.also, a, b]
  const shift = day % 3
  return { ...x, options: [...opts.slice(shift), ...opts.slice(0, shift)] }
}
