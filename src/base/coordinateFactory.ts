export interface Coordinate {
  x: number
  y: number
}

class CoordinateFactory {
  readonly #array: Coordinate[][]

  constructor(rowSize: number, columnSize: number) {
    this.#array = Array.from({length: rowSize}, (_, y) => Array.from({length: columnSize}, (_, x) => ({x, y})))
  }

  get(x: number, y: number) {
    return this.#array[y]?.[x]
  }

  all() {
    return this.#array.flat(1)
  }
}

export default new CoordinateFactory(9, 9)