import useHighlights from './useHighlights.tsx'
import Point from '../Point.ts'
import coordinateFactory from '../base/coordinateFactory.ts'

export default function Highlights() {
  const {checkedSet} = useHighlights()
  const pathSegmentArray: Point[][] = []
  for (const {x, y} of checkedSet) {
    let b = 0
    if (x !== 0 && y !== 0 && checkedSet.has(coordinateFactory.get(x - 1, y - 1))) b |= 0x01
    if (y !== 0 && checkedSet.has(coordinateFactory.get(x, y - 1))) b |= 0x02
    if (x !== 8 && y !== 0 && checkedSet.has(coordinateFactory.get(x + 1, y - 1))) b |= 0x04
    if (x !== 8 && checkedSet.has(coordinateFactory.get(x + 1, y))) b |= 0x08
    if (x !== 8 && y !== 8 && checkedSet.has(coordinateFactory.get(x + 1, y + 1))) b |= 0x10
    if (y !== 8 && checkedSet.has(coordinateFactory.get(x, y + 1))) b |= 0x20
    if (x !== 0 && y !== 8 && checkedSet.has(coordinateFactory.get(x - 1, y + 1))) b |= 0x40
    if (x !== 0 && checkedSet.has(coordinateFactory.get(x - 1, y))) b |= 0x80
    pathSegmentArray.push(...pathSegment(x, y, b))
  }
  return (
    <g>
      {!!checkedSet.size && (
        <path
          fill="rgba(255 255 255 / 0.4)"
          stroke="rgba(0 126 255 / 0.7)"
          strokeWidth={8}
          strokeLinecap="butt"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
          d={combine(pathSegmentArray).map((ps) => {
            const pr: (string | number)[] = ['M' + ps[0].x, ps[0].y]
            for (let i = 1; i < ps.length - 1; i++) {
              const {x, y} = ps[i]
              pr.push('L' + x, y)
            }
            pr.push('Z')
            return pr
          }).flat(1).join(' ')}
        />
      )}
    </g>
  )
}

function pathSegment(x: number, y: number, b: number): Point[][] {
  const array: Point[][] = []
  if (b & 0x02 && ~b & 0x81) array.push([new Point(x * 64 + 4, y * 64 + 4), new Point(x * 64 + 4, y * 64)])
  if (~b & 0x02) array.push([new Point(x * 64 + 4, y * 64 + 4), new Point(x * 64 + 60, y * 64 + 4)])
  if (b & 0x02 && ~b & 0x0c) array.push([new Point(x * 64 + 60, y * 64), new Point(x * 64 + 60, y * 64 + 4)])
  if (b & 0x08 && ~b & 0x06) array.push([new Point(x * 64 + 60, y * 64 + 4), new Point((x + 1) * 64, y * 64 + 4)])
  if (~b & 0x08) array.push([new Point(x * 64 + 60, y * 64 + 4), new Point(x * 64 + 60, y * 64 + 60)])
  if (b & 0x08 && ~b & 0x30) array.push([new Point((x + 1) * 64, y * 64 + 60), new Point(x * 64 + 60, y * 64 + 60)])
  if (b & 0x20 && ~b & 0x18) array.push([new Point(x * 64 + 60, y * 64 + 60), new Point(x * 64 + 60, (y + 1) * 64)])
  if (~b & 0x20) array.push([new Point(x * 64 + 60, y * 64 + 60), new Point(x * 64 + 4, y * 64 + 60)])
  if (b & 0x20 && ~b & 0xc0) array.push([new Point(x * 64 + 4, (y + 1) * 64), new Point(x * 64 + 4, y * 64 + 60)])
  if (b & 0x80 && ~b & 0x60) array.push([new Point(x * 64 + 4, y * 64 + 60), new Point(x * 64, y * 64 + 60)])
  if (~b & 0x80) array.push([new Point(x * 64 + 4, y * 64 + 60), new Point(x * 64 + 4, y * 64 + 4)])
  if (b & 0x80 && ~b & 0x03) array.push([new Point(x * 64, y * 64 + 4), new Point(x * 64 + 4, y * 64 + 4)])
  return array
}

function combine(ps: Point[][]) {
  let flag
  do {
    flag = false
    for (let i = 0; i < ps.length; i++) {
      const base = ps[i]
      if (!base.length) continue
      for (let j = i + 1; j < ps.length; j++) {
        const target = ps[j]
        if (target.length && base.at(-1)!.equals(target[0])) {
          for (let k = 1; k < target.length; k++) base.push(target[k])
          ps[j] = []
          flag = true
        }
      }
    }
    ps = ps.filter(psc => psc.length)
  }
  while (flag)
  return ps.map(psc => {
    const r: Point[] = []
    for (let i = 0; i < psc.length; i++) {
      if (i >= psc.length - 2) return r.concat(psc.slice(i))
      let xf = false, yf = false
      for (let j = i + 1; j < psc.length; j++) {
        if (xf) {
          if (psc[i].x !== psc[j].x) {
            r.push(psc[i])
            i = j - 2
            break
          }
        } else if (yf) {
          if (psc[i].y !== psc[j].y) {
            r.push(psc[i])
            i = j - 2
            break
          }
        } else {
          xf = psc[i].x === psc[j].x
          yf = psc[i].y === psc[j].y
          if (!xf && !yf) {
            r.push(psc[i])
            break
          }
        }
        if (j === psc.length - 1) return r.concat(psc[i], psc[j])
      }
    }
    return r
  })
}