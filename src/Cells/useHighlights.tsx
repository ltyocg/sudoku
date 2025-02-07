import {createContext, type Dispatch, type ReactNode, type SetStateAction, use, useState} from 'react'

const HighlightsContext = createContext<{
  checkedSet: Set<number>
  setCheckedSet: Dispatch<SetStateAction<Set<number>>>
}>(null!)

export default function useHighlights() {
  return use(HighlightsContext)
}

export function HighlightsProvider({children}: { children: ReactNode }) {
  const [checkedSet, setCheckedSet] = useState(new Set<number>())
  return <HighlightsContext value={{checkedSet, setCheckedSet}}>{children}</HighlightsContext>
}