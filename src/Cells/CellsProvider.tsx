import {createContext, type ReactNode, use, useMemo, useState} from 'react'
import useHighlights from './useHighlights.tsx'
import Coordinate from '../Coordinate.ts'
import {arrayMap, initCellArray} from '../util.ts'

interface Wrapper<T> {
  value: T
  set: (value: string) => void
}

const CellsContext = createContext<{
  history: {
    undo: () => void
    redo: () => void
  }
  colors: Wrapper<string[][][]>
  givens: string[][]
  pencilMarks: Wrapper<string[][][]>
  candidates: Wrapper<string[][][]>
  values: Wrapper<string[][]>
  all: string[][]
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

interface CellsState {
  colors: string[][][]
  givens: string[][]
  pencilMarks: string[][][]
  candidates: string[][][]
  values: string[][]
}

interface CellsTimeline {
  array: CellsState[]
  index: number
}

const initialCellsTimeline: CellsTimeline = {
  array: [{
    colors: initCellArray(() => []),
    givens,
    pencilMarks: initCellArray(() => []),
    candidates: initCellArray(() => []),
    values: initCellArray(() => '')
  }],
  index: 0
}
export default function CellsProvider({children}: { children: ReactNode }) {
  const coordinateArray = [...useHighlights().checkedSet].map(i => new Coordinate(i))
  const [cellsTimeline, setCellsTimeline] = useState(initialCellsTimeline)
  const append = (state: CellsState) => setCellsTimeline(value => {
    const array = value.array.slice(0, cellsTimeline.index + 1).concat(state)
    return {array, index: array.length - 1}
  })
  const state = cellsTimeline.array[cellsTimeline.index]
  const {all, availableValues} = useMemo(() => {
    const all = state.values.map((row, y) => row.map((value, x) => value || givens[y][x]))
    const availableValues = initCellArray(() => new Set(Array.from({length: 9}, (_, i) => `${i + 1}`)))
    arrayMap(all, (value, x, y) => {
      if (!value) return
      availableValues[y][x].clear()
      Array.from({length: 9}).forEach((_, i) => {
        availableValues[y][i].delete(value)
        availableValues[i][x].delete(value)
      })
      const xb = Math.floor(x / 3), yb = Math.floor(y / 3)
      Array.from({length: 3}, (_, y) => Array.from({length: 3}, (_, x) => availableValues[yb * 3 + y][xb * 3 + x].delete(value)))
    })
    return {all, availableValues}
  }, [state.givens, state.values])
  return (
    <CellsContext
      value={{
        history: {
          undo: () => {
            if (cellsTimeline.index > 0) setCellsTimeline(v => ({...v, index: v.index - 1}))
          },
          redo: () => {
            if (cellsTimeline.array[cellsTimeline.index + 1]) setCellsTimeline(v => ({...v, index: v.index + 1}))
          }
        },
        colors: {
          value: [],
          set: () => undefined
        },
        givens,
        pencilMarks: {
          value: state.pencilMarks,
          set: value => {
            let add = false
            const setterArray: (() => void)[] = []
            const pencilMarks = structuredClone(state.pencilMarks)
            for (const {x, y} of coordinateArray) {
              if (givens[y][x]) continue
              if (value === '') {
                if (pencilMarks[y][x].length) setterArray.push(() => {
                  pencilMarks[y][x] = []
                })
              } else {
                if (!pencilMarks[y][x].includes(value)) add = true
                setterArray.push(() => {
                  const array = pencilMarks[y][x]
                  if (add) {
                    if (!array.includes(value)) pencilMarks[y][x] = array.concat(value)
                  } else pencilMarks[y][x] = array.filter(a => a !== value)
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              append({...state, pencilMarks})
            }
          }
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
              append({...state, candidates})
            }
          }
        },
        values: {
          value: state.values,
          set: value => {
            let realValue = ''
            const setterArray: (() => void)[] = []
            const pencilMarks = structuredClone(state.pencilMarks)
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
                  if (realValue) {
                    pencilMarks[y][x] = []
                    candidates[y][x] = []
                  }
                  values[y][x] = realValue
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              append({...state, pencilMarks, candidates, values})
            }
          }
        },
        all,
        availableValues
      }}
    >{children}</CellsContext>
  )
}