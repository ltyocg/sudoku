import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Constants.ts'
import classes from './Givens.module.css'
import {arrayMap} from '../util.ts'

export default function Givens({array}: { array: string[][] }) {
  return (
    <g>
      {arrayMap(array, (value, x, y) => (
        <text
          key={x + '-' + y}
          className={classes.given}
          x={x * CELL_SIDE_LENGTH + TEXT_OFFSET.X}
          y={y * CELL_SIDE_LENGTH + TEXT_OFFSET.Y}
        >{value}</text>
      ))}
    </g>
  )
}