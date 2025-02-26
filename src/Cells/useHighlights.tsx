import {createContext, type Dispatch, type ReactNode, type SetStateAction, use, useState} from 'react'

const Context = createContext<{
  checkedSet: Set<number>
  setCheckedSet: Dispatch<SetStateAction<Set<number>>>
}>(null!)

export default function useHighlights() {
  return use(Context)
}

export function HighlightsProvider({children}: { children: ReactNode }) {
  const [checkedSet, setCheckedSet] = useState(new Set<number>())
  return <Context value={{checkedSet, setCheckedSet}}>{children}</Context>
}