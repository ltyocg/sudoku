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
    type LineSegment = {
      x0: number
      y0: number
      x1: number
      y1: number
    }
    const lineSegmentArray: LineSegment[] = []
    for (let k in this.checkedCells) {
      const i = parseInt(k)
      const x = i % 9
      const y = Math.floor(i / 9)
      if (this.checkedCells[i]) {
        if (y === 0 || !this.checkedCells[i - 9]) lineSegmentArray.push(lineSegment(0, x, y))
        if (x === 8 || !this.checkedCells[i + 1]) lineSegmentArray.push(lineSegment(1, x, y))
        if (y === 8 || !this.checkedCells[i + 9]) lineSegmentArray.push(lineSegment(2, x, y))
        if (x === 0 || !this.checkedCells[i - 1]) lineSegmentArray.push(lineSegment(3, x, y))
      }
    }
    pathEl.setAttribute('d', lineSegmentArray.map((p) => `M${p.x0} ${p.y0} L${p.x1} ${p.y1} Z`).join(' '))

    function lineSegment(position: number, x: number, y: number): LineSegment {
      const r = position & 2 ? 1 + (position & 1 ^ 1) * 6 : 2 + (position & 1) * 9
      return {
        x0: x * 64 + 4 + (r >> 3 & 1) * 56,
        y0: y * 64 + 4 + (r >> 2 & 1) * 56,
        x1: x * 64 + 4 + (r >> 1 & 1) * 56,
        y1: y * 64 + 4 + (r & 1) * 56
      }
    }
  }
}
