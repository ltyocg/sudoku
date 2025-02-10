import {Fragment} from 'react'
import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Controls/Constants.ts'
import {arrayMap} from '../util.ts'
import {useCells} from './CellsProvider.tsx'
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