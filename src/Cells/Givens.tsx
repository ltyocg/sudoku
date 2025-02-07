import classes from './Givens.module.css'
import {useCells} from './CellsProvider.tsx'

export default function Givens() {
  const {givens} = useCells()
  return (
    <g>
      {givens.map((row, y) => row.map((value, x) => value && (
        <text
          key={`${x}${y}`}
          className={classes.given}
          x={x * 64 + 32}
          y={y * 64 + 35.8}
        >{value}</text>
      )))}
    </g>
  )
}