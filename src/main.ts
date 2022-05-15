import './style.scss'
import Selection from './Selection'

const game = document.querySelector<HTMLDivElement>('.game')!
const board = document.querySelector<HTMLDivElement>('#board')!
board.style.top = '50%'
board.style.left = '50%'
const selection = new Selection(document.querySelector<SVGGElement>('#cell-highlights')!)
game.addEventListener('mousedown', (e) => {
  if (!e.composedPath().find((el) => (el as Node).nodeType === Node.ELEMENT_NODE && (el as HTMLDivElement).matches('.grid'))) {
    selection.all(false)
    selection.render()
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
  if (e.metaKey && e.code === 'KeyA') {
    selection.all(true)
    selection.render()
    oldCheckedCells = selection.checkedCells
  }
})

function addMouseEvent(cell: HTMLDivElement, x: number, y: number) {
  cell.addEventListener('mousedown', (e) => {
    mouseDown = true
    if (e.metaKey) removeMode = selection.get(x, y)
    else selection.all(false)
    selectHandler(e, true)
  })
  cell.addEventListener('mouseup', (_) => {
    //只有一个格子选中，再次点击时，取消选中
    if (arrayEquals(oldCheckedCells, selection.checkedCells)
      && selection.checkedCells.filter((_, index) => index !== y * 9 + x).every((b) => !b)) {
      selection.set(x, y, false)
      selection.render()
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
      selection.set(x, y, !removeMode)
      selection.render()
    }
  }
}

function selectEndHandler() {
  mouseDown = false
  currentCell = {x: -1, y: -1}
  removeMode = false
  oldCheckedCells = selection.checkedCells
}

function arrayEquals(a: boolean[], b: boolean[]) {
  for (let i = 0; i < 81; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
