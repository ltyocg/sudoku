import {useCells} from './CellsProvider.tsx'
import {arrayMap} from '../util.ts'
import {Fragment} from 'react'
import classes from './PencilMarks.module.css'

export default function PencilMarks() {
  const {pencilMarks, availableValues} = useCells()
  return (
    <g className={classes.pencilMarks}>
      {arrayMap(pencilMarks.value, (value, x, y) => (
        <Fragment key={y * 9 + x}>
          {value
            .filter(Boolean)
            .map(s => {
              return (
                <text
                  key={s}
                  className={availableValues[y][x].has(s) ? undefined : classes.conflict}
                  x={32 + x * 64}
                  y={35.8 + y * 64}
                  data-key={s}
                >{s}</text>
              )
            })}
        </Fragment>
      ))}
    </g>
  )
}