import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { load, save, type Data } from './store'
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

export type Route = 'title' | 'onboarding' | 'home' | 'check' | 'hold' | 'game' | 'result' | 'record' | 'stickers' | 'prevent' | 'quiz' | 'my'

// 지금 진행 중인 3분 버티기
export interface Session {
  before: number
  place: string
  mood: string
  with: string
  startedAt: number
  mission: number
  missionsDone: number
}

interface Ctx {
  data: Data
  update: (fn: (d: Data) => Data) => void
  go: (r: Route) => void
  session: Session | null
  setSession: (s: Session | null) => void
}
const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

export const HOLD_SECONDS = 180

export default function App() {
  const [data, setData] = useState<Data>(load)
  const [route, setRoute] = useState<Route>(() => (load().profile ? 'home' : 'title'))
  const [session, setSession] = useState<Session | null>(null)

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
  }

  return (
    <AppCtx.Provider value={{ data, update, go, session, setSession }}>
      <div className="app">{screens[route]}</div>
    </AppCtx.Provider>
  )
}
