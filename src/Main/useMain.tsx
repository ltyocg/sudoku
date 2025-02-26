import {createContext, type Dispatch, type ReactNode, type SetStateAction, use, useState} from 'react'

const Context = createContext<{
  paused: boolean
  setPaused: Dispatch<SetStateAction<boolean>>
}>(null!)

export function useMain() {
  return use(Context)
}

export function MainProvider({children}: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  return <Context value={{paused, setPaused}}>{children}</Context>
}