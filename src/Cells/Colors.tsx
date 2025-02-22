import {useCells} from './CellsProvider.tsx'
import {arrayMap} from '../util.ts'
import {CELL_SIDE_LENGTH} from '../Constants.ts'
import Point from '../Point.ts'

export default function Colors() {
  const {colors} = useCells()
  return (
    <g style={{opacity: 0.6}}>
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
  switch (value.length) {
    case 0:
      return null
    case 1:
      return (
        <path
          d={`M${x * CELL_SIDE_LENGTH} ${y * CELL_SIDE_LENGTH} H${(x + 1) * CELL_SIDE_LENGTH} V${(y + 1) * CELL_SIDE_LENGTH} H${x * CELL_SIDE_LENGTH} Z`}
          fill={value[0]}
        />
      )
    default:
      const initTheta = 1.1345113748935325
      const intersectionArray = Array.from({length: value.length}, (_, i) => {
        const theta = (initTheta + i * 2 * Math.PI / value.length) % (2 * Math.PI)
        const o = calculateIntersection(theta)
        return {
          theta,
          point: new Point(o.x + CELL_SIDE_LENGTH / 2, CELL_SIDE_LENGTH / 2 - o.y),
          region: Math.floor(theta / (Math.PI / 4))
        }
      })
      intersectionArray.push(intersectionArray[0])
      const pathSegmentArray: Point[][] = []
      for (let i = 0; i < intersectionArray.length - 1; i++) {
        const current = intersectionArray[i]
        const next = intersectionArray[i + 1]
        pathSegmentArray.push([
          new Point(CELL_SIDE_LENGTH / 2, CELL_SIDE_LENGTH / 2),
          current.point,
          ...regionPoints(current.region, next.region),
          next.point
        ].map(p => p.toTranslate(x * CELL_SIDE_LENGTH, y * CELL_SIDE_LENGTH)))
      }
      return pathSegmentArray.map((ps, i) => {
        const pr: (string | number)[] = ['M' + ps[0].x, ps[0].y]
        for (let i = 1; i < ps.length; i++) {
          const {x, y} = ps[i]
          pr.push('L' + x, y)
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
}

function calculateIntersection(theta: number) {
  const halfS = CELL_SIDE_LENGTH / 2
  const candidates = []
  const cosValue = Math.cos(theta)
  const sinValue = Math.sin(theta)
  if (cosValue > 0) {
    const t = halfS / cosValue
    const y = t * sinValue
    if (Math.abs(y) <= halfS) candidates.push({t, x: halfS, y})
  }
  if (cosValue < 0) {
    const t = -halfS / cosValue
    const y = t * sinValue
    if (Math.abs(y) <= halfS) candidates.push({t, x: -halfS, y})
  }
  if (sinValue > 0) {
    const t = halfS / sinValue
    const x = t * cosValue
    if (Math.abs(x) <= halfS) candidates.push({t, x, y: halfS})
  }
  if (sinValue < 0) {
    const t = -halfS / sinValue
    const x = t * cosValue
    if (Math.abs(x) <= halfS) candidates.push({t, x, y: -halfS})
  }
  let minT = Infinity
  let result = {x: 0, y: 0}
  for (const {t, x, y} of candidates) if (t < minT) {
    minT = t
    result = {x, y}
  }
  return result
}

function regionPoints(r0: number, r1: number): Point[] {
  const array = Array.from({length: 16}).map((_, i) => i % 8)
  const points: Point[] = []
  for (let i = r0; i < array.length; i++) {
    const current = array[i], next = array[i + 1]
    if (current === r1) break
    if (current === 0 && next === 1) points.push(new Point(CELL_SIDE_LENGTH, 0))
    else if (current === 2 && next === 3) points.push(new Point(0, 0))
    else if (current === 4 && next === 5) points.push(new Point(0, CELL_SIDE_LENGTH))
    else if (current === 6 && next === 7) points.push(new Point(CELL_SIDE_LENGTH, CELL_SIDE_LENGTH))
  }
  return points
}