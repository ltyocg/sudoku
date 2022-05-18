import './style.scss'
import Highlights from './Highlights'
import CellValues from './CellValues'
import CellGivens from './CellGivens'
import CellErrors from './CellErrors'

const game = document.querySelector<HTMLDivElement>('.game')!
const board = document.querySelector<HTMLDivElement>('#board')!
board.style.top = '50%'
board.style.left = '50%'
const highlights = new Highlights(document.querySelector<SVGGElement>('#cell-highlights')!)
const cellErrors = new CellErrors(document.querySelector<SVGGElement>('#cell-errors')!)
const cellGivens = new CellGivens(document.querySelector<SVGGElement>('#cell-givens')!, '3_6(6)5__18(7)6_37__4(5)1(7)7_3_187(3)9(3)94_5_6_1_52(5)7(7)2_')
const cellValues = new CellValues(document.querySelector<SVGGElement>('#cell-values')!, cellGivens.values.map((v, index) => v ? index : -1).filter((v) => v >= 0))
cellValues.onChange = (values) => cellErrors.check(cellGivens.values, values)
game.addEventListener('mousedown', (e) => {
  if (!e.composedPath().find((el) => (el as Node).nodeType === Node.ELEMENT_NODE && (el as HTMLDivElement).matches('.grid'))) {
    highlights.all(false)
    highlights.render()
    selectEndHandler()
  }
})

const cells = document.querySelector<HTMLDivElement>('.cells')!
for (let y = 0; y < 9; y++) {
  const row = cells.appendChild(document.createElement('div'))
  row.classList.add('row')
  for (let x = 0; x < 9; x++) {
    const cell = row.appendChild(document.createElement('div'))
    cell.classList.add('cell')
    addMouseEvent(cell, x, y)
  }
}
let mouseDown = false
let currentCell = {x: -1, y: -1}
let removeMode = false
let oldCheckedCells = Array.from({length: 81}, () => true)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Backspace') {
    cellValues.set(highlights.checkedCells.map((b, index) => b ? index : -1).filter((v) => v >= 0), '')
    return
  }
  if (/Digit\d/.test(e.code)) {
    cellValues.set(highlights.checkedCells.map((b, index) => b ? index : -1).filter((v) => v >= 0), e.key)
    return
  }
  if ((e.metaKey || e.ctrlKey) && e.code === 'KeyA') {
    highlights.all(true)
    highlights.render()
    oldCheckedCells = highlights.checkedCells
    return
  }
})

function addMouseEvent(cell: HTMLDivElement, x: number, y: number) {
  cell.addEventListener('mousedown', (e) => {
    mouseDown = true
    if (e.metaKey || e.ctrlKey) removeMode = highlights.get(x, y)
    else highlights.all(false)
    selectHandler(e, true)
  })
  cell.addEventListener('mouseup', (_) => {
    //只有一个格子选中，再次点击时，取消选中
    if (arrayEquals(oldCheckedCells, highlights.checkedCells)
      && highlights.checkedCells.filter((_, index) => index !== y * 9 + x).every((b) => !b)) {
      highlights.set(x, y, false)
      highlights.render()
    }
    selectEndHandler()
  })
  cell.addEventListener('mouseenter', (_) => {
    currentCell = {x, y}
  })
  cell.addEventListener('mousemove', (e) => {
    if (mouseDown && currentCell.x === x && currentCell.y === y)
      selectHandler(e, (e.offsetX - 32) ** 2 + (e.offsetY - 32) ** 2 < 29 ** 2)
  })
  cell.addEventListener('dblclick', (_) => {
  })

  function selectHandler(_: MouseEvent, availableArea: boolean) {
    if (availableArea) {
      highlights.set(x, y, !removeMode)
      highlights.render()
    }
  }
}

function selectEndHandler() {
  mouseDown = false
  currentCell = {x: -1, y: -1}
  removeMode = false
  oldCheckedCells = highlights.checkedCells
}

function arrayEquals(a: boolean[], b: boolean[]) {
  for (let i = 0; i < 81; i++) if (a[i] !== b[i]) return false
  return true
}
