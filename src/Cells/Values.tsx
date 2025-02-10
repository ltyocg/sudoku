import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Controls/Constants.ts'
import {useCells} from './CellsProvider.tsx'
import classes from './Values.module.css'

export default function Values() {
  const {values} = useCells()
  return (
    <g>
      {values.value.map((row, y) => row.map((value, x) => value && (
        <text
          key={`${x}${y}`}
          className={classes.value}
          x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
          y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
        >{value}</text>
      )))}
    </g>
  )
}