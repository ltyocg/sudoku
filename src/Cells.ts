import Highlights from './Highlights'
import Coordinate from './Coordinate'

class HoverCell {
  static #cell: Coordinate | null = null
  static onChange: (oldCell: Coordinate | null, newCell: Coordinate | null) => void = () => undefined

  static set(cell: Coordinate | null) {
    if (!Coordinate.equals(this.#cell, cell)) this.onChange(this.#cell, this.#cell = cell)
  }
}

export default class Cells {
  #startCell: Coordinate | null = null
  #removeMode = false

  constructor(target: HTMLDivElement, highlights: Highlights) {
    for (let y = 0; y < 9; y++) {
      const row = target.appendChild(document.createElement('div'))
      row.classList.add('row')
      for (let x = 0; x < 9; x++) {
        const cell = row.appendChild(document.createElement('div'))
        cell.classList.add('cell')
      }
    }

    HoverCell.onChange = (_, newCell) => {
      if (!this.#startCell) return
      if (newCell) {
        highlights.set(newCell.x, newCell.y, !this.#removeMode)
        highlights.render()
      }
    }
    target.addEventListener('mousedown', (e) => {
      this.#startCell = getCoordinate(e)
      if (e.metaKey || e.ctrlKey) this.#removeMode = highlights.get(this.#startCell.x, this.#startCell.y)
      else highlights.all(false)
      HoverCell.set(this.#startCell)
    })
    target.addEventListener('mousemove', (e) => {
      if (!this.#startCell) return
      if ((e.offsetX - 32) ** 2 + (e.offsetY - 32) ** 2 > 29 ** 2) return
      HoverCell.set(getCoordinate(e))
    })
    target.addEventListener('mouseup', () => {
      this.reset()
    })

    function getCoordinate(event: MouseEvent): Coordinate {
      const {x, y} = target.getBoundingClientRect()
      return new Coordinate(Math.floor((event.clientX - x) / 64), Math.floor((event.clientY - y) / 64))
    }
  }

  reset() {
    this.#startCell = null
    this.#removeMode = false
    HoverCell.set(null)
  }
}
