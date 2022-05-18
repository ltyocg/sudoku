import Coordinate from './Coordinate'

export default class Highlights {
  checkedCells: boolean[] = []
  readonly #target: SVGGElement

  constructor(target: SVGGElement) {
    this.#target = target
    this.all(false)
    this.render()
  }

  get(x: number, y: number): boolean {
    return this.checkedCells[y * 9 + x]
  }

  set(x: number, y: number, state: boolean) {
    this.checkedCells[y * 9 + x] = state
  }

  all(state: boolean) {
    this.checkedCells = Array.from({length: 81}, () => state)
  }

  render() {
    if (this.checkedCells.every((b) => !b)) {
      this.#target.innerHTML = ''
      return
    }
    let pathEl = this.#target.firstElementChild as SVGPathElement
    if (!pathEl) {
      pathEl = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      pathEl.setAttribute('fill', 'rgba(255, 255, 255, 0.4)')
      pathEl.setAttribute('stroke', 'rgba(0, 126, 255, 0.7)')
      pathEl.setAttribute('stroke-width', '8px')
      pathEl.setAttribute('stroke-linecap', 'butt')
      pathEl.setAttribute('stroke-linejoin', 'round')
      pathEl.setAttribute('shape-rendering', 'geometricprecision')
      pathEl.setAttribute('vector-effect', 'non-scaling-stroke')
    }

    interface Point {
      x: number
      y: number
    }

    interface LineSegment {
      p0: Point
      p1: Point
    }

    const lineSegmentArray: LineSegment[] = []
    for (let k in this.checkedCells) {
      const i = parseInt(k)
      const {x, y} = new Coordinate(i)
      if (this.checkedCells[i]) {
        let b = 0
        if (x !== 0 && y !== 0 && this.checkedCells[i - 10]) b |= 0x01
        if (y !== 0 && this.checkedCells[i - 9]) b |= 0x02
        if (x !== 8 && y !== 0 && this.checkedCells[i - 8]) b |= 0x04
        if (x !== 8 && this.checkedCells[i + 1]) b |= 0x08
        if (x !== 8 && y !== 8 && this.checkedCells[i + 10]) b |= 0x10
        if (y !== 8 && this.checkedCells[i + 9]) b |= 0x20
        if (x !== 0 && y !== 8 && this.checkedCells[i + 8]) b |= 0x40
        if (x !== 0 && this.checkedCells[i - 1]) b |= 0x80
        lineSegmentArray.push(...lineSegment(x, y, b))
      }
    }
    pathEl.setAttribute('d', lineSegmentArray.map((l) => `M${l.p0.x} ${l.p0.y} L${l.p1.x} ${l.p1.y} Z`).join(' '))

    function lineSegment(x: number, y: number, b: number): LineSegment[] {
      const pointX = (position: number) => x * 64 + 4 + ((position & 2 ? position ^ 1 : position) & 1) * 56
      const pointY = (position: number) => y * 64 + 4 + (position >> 1 & 1) * 56
      const point = (position: number) => ({x: pointX(position), y: pointY(position)})
      const array: LineSegment[] = []
      if (b & 0x80 && ~b & 0x03) array.push({p0: {x: x * 64, y: pointY(0)}, p1: point(0)})
      if (b & 0x02 && ~b & 0x81) array.push({p0: {x: pointX(0), y: y * 64}, p1: point(0)})
      if (~b & 0x02) array.push({p0: point(0), p1: point(1)})
      if (b & 0x02 && ~b & 0x0c) array.push({p0: {x: pointX(1), y: y * 64}, p1: point(1)})
      if (b & 0x08 && ~b & 0x06) array.push({p0: point(1), p1: {x: (x + 1) * 64, y: pointY(1)}})
      if (~b & 0x08) array.push({p0: point(1), p1: point(2)})
      if (b & 0x08 && ~b & 0x18) array.push({p0: point(2), p1: {x: (x + 1) * 64, y: pointY(2)}})
      if (b & 0x20 && ~b & 0x30) array.push({p0: point(2), p1: {x: pointX(2), y: (y + 1) * 64}})
      if (~b & 0x20) array.push({p0: point(3), p1: point(2)})
      if (b & 0x20 && ~b & 0x60) array.push({p0: point(3), p1: {x: pointX(3), y: (y + 1) * 64}})
      if (b & 0x80 && ~b & 0xc0) array.push({p0: {x: x * 64, y: pointY(3)}, p1: point(3)})
      if (~b & 0x80) array.push({p0: point(0), p1: point(3)})
      return array
    }
  }
}
