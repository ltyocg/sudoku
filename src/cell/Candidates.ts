import Coordinate from '../Coordinate'

export default class Candidates {
  readonly #target: SVGGElement
  readonly #freezeIndexes: number[]
  values = Array.from({length: 81}, () => new Set<string>())

  constructor(target: SVGGElement, freezeIndexes: number[]) {
    this.#target = target
    this.#freezeIndexes = freezeIndexes
  }

  toggle(index: number[], value: string) {
    const remove = index
      .filter(i => !this.#freezeIndexes.includes(i))
      .every(i => this.values[i].has(value))
    index
      .filter(i => !this.#freezeIndexes.includes(i))
      .forEach(i => {
        if (remove) this.values[i].delete(value)
        else this.values[i].add(value)
      })
    this.#render()
  }

  clear(index: number[]) {
    index
      .filter(i => !this.#freezeIndexes.includes(i))
      .forEach(i => this.values[i].clear())
    this.#render()
  }

  #render() {
    this.values.forEach((v, i) => {
      let cellText = this.#target.querySelector<SVGTextElement>(`text[data-index="${i}"]`)
      if (cellText) {
        if (v.size) renderText(cellText, v)
        else this.#target.removeChild(cellText)
      } else if (v.size) {
        const cellText = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
        const {x, y} = new Coordinate(i)
        cellText.setAttribute('x', String(x * 64 + 32))
        cellText.setAttribute('y', String(y * 64 + 35.8))
        cellText.setAttribute('text-anchor', 'middle')
        cellText.setAttribute('dominant-baseline', 'middle')
        cellText.setAttribute('stroke', '#fff')
        cellText.setAttribute('stroke-width', '2px')
        cellText.setAttribute('stroke-linecap', 'butt')
        cellText.setAttribute('stroke-linejoin', 'miter')
        cellText.setAttribute('fill', '#000')
        cellText.classList.add('cell-candidate')
        cellText.dataset['index'] = i.toString()
        renderText(cellText, v)
      }
    })

    function renderText(cellText: SVGTextElement, set: Set<string>) {
      cellText.dataset['count'] = set.size.toString()
      cellText.textContent = Array.from(set).sort().join('')
    }
  }
}
