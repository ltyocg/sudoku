import {useCells} from './CellsProvider.tsx'
import Coordinate from '../Coordinate.ts'
import {arrayMap, initCellArray} from '../util.ts'
import classes from './Errors.module.css'

export default function Errors() {
  const {givens, values} = useCells()
  const all = values.value.map((row, y) => row.map((value, x) => value || givens[y][x]))
  const errorArray = initCellArray(() => false)
  checkBlock(index => Array.from({length: 9}, (_, i) => i).map(i => new Coordinate(i, index)))
  checkBlock(index => Array.from({length: 9}, (_, i) => i).map(i => new Coordinate(index, i)))
  checkBlock(index => {
    const xb = index % 3, yb = Math.floor(index / 3)
    return Array.from({length: 3}, (_, y) => Array.from({length: 3}, (_, x) => new Coordinate(xb * 3 + x, yb * 3 + y))).flat(1)
  })
  return (
    <g>
      {arrayMap(errorArray, (value, x, y) => value && (
        <rect
          key={y * 9 + x}
          className={classes.error}
          x={x * 64}
          y={y * 64}
          width={64}
          height={64}
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