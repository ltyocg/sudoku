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
  constructor(...args: number[]) {
    if (args.length === 1) {
      this.x = args[0] % 9
      this.y = Math.floor(args[0] / 9)
    } else {
      this.x = args[0]
      this.y = args[1]
    }
    this.index = this.x + this.y * 9
  }
}
