import {Fragment} from 'react'
import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Constants.ts'
import {arrayMap} from '../util.ts'
import classes from './PencilMarks.module.css'

export default function PencilMarks({pencilMarks, availableValues}: {
  pencilMarks: string[][][]
  availableValues: Set<string>[][]
}) {
  return (
    <g className={classes.pencilMarks}>
      {arrayMap(pencilMarks, (value, x, y) => (
        <Fragment key={x + '-' + y}>
          {value
            .filter(Boolean)
            .map(s => {
              return (
                <text
                  key={s}
                  className={availableValues[y][x].has(s) ? undefined : classes.conflict}
                  x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
                  y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
                  data-key={s}
                >{s}</text>
              )
            })}
        </Fragment>
      ))}
    </g>
  )
}