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
  const array = Array.from({length: 8}).map((_, index) => index + 1)
  return (
    <path
      stroke="black"
      d={[
        ...array.map(i => `M0 ${CELL_SIDE_LENGTH * i} H${CELL_SIDE_LENGTH * 9}`),
        ...array.map(i => `M${CELL_SIDE_LENGTH * i} 0 V${CELL_SIDE_LENGTH * 9}`),
        'Z'
      ].join(' ')}
    />
  )
}

function Thick() {
  const array = Array.from({length: 2}).map((_, index) => (index + 1) * 3)
  return (
    <path
      stroke="rgba(0 0 0 / 1)"
      strokeWidth={3}
      d={[
        ...array.map(i => `M0 ${CELL_SIDE_LENGTH * i} H${CELL_SIDE_LENGTH * 9}`),
        ...array.map(i => `M${CELL_SIDE_LENGTH * i} 0 V${CELL_SIDE_LENGTH * 9}`),
        `M0 0 L${CELL_SIDE_LENGTH * 9} 0 L${CELL_SIDE_LENGTH * 9} ${CELL_SIDE_LENGTH * 9} L0 ${CELL_SIDE_LENGTH * 9} Z`
      ].join(' ')}
    />
  )
}