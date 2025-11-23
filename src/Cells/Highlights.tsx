import useHighlights from './useHighlights.tsx'
import Point from '../Point.ts'
import coordinateFactory from '../base/coordinateFactory.ts'
import {CELL_SIDE_LENGTH, PLACEMENT} from '../Constants.ts'

export default function Highlights({borderWidth}: { borderWidth: number }) {
  const {checkedSet} = useHighlights()
  const pathData = (() => {
    if (!checkedSet.size) return ''
    const pathSegmentArray: Point[][] = []
    for (const {x, y} of checkedSet) {
      let b = 0
      if (x !== 0 && y !== 0 && checkedSet.has(coordinateFactory.get(x - 1, y - 1))) b |= PLACEMENT.TOP_LEFT
      if (y !== 0 && checkedSet.has(coordinateFactory.get(x, y - 1))) b |= PLACEMENT.TOP
      if (x !== 8 && y !== 0 && checkedSet.has(coordinateFactory.get(x + 1, y - 1))) b |= PLACEMENT.TOP_RIGHT
      if (x !== 8 && checkedSet.has(coordinateFactory.get(x + 1, y))) b |= PLACEMENT.RIGHT
      if (x !== 8 && y !== 8 && checkedSet.has(coordinateFactory.get(x + 1, y + 1))) b |= PLACEMENT.BOTTOM_RIGHT
      if (y !== 8 && checkedSet.has(coordinateFactory.get(x, y + 1))) b |= PLACEMENT.BOTTOM
      if (x !== 0 && y !== 8 && checkedSet.has(coordinateFactory.get(x - 1, y + 1))) b |= PLACEMENT.BOTTOM_LEFT
      if (x !== 0 && checkedSet.has(coordinateFactory.get(x - 1, y))) b |= PLACEMENT.LEFT
      pathSegmentArray.push(...pathSegment(x, y, b, borderWidth))
    }
    return combine(pathSegmentArray).map(ps => {
      const simplified = simplifyPath(ps)
      const pr: (string | number)[] = ['M' + simplified[0].x, simplified[0].y]
      for (let i = 1; i < simplified.length; i++) {
        const {x, y} = simplified[i]
        pr.push('L' + x, y)
      }
      pr.push('Z')
      return pr.join(' ')
    }).join(' ')
  })()
  return (
    <g>
      {!!pathData && (
        <path
          fill="rgb(255 255 255 / 0.4)"
          stroke="rgb(0 126 255 / 0.7)"
          strokeWidth={borderWidth}
          strokeLinecap="butt"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
          d={pathData}
        />
      )}
    </g>
  )
}

function pathSegment(x: number, y: number, b: number, borderWidth: number): Point[][] {
  const array: Point[][] = []
  const offset = borderWidth / 2, reverseOffset = CELL_SIDE_LENGTH - offset
  const bx = x * CELL_SIDE_LENGTH, by = y * CELL_SIDE_LENGTH
  if (b & PLACEMENT.TOP && ~b & 0x81) array.push([new Point(bx + offset, by + offset), new Point(bx + offset, by)])
  if (~b & PLACEMENT.TOP) array.push([new Point(bx + offset, by + offset), new Point(bx + reverseOffset, by + offset)])
  if (b & PLACEMENT.TOP && ~b & 0x0c) array.push([new Point(bx + reverseOffset, by), new Point(bx + reverseOffset, by + offset)])
  if (b & PLACEMENT.RIGHT && ~b & 0x06) array.push([new Point(bx + reverseOffset, by + offset), new Point(bx + CELL_SIDE_LENGTH, by + offset)])
  if (~b & PLACEMENT.RIGHT) array.push([new Point(bx + reverseOffset, by + offset), new Point(bx + reverseOffset, by + reverseOffset)])
  if (b & PLACEMENT.RIGHT && ~b & 0x30) array.push([new Point(bx + CELL_SIDE_LENGTH, by + reverseOffset), new Point(bx + reverseOffset, by + reverseOffset)])
  if (b & PLACEMENT.BOTTOM && ~b & 0x18) array.push([new Point(bx + reverseOffset, by + reverseOffset), new Point(bx + reverseOffset, by + CELL_SIDE_LENGTH)])
  if (~b & PLACEMENT.BOTTOM) array.push([new Point(bx + reverseOffset, by + reverseOffset), new Point(bx + offset, by + reverseOffset)])
  if (b & PLACEMENT.BOTTOM && ~b & 0xc0) array.push([new Point(bx + offset, by + CELL_SIDE_LENGTH), new Point(bx + offset, by + reverseOffset)])
  if (b & PLACEMENT.LEFT && ~b & 0x60) array.push([new Point(bx + offset, by + reverseOffset), new Point(bx, by + reverseOffset)])
  if (~b & PLACEMENT.LEFT) array.push([new Point(bx + offset, by + reverseOffset), new Point(bx + offset, by + offset)])
  if (b & PLACEMENT.LEFT && ~b & 0x03) array.push([new Point(bx, by + offset), new Point(bx + offset, by + offset)])
  return array
}

function combine(segments: Point[][]): Point[][] {
  if (segments.length === 0) return []
  const starts = new Map<string, Point[]>()
  const ends = new Map<string, Point[]>()
  for (const seg of segments) {
    let current = seg
    const startKey = current[0].toString()
    const endKey = current.at(-1)!.toString()
    const pre = ends.get(startKey)
    if (pre) {
      ends.delete(startKey)
      starts.delete(pre[0].toString())
      current = [...pre, ...current.slice(1)]
    }
    const post = starts.get(endKey)
    if (post) {
      starts.delete(endKey)
      ends.delete(post.at(-1)!.toString())
      current = [...current, ...post.slice(1)]
    }
    starts.set(current[0].toString(), current)
    ends.set(current.at(-1)!.toString(), current)
  }
  return Array.from(starts.values())
}

function simplifyPath(path: Point[]): Point[] {
  const simplified: Point[] = [path[0]]
  for (let i = 1; i < path.length - 1; i++) {
    const p1 = simplified.at(-1)!, p2 = path[i], p3 = path[i + 1]
    if ((p2.y - p1.y) * (p3.x - p2.x) !== (p3.y - p2.y) * (p2.x - p1.x)) simplified.push(p2)
  }
  simplified.push(path.at(-1)!)
  return simplified
}