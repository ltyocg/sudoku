import Highlights from './Highlights'
import Coordinate from '../Coordinate'
import Values from './Values'
import Givens from './Givens'
import Errors from './Errors'
import Candidates from './Candidates'

class HoverCell {
  static #cell: Coordinate | null = null
  static onChange: (oldCell: Coordinate | null, newCell: Coordinate | null) => void = () => undefined

  static set(cell: Coordinate | null) {
    if (!Coordinate.equals(this.#cell, cell)) this.onChange(this.#cell, this.#cell = cell)
  }
}

export default class Cells {
  readonly highlights: Highlights
  readonly errors: Errors
  readonly givens: Givens
  readonly candidates: Candidates
  readonly values: Values
  scale = 1
  #startCell: Coordinate | null = null
  #removeMode = false

  constructor(target: HTMLDivElement) {
    target.addEventListener('click', () => target.focus())
    target.addEventListener('blur', () => {
      this.highlights.all(false)
      this.highlights.render()
    })
    for (let y = 0; y < 9; y++) {
      const row = target.appendChild(document.createElement('div'))
      row.classList.add('row')
      for (let x = 0; x < 9; x++) {
        const cell = row.appendChild(document.createElement('div'))
        cell.classList.add('cell')
      }
    }
    this.highlights = new Highlights(document.querySelector<SVGGElement>('#cell-highlights')!)
    this.errors = new Errors(document.querySelector<SVGGElement>('#cell-errors')!)
    this.givens = new Givens(document.querySelector<SVGGElement>('#cell-givens')!, '3_6(6)5__18(7)6_37__4(5)1(7)7_3_187(3)9(3)94_5_6_1_52(5)7(7)2_')
    const freezeIndexes = this.givens.values.map((v, index) => v ? index : -1).filter((v) => v >= 0)
    this.candidates = new Candidates(document.querySelector<SVGGElement>('#cell-candidates')!, freezeIndexes)
    this.values = new Values(document.querySelector<SVGGElement>('#cell-values')!, freezeIndexes)
    this.values.onChange = values => this.errors.check(this.givens.values, values)
    HoverCell.onChange = (_, newCell) => {
      if (!this.#startCell) return
      if (newCell) {
        this.highlights.set(newCell.x, newCell.y, !this.#removeMode)
        this.highlights.render()
      }
    }
    const getCoordinate = (event: MouseEvent): Coordinate => {
      const {x, y} = target.getBoundingClientRect()
      return new Coordinate(Math.floor((event.clientX - x) / 64 / this.scale), Math.floor((event.clientY - y) / 64 / this.scale))
    }
    target.addEventListener('mousedown', event => {
      this.#startCell = getCoordinate(event)
      if (event.metaKey || event.ctrlKey) this.#removeMode = this.highlights.get(this.#startCell.x, this.#startCell.y)
      else this.highlights.all(false)
      HoverCell.set(this.#startCell)
    })
    target.addEventListener('mousemove', event => {
      if (!this.#startCell) return
      if ((event.offsetX - 32) ** 2 + (event.offsetY - 32) ** 2 > 29 ** 2) return
      HoverCell.set(getCoordinate(event))
    })
    target.addEventListener('mouseup', () => this.reset())
    target.addEventListener('dblclick', event => {
      const allValues = this.values.values.map((v, index) => this.givens.values[index] || v)
      const value = allValues[getCoordinate(event).index]
      if (!value) return
      allValues.forEach((v, i) => {
        const {x, y} = new Coordinate(i)
        if (v === value) this.highlights.set(x, y, true)
      })
      this.highlights.render()
    })
  }

  reset() {
    this.#startCell = null
    this.#removeMode = false
    HoverCell.set(null)
  }
}
