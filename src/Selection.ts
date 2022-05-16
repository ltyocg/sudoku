export default class Selection {
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
      const x = i % 9
      const y = Math.floor(i / 9)
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
      const point = (position: number) => {
        const pt = position & 2 ? position ^ 1 : position
        return {
          x: x * 64 + 4 + (pt & 1) * 56,
          y: y * 64 + 4 + (pt >> 1 & 1) * 56
        }
      }
      const array: LineSegment[] = []
      if (~b & 0x02) array.push({p0: point(0), p1: point(1)})
      if (~b & 0x08) array.push({p0: point(1), p1: point(2)})
      if (~b & 0x20) array.push({p0: point(3), p1: point(2)})
      if (~b & 0x80) array.push({p0: point(0), p1: point(3)})
      return array
    }
  }
}
