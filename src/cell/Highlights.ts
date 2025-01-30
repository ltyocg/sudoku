import Coordinate from '../Coordinate'

class Point {
  static equals(p0: Point, p1: Point) {
    return p0.x === p1.x && p0.y === p1.y
  }

  constructor(readonly x: number,
              readonly y: number) {
  }
}

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

  getCheckedIndexes() {
    return this.checkedCells.map((b, index) => b ? index : -1).filter((v) => v >= 0)
  }

  set(x: number, y: number, state: boolean) {
    this.checkedCells[y * 9 + x] = state
  }

  all(state: boolean) {
    this.checkedCells = Array.from({length: 81}, () => state)
  }

  render() {
    if (this.checkedCells.every(b => !b)) {
      this.#target.innerHTML = ''
      return
    }
    let pathEl = this.#target.firstElementChild as SVGPathElement
    if (!pathEl) {
      pathEl = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      pathEl.setAttribute('fill', 'rgba(255 255 255 / 0.4)')
      pathEl.setAttribute('stroke', 'rgba(0 126 255 / 0.7)')
      pathEl.setAttribute('stroke-width', '8px')
      pathEl.setAttribute('stroke-linecap', 'butt')
      pathEl.setAttribute('stroke-linejoin', 'round')
      pathEl.setAttribute('shape-rendering', 'geometricprecision')
      pathEl.setAttribute('vector-effect', 'non-scaling-stroke')
    }
    const pathSegmentArray: Point[][] = []
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
        pathSegmentArray.push(...pathSegment(x, y, b))
      }
    }
    pathEl.setAttribute('d', combine(pathSegmentArray).map((ps) => {
      const pr: (string | number)[] = ['M', ps[0].x, ps[0].y]
      for (let i = 1; i < ps.length; i++) {
        const {x, y} = ps[i]
        pr.push('L', x, y)
      }
      pr.push('Z')
      return pr
    }).flat(1).join(' '))

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
            if (target.length && Point.equals(base.at(-1)!, target[0])) {
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
  }
}
