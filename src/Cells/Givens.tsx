import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Controls/Constants.ts'
import {useCells} from './CellsProvider.tsx'
import classes from './Givens.module.css'

export default function Givens() {
  const {givens} = useCells()
  return (
    <g>
      {givens.map((row, y) => row.map((value, x) => value && (
        <text
          key={`${x}${y}`}
          className={classes.given}
          x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
          y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
        >{value}</text>
      )))}
    </g>
  )
}