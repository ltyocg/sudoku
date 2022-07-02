export default class Coordinate {
  static equals(o1: Coordinate | null, o2: Coordinate | null) {
    if (o1 === o2) return true
    return o1 && o2 && o1.x === o2.x && o1.y === o2.y
  }

  readonly x: number
  readonly y: number
  readonly index: number

  constructor(index: number)
  constructor(x: number, y: number)
  constructor(arg0: number, arg1?: number) {
    if (typeof arg1 === 'undefined') {
      this.x = arg0 % 9
      this.y = Math.floor(arg0 / 9)
    } else {
      this.x = arg0
      this.y = arg1
    }
    this.index = this.x + this.y * 9
  }
}
