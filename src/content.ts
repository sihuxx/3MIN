export const LEVELS = ['살짝 생각나', '조금 당겨', '꽤 피우고 싶어', '많이 피우고 싶어', '참기 힘들어']

export const PLACES = ['학교', '집', '하교길', '학원', '기타']
export const MOODS = ['스트레스', '심심함', '피곤함', '화남']
export const WITH = ['혼자', '친구', '가족']

// 3분 동안 하나씩 해보는 행동 미션
export const MISSIONS = [
  { text: '물 한 컵\n천천히 마셔봐', done: '마셨어' },
  { text: '자리에서 일어나\n기지개 쭉 펴기', done: '폈어' },
  { text: '찬물로\n손 씻고 오기', done: '씻었어' },
  { text: '좋아하는 노래\n한 곡 틀기', done: '틀었어' },
  { text: '껌이나 사탕\n하나 먹기', done: '먹었어' },
  { text: '창문 열고\n바깥 공기 마시기', done: '마셨어' },
  { text: '친구한테\n“나 참는 중” 보내기', done: '보냈어' },
]

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
