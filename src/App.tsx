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
import Sidebar from './components/Sidebar'
import { useDesktop } from './components/ui'

export type Route = 'title' | 'onboarding' | 'home' | 'check' | 'hold' | 'game' | 'result' | 'record' | 'stickers' | 'prevent' | 'quiz' | 'my'

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
const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

export const HOLD_SECONDS = 180
const TAB_ROUTES: Route[] = ['home', 'record', 'stickers', 'prevent', 'quiz', 'my']

export default function App() {
  const [data, setData] = useState<Data>(load)
  const [route, setRoute] = useState<Route>(() => (load().profile ? 'home' : 'title'))
  const [session, setSession] = useState<Session | null>(null)
  const desk = useDesktop()

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
