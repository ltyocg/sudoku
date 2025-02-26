import {Ref, useEffect, useState} from 'react'
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
import {useMain} from '../Main/useMain.tsx'
import Colors from './Colors.tsx'
import LabelsRowCol from './LabelsRowCol.tsx'
import Cages from './Cages.tsx'

export default function Cells({gridRef}: { gridRef?: Ref<HTMLDivElement> }) {
  const {paused} = useMain()
  const {checkedSet, setCheckedSet} = useHighlights()
  const {colors, givens, pencilMarks, candidates, values, all, availableValues} = useCells()
  const {multiple} = useControls()
  const [selectFlag, setSelectFlag] = useState(true)
  useEffect(() => {
    const abortController = new AbortController()
    document.addEventListener('keydown', event => {
      if (!(ctrlKey(event) && event.code === 'KeyA')) return
      event.preventDefault()
      setCheckedSet(new Set(Array.from({length: 81}, (_, i) => i)))
    }, {signal: abortController.signal})
    return () => abortController.abort()
  })
  return (
    <div
      className={classes.cells}
      style={{
        margin: '64px 48px',
        filter: paused ? 'blur(10px)' : undefined
      }}
    >
      <div ref={gridRef}>
        {Array.from({length: 81}, (_, i) => i).map(index => {
          const x = index % 9, y = Math.floor(index / 9)
          return (
            <div
              key={index}
              className={classes.cell}
              onMouseDown={event => {
                if (multiple.value || ctrlKey(event)) {
                  if (checkedSet.has(index)) {
                    setSelectFlag(false)
                    setCheckedSet(v => {
                      const set = new Set(v)
                      set.delete(index)
                      return set
                    })
                  } else {
                    setSelectFlag(true)
                    setCheckedSet(v => new Set(v).add(index))
                  }
                } else setCheckedSet(new Set([index]))
              }}
              onMouseMove={event => {
                if (event.buttons !== 1) {
                  if (!selectFlag) setSelectFlag(true)
                  return
                }
                if ((event.nativeEvent.offsetX - 32) ** 2 + (event.nativeEvent.offsetY - 32) ** 2 > 30 ** 2) return
                if (selectFlag) setCheckedSet(v => new Set(v).add(index))
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
        style={{pointerEvents: 'none'}}
        viewBox="-48 -64 672 704"
      >
        <Colors array={colors.value}/>
        <Highlights/>
        <Cages/>
        <Grid/>
        <Errors all={all}/>
        <LabelsRowCol/>
        <Givens array={givens}/>
        <g id="cell-pen"></g>
        <PencilMarks
          pencilMarks={pencilMarks.value}
          availableValues={availableValues}
        />
        <Candidates
          candidates={candidates.value}
          availableValues={availableValues}
        />
        <Values array={values.value}/>
      </svg>
    </div>
  )
}