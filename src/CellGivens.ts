import Coordinate from "./Coordinate"

export default class CellGivens {
  values: string[]

  constructor(target: SVGGElement, valueStr: string) {
    this.values = valueParse(valueStr)
    this.values.forEach((value, i) => {
      if (!value) return
      const cellText = target.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
      cellText.textContent = value
      const {x, y} = new Coordinate(i)
      cellText.setAttribute('x', String(x * 64 + 32))
      cellText.setAttribute('y', String(y * 64 + 35.84))
      cellText.setAttribute('text-anchor', 'middle')
      cellText.setAttribute('dominant-baseline', 'middle')
      cellText.setAttribute('stroke', '#fff')
      cellText.setAttribute('stroke-width', '2px')
      cellText.setAttribute('stroke-linecap', 'butt')
      cellText.setAttribute('stroke-linejoin', 'miter')
      cellText.setAttribute('fill', '#000')
      cellText.classList.add('cell-given')
    })

    function valueParse(str: string): string[] {
      let at = 0, ch = ''
      const r: string[] = []
      const error = (m?: string) => {
        throw new SyntaxError(m)
      }
      const peek = () => str.charAt(at)
      const next = (c?: string) => {
        if (c && c !== ch) error(`Expected ${c} instead of ${ch}`)
        ch = peek()
        at++
      }
      const blankGroup = (): ''[] => {
        next('(')
        let ns = ''
        while (ch >= '0' && ch <= '9') {
          ns += ch
          next()
        }
        next(')')
        return Array.from({length: parseInt(ns)}, () => '')
      }
      const value = (): string => {
        const v = ch !== '_' ? ch : ''
        next()
        return v
      }
      next()
      while (ch) {
        if (ch === '(') r.push(...blankGroup())
        else r.push(value())
      }
      if (r.length > 81) error('The data size exceeds 81')
      return r
    }
  }
}

