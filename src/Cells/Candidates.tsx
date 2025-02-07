import {useCells} from './CellsProvider.tsx'
import {arrayMap} from '../util.ts'
import classes from './Candidates.module.css'

export default function Candidates() {
  const {candidates, availableValues} = useCells()
  return (
    <g>
      {arrayMap(candidates.value, (value, x, y) => !!value.length && (
        <text
          key={y * 9 + x}
          className={classes.candidate}
          x={x * 64 + 32}
          y={y * 64 + 35.8}
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