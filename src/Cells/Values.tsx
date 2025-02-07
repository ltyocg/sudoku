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
          x={x * 64 + 32}
          y={y * 64 + 35.8}
        >{value}</text>
      )))}
    </g>
  )
}