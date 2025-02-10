import {useEffect, useState} from 'react'
import useControls from '../Controls/useControls.tsx'
import Repeat from '../Repeat.tsx'
import {ctrlKey} from '../util.ts'
import Candidates from './Candidates.tsx'
import Errors from './Errors.tsx'
import Givens from './Givens.tsx'
import Grid from './Grid.tsx'
import Highlights from './Highlights.tsx'
import classes from './index.module.css'
import PencilMarks from './PencilMarks.tsx'
import useHighlights from './useHighlights.tsx'
import Values from './Values.tsx'

export default function Cells() {
  const {checkedSet, setCheckedSet} = useHighlights()
  const {multiple} = useControls()
  const [flag, setFlag] = useState(true)
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (ctrlKey(event) && event.code === 'KeyA') {
        event.preventDefault()
        const allCheckedSet = new Set(Array.from({length: 81}, (_, i) => i))
        setCheckedSet(v => v.intersection(allCheckedSet).size === 81 ? new Set() : allCheckedSet)
      }
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  })
  return (
    <>
      <div>
        <Repeat length={9}>
          {y => (
            <div className={classes.row}>
              <Repeat length={9}>
                {x => (
                  <div
                    className={classes.cell}
                    onMouseDown={event => {
                      const index = y * 9 + x
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
                      const index = y * 9 + x
                      if (flag) setCheckedSet(v => new Set(v).add(index))
                      else setCheckedSet(v => {
                        const set = new Set(v)
                        set.delete(index)
                        return set
                      })
                    }}
                  />
                )}
              </Repeat>
            </div>
          )}
        </Repeat>
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
        <Grid/>
        <Errors/>
        <g id="overlay"></g>
        <Givens/>
        <g id="cell-pen"></g>
        <PencilMarks/>
        <Candidates/>
        <Values/>
      </svg>
    </>
  )
}