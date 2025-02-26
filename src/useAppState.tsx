import {createContext, type ReactNode, use, useState} from 'react'

interface AppState {
  route: string
}

const Context = createContext<{
  state: AppState
  navigate: (route: string) => void
}>(null!)
export default function useAppState() {
  return use(Context)
}

export function AppStateProvider({children}: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    route: '/main'
  })
  return (
    <Context
      value={{
        state,
        navigate: route => setState(v => ({...v, route}))
      }}
    >{children}</Context>
  )
}