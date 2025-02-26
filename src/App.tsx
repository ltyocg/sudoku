import Main from './Main'
import useAppState from './useAppState.tsx'
import Start from './Start'
import {type ReactNode} from 'react'
import SelectLevel from './Start/SelectLevel.tsx'

const routes: Record<string, ReactNode> = {
  '/start': <Start/>,
  '/start/selectLevel': <SelectLevel/>,
  '/main': <Main/>
}
export default function App() {
  const {state} = useAppState()
  return routes[state.route]
}
