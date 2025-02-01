import Coordinate from '../Coordinate'

export default class Values {
  readonly #target: SVGGElement
  readonly #freezeIndexes: number[]
  values = Array.from({length: 81}, () => '')
  onChange: (values: string[]) => void = () => undefined

  constructor(target: SVGGElement, freezeIndexes: number[]) {
    this.#target = target
    this.#freezeIndexes = freezeIndexes
  }

  set(index: number | number[], value: string) {
    if (!Array.isArray(index)) index = [index]
    index
      .filter(i => !this.#freezeIndexes.includes(i))
      .forEach(i => this.values[i] = value)
    this.values.forEach((value, i) => {
      let cellText = this.#target.querySelector<SVGTextElement>(`text[data-index="${i}"]`)
      if (cellText) {
        if (value) cellText.textContent = value
        else this.#target.removeChild(cellText)
      } else if (value) {
        cellText = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
        cellText.textContent = value
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
        cellText.classList.add('cell-value')
        cellText.dataset['index'] = i.toString()
      }
    })
    this.onChange(this.values)
  }

  toggle(index: number | number[], value: string) {
    if (!Array.isArray(index)) index = [index]
    this.set(index, index
      .filter(i => !this.#freezeIndexes.includes(i))
      .every(i => this.values[i] === value) ? '' : value)
  }
}
