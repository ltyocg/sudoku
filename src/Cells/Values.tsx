import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Constants.ts'
import classes from './Values.module.css'

export default function Values({array}: { array: string[][] }) {
  return (
    <g>
      {array.map((row, y) => row.map((value, x) => value && (
        <text
          key={x + '-' + y}
          className={classes.value}
          x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
          y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
        >{value}</text>
      )))}
    </g>
  )
}