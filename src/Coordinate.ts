export default class Coordinate {
  readonly x: number
  readonly y: number

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
  }
}
