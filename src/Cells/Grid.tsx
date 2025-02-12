import {CELL_SIDE_LENGTH} from '../Constants.ts'
import classes from './Grid.module.css'

export default function Grid() {
  return (
    <g className={classes.grid}>
      <Thin/>
      <Thick/>
    </g>
  )
}

function Thin() {
  const array = Array.from({length: 10}).map((_, index) => index)
  return (
    <path
      stroke="black"
      d={[
        ...array.map(i => `M0 ${CELL_SIDE_LENGTH * i} L${CELL_SIDE_LENGTH * 9} ${CELL_SIDE_LENGTH * i}`),
        ...array.map(i => `M${CELL_SIDE_LENGTH * i} 0 L${CELL_SIDE_LENGTH * i} ${CELL_SIDE_LENGTH * 9}`),
        'Z'
      ].join(' ')}
    />
  )
}

function Thick() {
  const strokeWidth = 3
  const width = strokeWidth / 2
  const array = Array.from({length: 4}).map((_, index) => index * 3)
  return (
    <path
      stroke="rgba(0 0 0 / 1)"
      strokeWidth={strokeWidth}
      d={[
        ...array.map(i => `M${-width} ${CELL_SIDE_LENGTH * i} L${CELL_SIDE_LENGTH * 9 + width} ${CELL_SIDE_LENGTH * i}`),
        ...array.map(i => `M${CELL_SIDE_LENGTH * i} ${-width} L${CELL_SIDE_LENGTH * i} ${CELL_SIDE_LENGTH * 9 + width}`),
        'Z'
      ].join(' ')}
    />
  )
}