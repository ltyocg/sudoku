import {createContext, type ReactNode, use, useMemo, useState} from 'react'
import useHighlights from './useHighlights.tsx'
import Coordinate from '../Coordinate.ts'
import {arrayMap, initCellArray} from '../util.ts'

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
  availableValues: Set<string>[][]
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
  const [state, setState] = useState<{
    colors: string[][][]
    givens: string[][]
    pencilMarks: string[][][]
    candidates: string[][][]
    values: string[][]
  }>(() => ({
    colors: initCellArray(() => []),
    givens,
    pencilMarks: initCellArray(() => []),
    candidates: initCellArray(() => []),
    values: initCellArray(() => '')
  }))
  const availableValues = useMemo(() => {
    const all = state.values.map((row, y) => row.map((value, x) => value || givens[y][x]))
    const result = initCellArray(() => new Set(Array.from({length: 9}, (_, i) => `${i + 1}`)))
    arrayMap(all, (value, x, y) => {
      if (!value) return
      result[y][x].clear()
      Array.from({length: 9}).forEach((_, i) => {
        result[y][i].delete(value)
        result[i][x].delete(value)
      })
      const xb = Math.floor(x / 3), yb = Math.floor(y / 3)
      Array.from({length: 3}, (_, y) => Array.from({length: 3}, (_, x) => result[yb * 3 + y][xb * 3 + x].delete(value)))
    })
    return result
  }, [state.givens, state.values])
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
          value: state.candidates,
          set: value => {
            let add = false
            const setterArray: (() => void)[] = []
            const candidates = structuredClone(state.candidates)
            for (const {x, y} of coordinateArray) {
              if (givens[y][x]) continue
              if (value === '') {
                if (candidates[y][x].length) setterArray.push(() => {
                  candidates[y][x] = []
                })
              } else {
                if (!candidates[y][x].includes(value)) add = true
                setterArray.push(() => {
                  const array = candidates[y][x]
                  if (add) {
                    if (!array.includes(value)) candidates[y][x] = array.concat(value)
                  } else candidates[y][x] = array.filter(a => a !== value)
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              setState(v => ({...v, candidates}))
            }
          }
        },
        values: {
          value: state.values,
          set: value => {
            let realValue = ''
            const setterArray: (() => void)[] = []
            const candidates = structuredClone(state.candidates)
            const values = structuredClone(state.values)
            for (const {x, y} of coordinateArray) {
              if (givens[y][x]) continue
              if (value === '') {
                if (values[y][x] !== '') setterArray.push(() => {
                  values[y][x] = ''
                })
              } else {
                if (values[y][x] !== value) realValue = value
                setterArray.push(() => {
                  if (realValue) candidates[y][x] = []
                  values[y][x] = realValue
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              setState(v => ({...v, candidates, values}))
            }
          }
        },
        availableValues
      }}
    >{children}</CellsContext>
  )
}