import './style.scss'
import Highlights from './Highlights'
import CellValues from './CellValues'
import CellGivens from './CellGivens'
import CellErrors from './CellErrors'
import Cells from './Cells'

const game = document.querySelector<HTMLDivElement>('.game')!
const board = document.querySelector<HTMLDivElement>('#board')!
board.style.top = '50%'
board.style.left = '50%'
const highlights = new Highlights(document.querySelector<SVGGElement>('#cell-highlights')!)
const cellErrors = new CellErrors(document.querySelector<SVGGElement>('#cell-errors')!)
const cellGivens = new CellGivens(document.querySelector<SVGGElement>('#cell-givens')!, '3_6(6)5__18(7)6_37__4(5)1(7)7_3_187(3)9(3)94_5_6_1_52(5)7(7)2_')
const cellValues = new CellValues(document.querySelector<SVGGElement>('#cell-values')!, cellGivens.values.map((v, index) => v ? index : -1).filter((v) => v >= 0))
const cells = new Cells(document.querySelector<HTMLDivElement>('.cells')!, highlights)
cellValues.onChange = (values) => cellErrors.check(cellGivens.values, values)
game.addEventListener('mousedown', (e) => {
  if (outOfCells(e)) {
    highlights.all(false)
    highlights.render()
  }
})
game.addEventListener('mouseup', (e) => {
  if (outOfCells(e)) cells.reset()
})

function outOfCells(event: MouseEvent) {
  return !event.composedPath().find((el) => (el as Node).nodeType === Node.ELEMENT_NODE && (el as HTMLDivElement).matches('.grid'))
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    highlights.all(false)
    highlights.render()
    return
  }
  if (e.code === 'Backspace') {
    cellValues.set(highlights.checkedCells.map((b, index) => b ? index : -1).filter((v) => v >= 0), '')
    return
  }
  if (/Digit\d/.test(e.code)) {
    cellValues.toggle(highlights.checkedCells.map((b, index) => b ? index : -1).filter((v) => v >= 0), e.key)
    return
  }
  if ((e.metaKey || e.ctrlKey) && e.code === 'KeyA') {
    highlights.all(true)
    highlights.render()
    return
  }
})
