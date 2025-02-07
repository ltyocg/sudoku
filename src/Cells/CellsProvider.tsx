import {createContext, type ReactNode, use, useState} from 'react'
import useHighlights from './useHighlights.tsx'
import Coordinate from '../Coordinate.ts'
import {initCellArray} from '../util.ts'

interface Wrapper<T> {
  value: T
  set: (value: string) => void
}

const CellsContext = createContext<{
  colors: Wrapper<string[][][]>
  givens: string[][]
  pencilMarks: Wrapper<string[][][]>
  candidates: Wrapper<string[][][]>
  values: Wrapper<string[][]>
}>(null!)

export function useCells() {
  return use(CellsContext)
}

const givens = (() => {
  const _ = undefined
  return [
    [3, _, 6, _, _, _, _, _, _],
    [5, _, _, 1, 8, _, _, _, _],
    [_, _, _, 6, _, 3, 7, _, _],
    [4, _, _, _, _, _, 1, _, _],
    [_, _, _, _, _, 7, _, 3, _],
    [1, 8, 7, _, _, _, 9, _, _],
    [_, 9, 4, _, 5, _, 6, _, 1],
    [_, 5, 2, _, _, _, _, _, 7],
    [_, _, _, _, _, _, _, 2, _]
  ].map(a => a.map(i => i?.toString() ?? ''))
})()
export default function CellsProvider({children}: { children: ReactNode }) {
  const coordinateArray = [...useHighlights().checkedSet].map(i => new Coordinate(i))
  const [values, setValues] = useState(() => initCellArray(''))
  return (
    <CellsContext
      value={{
        colors: {
          value: [],
          set: () => undefined
        },
        givens,
        pencilMarks: {
          value: [],
          set: () => undefined
        },
        candidates: {
          value: [],
          set: () => undefined
        },
        values: {
          value: values,
          set: value => {
            let realValue = ''
            const setterArray: (() => void)[] = []
            const newValues = structuredClone(values)
            for (const {x, y} of coordinateArray) {
              const given = givens[y][x]
              if (given) continue
              if (value === '') {
                if (newValues[y][x] !== '') setterArray.push(() => {
                  newValues[y][x] = ''
                })
              } else {
                if (newValues[y][x] !== value) realValue = value
                setterArray.push(() => {
                  newValues[y][x] = realValue
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              setValues(newValues)
            }
          }
        }
      }}
    >{children}</CellsContext>
  )
}
