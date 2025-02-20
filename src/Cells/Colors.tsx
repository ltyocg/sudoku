import {useCells} from './CellsProvider.tsx'
import {arrayMap} from '../util.ts'
import Point from '../Point.ts'
import {CELL_SIDE_LENGTH} from '../Constants.ts'

export default function Colors() {
  const {colors} = useCells()
  return (
    <g>
      {arrayMap(colors.value, (value, x, y) => (
        <Path
          key={y * 9 + x}
          value={value}
          x={x}
          y={y}
        />
      ))}
    </g>
  )
}

function Path({value, x, y}: {
  value: string[]
  x: number
  y: number
}) {
  let pathSegmentArray!: Point[][]
  switch (value.length) {
    case 0:
      return null
    case 1:
      pathSegmentArray = [[
        new Point(0, 0),
        new Point(CELL_SIDE_LENGTH, 0),
        new Point(CELL_SIDE_LENGTH, CELL_SIDE_LENGTH),
        new Point(CELL_SIDE_LENGTH, 0)
      ].map(p => p.toTranslate(x * CELL_SIDE_LENGTH, y * CELL_SIDE_LENGTH))]
      break
    default:
      pathSegmentArray = []
  }
  return pathSegmentArray.map((ps, i) => {
    const pr: (string | number)[] = ['M', ps[0].x, ps[0].y]
    for (let i = 1; i < ps.length; i++) {
      const {x, y} = ps[i]
      pr.push('L', x, y)
    }
    pr.push('Z')
    return (
      <path
        key={i}
        d={pr.join(' ')}
        fill={value[i]}
      />
    )
  })
}