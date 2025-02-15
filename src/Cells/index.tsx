import {type RefObject, useEffect, useState} from 'react'
import useControls from '../Controls/useControls.tsx'
import {arrayMap, ctrlKey} from '../util.ts'
import Candidates from './Candidates.tsx'
import Errors from './Errors.tsx'
import Givens from './Givens.tsx'
import Grid from './Grid.tsx'
import Highlights from './Highlights.tsx'
import classes from './index.module.css'
import PencilMarks from './PencilMarks.tsx'
import useHighlights from './useHighlights.tsx'
import Values from './Values.tsx'
import {useCells} from './CellsProvider.tsx'
import {useApp} from '../useApp.tsx'

export default function Cells({ref}: { ref: RefObject<HTMLDivElement | null> }) {
  const {paused} = useApp()
  const {checkedSet, setCheckedSet} = useHighlights()
  const {all} = useCells()
  const {multiple} = useControls()
  const [flag, setFlag] = useState(true)
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!(ctrlKey(event) && event.code === 'KeyA')) return
      event.preventDefault()
      setCheckedSet(new Set(Array.from({length: 81}, (_, i) => i)))
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  })
  return (
    <div
      ref={ref}
      className={classes.cells}
      style={{filter: paused ? 'blur(10px)' : undefined}}
    >
      <div>
        {Array.from({length: 81}, (_, i) => i).map(index => {
          const x = index % 9, y = Math.floor(index / 9)
          return (
            <div
              key={index}
              className={classes.cell}
              onMouseDown={event => {
                if (multiple.value || ctrlKey(event)) {
                  if (checkedSet.has(index)) {
                    setFlag(false)
                    setCheckedSet(v => {
                      const set = new Set(v)
                      set.delete(index)
                      return set
                    })
                  } else {
                    setFlag(true)
                    setCheckedSet(v => new Set(v).add(index))
                  }
                } else setCheckedSet(new Set([index]))
              }}
              onMouseMove={event => {
                if (event.buttons !== 1) return
                if ((event.nativeEvent.offsetX - 32) ** 2 + (event.nativeEvent.offsetY - 32) ** 2 > 29 ** 2) return
                if (flag) setCheckedSet(v => new Set(v).add(index))
                else setCheckedSet(v => {
                  const set = new Set(v)
                  set.delete(index)
                  return set
                })
              }}
              onDoubleClick={() => {
                const currentValue = all[y][x]
                if (!currentValue) return
                const set = new Set<number>()
                arrayMap(all, (value, x, y) => {
                  if (currentValue === value) set.add(y * 9 + x)
                })
                if (set.size > 1) setCheckedSet(set)
              }}
            />
          )
        })}
      </div>
      <svg
        className={classes.boardSvg}
        viewBox="-48 -64 672 704"
      >
        <g id="background"></g>
        <g id="underlay"></g>
        <g id="cell-colors"></g>
        <Highlights/>
        <g id="arrows"></g>
        <g id="cages"></g>
        <Grid/>
        <Errors/>
        <g id="overlay"></g>
        <Givens/>
        <g id="cell-pen"></g>
        <PencilMarks/>
        <Candidates/>
        <Values/>
      </svg>
    </div>
  )
}