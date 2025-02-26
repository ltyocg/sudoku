import {arrayMap} from '../util.ts'
import classes from './Candidates.module.css'
import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Constants.ts'

export default function Candidates({candidates, availableValues}: {
  candidates: string[][][]
  availableValues: Set<string>[][]
}) {
  return (
    <g>
      {arrayMap(candidates, (value, x, y) => !!value.length && (
        <text
          key={x + '-' + y}
          className={classes.candidate}
          x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
          y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
          data-count={value.length}
        >
          {value.sort().map(s => (
            <tspan
              key={s}
              className={availableValues[y][x].has(s) ? undefined : classes.conflict}
            >{s}</tspan>
          ))}
        </text>
      ))}
    </g>
  )
}