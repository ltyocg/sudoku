import {createContext, type Dispatch, type ReactNode, type SetStateAction, use, useState} from 'react'
import {type Coordinate} from '../base/coordinateFactory.ts'

const Context = createContext<{
  checkedSet: Set<Coordinate>
  setCheckedSet: Dispatch<SetStateAction<Set<Coordinate>>>
}>(null!)

export default function useHighlights() {
  return use(Context)
}

export function HighlightsProvider({children}: { children: ReactNode }) {
  const [checkedSet, setCheckedSet] = useState(new Set<Coordinate>())
  return <Context value={{checkedSet, setCheckedSet}}>{children}</Context>
}