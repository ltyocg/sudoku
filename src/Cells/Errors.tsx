import {CELL_SIDE_LENGTH} from '../Constants.ts'
import {arrayMap, initCellArray} from '../util.ts'
import classes from './Errors.module.css'
import coordinateFactory, {type Coordinate} from '../base/coordinateFactory.ts'

export default function Errors({all}: { all: string[][] }) {
  const errorArray = initCellArray(() => false)
  checkBlock(index => Array.from({length: 9}, (_, i) => i).map(i => coordinateFactory.get(i, index)))
  checkBlock(index => Array.from({length: 9}, (_, i) => i).map(i => coordinateFactory.get(index, i)))
  checkBlock(index => {
    const xb = index % 3, yb = Math.floor(index / 3)
    return Array.from({length: 3}, (_, y) => Array.from({length: 3}, (_, x) => coordinateFactory.get(xb * 3 + x, yb * 3 + y))).flat(1)
  })
  return (
    <g>
      {arrayMap(errorArray, (value, x, y) => value && (
        <rect
          key={x + '-' + y}
          className={classes.error}
          x={x * CELL_SIDE_LENGTH}
          y={y * CELL_SIDE_LENGTH}
          width={CELL_SIDE_LENGTH}
          height={CELL_SIDE_LENGTH}
          opacity={1}
        />
      ))}
    </g>
  )

  function checkBlock(splitter: (index: number) => Coordinate[]) {
    Array.from({length: 9}, (_, i) => i)
      .map(i => splitter(i))
      .map(coordinateArray => {
        const o: Record<string, Coordinate[]> = {}
        for (const coordinate of coordinateArray) {
          const value = all[coordinate.y][coordinate.x]
          if (value) o[value] = (o[value] ?? []).concat(coordinate)
        }
        return Object.values(o).filter(na => na.length > 1)
      })
      .flat(2)
      .forEach(coordinate => {
        errorArray[coordinate.y][coordinate.x] = true
      })
  }
}