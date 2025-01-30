import Coordinate from '../Coordinate'

export default class Errors {
  readonly #target: SVGGElement

  constructor(target: SVGGElement) {
    this.#target = target
  }

  check(given: string[], values: string[]) {
    const array = values.map((v, index) => given[index] || v)
    const numberArray = Array.from({length: 81}, (_, i) => i)
    const set = new Set<number>()
    //行校验
    checkBlock((a, i) => a.slice(i * 9, (i + 1) * 9)).forEach((i) => set.add(i))
    //列校验
    checkBlock((a, i) => a.filter((_, index) => index % 9 === i)).forEach((i) => set.add(i))
    //九宫校验
    checkBlock((a, i) => a.filter((_, index) => {
      const {x, y} = new Coordinate(index)
      const xb = i % 3, yb = Math.floor(i / 3)
      return x >= xb * 3 && x < (xb + 1) * 3 && y >= yb * 3 && y < (yb + 1) * 3
    })).forEach((i) => set.add(i))
    Array.from({length: 81}, (_, i) => set.has(i)).forEach((b, i) => {
      let rect = this.#target.querySelector<SVGRectElement>(`rect[data-index="${i}"]`)
      if (rect) {
        if (!b) this.#target.removeChild(rect)
      } else if (b) {
        rect = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect'))
        rect.classList.add('cell-error')
        const {x, y} = new Coordinate(i)
        rect.setAttribute('x', String(x * 64))
        rect.setAttribute('y', String(y * 64))
        rect.setAttribute('vector-effect', 'non-scaling-size')
        rect.setAttribute('fill', 'none')
        rect.setAttribute('stroke', 'none')
        rect.setAttribute('stroke-width', '0')
        rect.setAttribute('width', '64')
        rect.setAttribute('height', '64')
        rect.setAttribute('opacity', '1')
        rect.dataset['index'] = i.toString()
      }
    })

    function checkBlock(splitter: (a: number[], i: number) => number[]): number[] {
      return Array.from({length: 9}, (_, i) => i)
        .map(i => splitter(numberArray, i))
        .map(a => {
          const o: Record<string, number[]> = {}
          a.forEach((n) => {
            const v = array[n]
            if (v) o[v] = (o[v] ?? []).concat(n)
          })
          return Object.values(o).filter(na => na.length > 1)
        })
        .flat(2)
    }
  }
}
