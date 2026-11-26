import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { dangerPlan, load, nextAlertAt, save, type Data } from './store'
import { setSfxEnabled, sfx } from './sfx'
import Title from './screens/Title'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Check from './screens/Check'
import Hold from './screens/Hold'
import Game from './screens/Game'
import Result from './screens/Result'
import Record from './screens/Record'
import Stickers from './screens/Stickers'
import Prevent from './screens/Prevent'
import Quiz from './screens/Quiz'
import My from './screens/My'
import Inside from './screens/Inside'
import Lung from './screens/Lung'
import Sidebar from './components/Sidebar'
import { fireAlert } from './components/Danger'
import { useDesktop } from './components/ui'

export type Route = 'title' | 'onboarding' | 'home' | 'check' | 'hold' | 'game' | 'result' | 'record' | 'stickers' | 'prevent' | 'quiz' | 'my' | 'inside' | 'lung'

// 지금 진행 중인 3분 버티기
export interface Session {
  before: number
  place: string
  mood: string
  with: string
  startedAt: number
  missions: string[] // 이번에 할 미션 3개
  done: string[] // 끝낸 미션
  cur: number // 지금 보고 있는 미션 위치
  bubbles: number // 이번 세션에서 터뜨린 방울
}

interface Ctx {
  data: Data
  update: (fn: (d: Data) => Data) => void
  go: (r: Route) => void
  session: Session | null
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
}
export const AppCtx = createContext<Ctx | null>(null)
export const useApp = () => useContext(AppCtx)!

export const HOLD_SECONDS = 180
const TAB_ROUTES: Route[] = ['home', 'record', 'stickers', 'prevent', 'quiz', 'inside', 'lung', 'my']

export default function App() {
  const [data, setData] = useState<Data>(load)
  const [route, setRoute] = useState<Route>(() => (load().profile ? 'home' : 'title'))
  const [session, setSession] = useState<Session | null>(null)
  const desk = useDesktop()
  useEffect(() => setSfxEnabled(data.settings.sfx !== false), [data.settings.sfx])

  // 위험 시간 10분 전 알림 예약 (앱이 열려 있는 동안)
  const [alertRound, setAlertRound] = useState(0)
  useEffect(() => {
    if (!data.settings.alert) return
    const plan = dangerPlan(data.holds)
    if (!plan) return
    const ms = nextAlertAt(plan).getTime() - Date.now()
    if (ms > 2 ** 31 - 1) return
    const t = setTimeout(() => {
      fireAlert(plan)
      sfx.start()
      setAlertRound((n) => n + 1)
    }, ms)
    return () => clearTimeout(t)
  }, [data.settings.alert, data.holds, alertRound])

  const update = useCallback((fn: (d: Data) => Data) => {
    setData((prev) => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  const go = useCallback((r: Route) => {
    setRoute(r)
    document.querySelector('.screen')?.scrollTo(0, 0)
    document.querySelector('.desk-main')?.scrollTo(0, 0)
  }, [])

  // 휴대폰 뒤로가기 버튼을 누르면 홈으로
  useEffect(() => {
    history.pushState(null, '', location.href)
    const onPop = () => {
      history.pushState(null, '', location.href)
      setRoute((r) => (r === 'home' || r === 'title' ? r : data.profile ? 'home' : 'title'))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [data.profile])

  const screens: Record<Route, React.ReactNode> = {
    title: <Title />,
    onboarding: <Onboarding />,
    home: <Home />,
    check: <Check />,
    hold: <Hold />,
    game: <Game />,
    result: <Result />,
    record: <Record />,
    stickers: <Stickers />,
    prevent: <Prevent />,
    quiz: <Quiz />,
    my: <My />,
    inside: <Inside />,
    lung: <Lung />,
  }

  return (
    <AppCtx.Provider value={{ data, update, go, session, setSession }}>
      <div className="app">
        {!desk ? (
          screens[route]
        ) : TAB_ROUTES.includes(route) ? (
          <>
            <Sidebar route={route} />
            <main className="desk-main">{screens[route]}</main>
          </>
        ) : (
          <main className="desk-flow" style={{ background: route === 'hold' ? 'var(--tint)' : 'var(--bg)' }}>
            {screens[route]}
          </main>
        )}
      </div>
    </AppCtx.Provider>
  )
}
