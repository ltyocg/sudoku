export default class CellValue {
  readonly #target: SVGGElement
  values: string[]

  constructor(target: SVGGElement) {
    this.#target = target
    this.values = Array.from({length: 81}, () => '')
  }

  set(index: number | number[], value: string) {
    if (!Array.isArray(index)) index = [index]
    index.forEach((i) => this.values[i] = value)
    this.#render()
  }

  #render() {
    this.values.forEach((value, index) => {
      let cellText = this.#target.querySelector(`text[data-index="${index}"]`) as SVGTextElement
      if (cellText) {
        if (value) cellText.textContent = value
        else this.#target.removeChild(cellText)
      } else if (value) {
        cellText = this.#target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
        cellText.textContent = value
        cellText.setAttribute('x', String(index % 9 * 64 + 32))
        cellText.setAttribute('y', String(Math.floor(index / 9) * 64 + 35.84))
        cellText.setAttribute('text-anchor', 'middle')
        cellText.setAttribute('dominant-baseline', 'middle')
        cellText.setAttribute('stroke', '#fff')
        cellText.setAttribute('stroke-width', '2px')
        cellText.setAttribute('stroke-linecap', 'butt')
        cellText.setAttribute('stroke-linejoin', 'miter')
        cellText.setAttribute('fill', '#000')
        cellText.classList.add('cell-value')
        cellText.dataset['index'] = String(index)
      }
    })
  }
}
