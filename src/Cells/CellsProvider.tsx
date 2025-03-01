import {createContext, type ReactNode, use, useMemo, useState} from 'react'
import useHighlights from './useHighlights.tsx'
import {arrayMap, initCellArray} from '../util.ts'

interface Wrapper<T> {
  value: T
  set: (value: string) => void
}

const CellsContext = createContext<{
  history: {
    canUndo: boolean
    undo: () => void
    canRedo: boolean
    redo: () => void
    reset: () => void
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
  const {checkedSet} = useHighlights()
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
  const canUndo = cellsTimeline.index > 0
  const canRedo = !!cellsTimeline.array[cellsTimeline.index + 1]
  return (
    <CellsContext
      value={{
        history: {
          canUndo,
          undo: () => {
            if (canUndo) setCellsTimeline(v => ({...v, index: v.index - 1}))
          },
          canRedo,
          redo: () => {
            if (canRedo) setCellsTimeline(v => ({...v, index: v.index + 1}))
          },
          reset: () => setCellsTimeline(initialCellsTimeline)
        },
        colors: {
          value: state.colors,
          set: value => {
            let add = false
            const setterArray: (() => void)[] = []
            const colors = structuredClone(state.colors)
            for (const {x, y} of checkedSet) {
              if (value === '') {
                if (colors[y][x].length) setterArray.push(() => {
                  colors[y][x] = []
                })
              } else {
                if (!colors[y][x].includes(value)) add = true
                setterArray.push(() => {
                  const array = colors[y][x]
                  if (add) {
                    if (!array.includes(value)) colors[y][x] = array.concat(value)
                  } else colors[y][x] = array.filter(a => a !== value)
                })
              }
            }
            if (setterArray.length) {
              setterArray.forEach(setter => setter())
              append({...state, colors})
            } else if (value === '') {
              let edit = false
              const pencilMarks = structuredClone(state.pencilMarks)
              const candidates = structuredClone(state.candidates)
              const values = structuredClone(state.values)
              for (const {x, y} of checkedSet) {
                if (pencilMarks[y][x].length) {
                  pencilMarks[y][x] = []
                  edit = true
                }
                if (candidates[y][x].length) {
                  candidates[y][x] = []
                  edit = true
                }
                if (values[y][x]) {
                  values[y][x] = ''
                  edit = true
                }
              }
              if (edit) append({...state, pencilMarks, candidates, values})
            }
          }
        },
        givens,
        pencilMarks: {
          value: state.pencilMarks,
          set: value => {
            let add = false
            const setterArray: (() => void)[] = []
            const pencilMarks = structuredClone(state.pencilMarks)
            for (const {x, y} of checkedSet) {
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
            } else if (value === '') {
              let edit = false
              const colors = structuredClone(state.colors)
              const candidates = structuredClone(state.candidates)
              const values = structuredClone(state.values)
              for (const {x, y} of checkedSet) {
                if (colors[y][x].length) {
                  colors[y][x] = []
                  edit = true
                }
                if (candidates[y][x].length) {
                  candidates[y][x] = []
                  edit = true
                }
                if (values[y][x]) {
                  values[y][x] = ''
                  edit = true
                }
              }
              if (edit) append({...state, colors, candidates, values})
            }
          }
        },
        candidates: {
          value: state.candidates,
          set: value => {
            let add = false
            const setterArray: (() => void)[] = []
            const candidates = structuredClone(state.candidates)
            for (const {x, y} of checkedSet) {
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
            } else if (value === '') {
              let edit = false
              const colors = structuredClone(state.colors)
              const pencilMarks = structuredClone(state.pencilMarks)
              const values = structuredClone(state.values)
              for (const {x, y} of checkedSet) {
                if (colors[y][x].length) {
                  colors[y][x] = []
                  edit = true
                }
                if (pencilMarks[y][x].length) {
                  pencilMarks[y][x] = []
                  edit = true
                }
                if (values[y][x]) {
                  values[y][x] = ''
                  edit = true
                }
              }
              if (edit) append({...state, colors, pencilMarks, values})
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
            for (const {x, y} of checkedSet) {
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
            } else if (value === '') {
              let edit = false
              const colors = structuredClone(state.colors)
              const pencilMarks = structuredClone(state.pencilMarks)
              const candidates = structuredClone(state.candidates)
              for (const {x, y} of checkedSet) {
                if (colors[y][x].length) {
                  colors[y][x] = []
                  edit = true
                }
                if (pencilMarks[y][x].length) {
                  pencilMarks[y][x] = []
                  edit = true
                }
                if (candidates[y][x].length) {
                  candidates[y][x] = []
                  edit = true
                }
              }
              if (edit) append({...state, colors, pencilMarks, values})
            }
          }
        },
        all,
        availableValues
      }}
    >{children}</CellsContext>
  )
}