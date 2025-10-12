export default class Point {
  constructor(readonly x: number,
              readonly y: number) {
  }

  equals(other: Point) {
    return this.x === other.x && this.y === other.y
  }

  toTranslate(x: number, y: number) {
    return new Point(this.x + x, this.y + y)
  }

  toString() {
    return `${this.x},${this.y}`
  }
}