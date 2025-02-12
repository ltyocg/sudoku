export default class Coordinate {
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
