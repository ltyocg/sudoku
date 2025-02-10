import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Controls/Constants.ts'
import {arrayMap} from '../util.ts'
import classes from './Candidates.module.css'
import {useCells} from './CellsProvider.tsx'

export default function Candidates() {
  const {candidates, availableValues} = useCells()
  return (
    <g>
      {arrayMap(candidates.value, (value, x, y) => !!value.length && (
        <text
          key={y * 9 + x}
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