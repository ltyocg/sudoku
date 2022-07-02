import './style.scss'
import Cells from './cell/Cells'

const game = document.querySelector<HTMLDivElement>('.game')!
const board = document.querySelector<HTMLDivElement>('#board')!
const cells = new Cells(document.querySelector<HTMLDivElement>('.cells')!)

game.addEventListener('mousedown', (e) => {
  if (outOfCells(e)) {
    cells.highlights.all(false)
    cells.highlights.render()
  }
})
game.addEventListener('mouseup', (e) => {
  if (outOfCells(e)) cells.reset()
})

function outOfCells(event: MouseEvent) {
  return !event.composedPath().find((el) => (el as Node).nodeType === Node.ELEMENT_NODE && (el as HTMLDivElement).matches('.grid'))
}

const isMac = navigator.userAgent.includes('Mac')
document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    cells.highlights.all(false)
    cells.highlights.render()
    return
  }
  if (e.code === 'Backspace') {
    if (isMac ? e.metaKey : e.ctrlKey) cells.candidates.clear(cells.highlights.getCheckedIndexes())
    else cells.values.set(cells.highlights.getCheckedIndexes(), '')
    return
  }
  if (/Digit\d/.test(e.code)) {
    e.preventDefault()
    if (isMac ? e.metaKey : e.ctrlKey) {
      const highlightIndexes = cells.highlights.getCheckedIndexes()
      cells.candidates.toggle(highlightIndexes.filter((i) => !cells.values.values[i]), e.key)
    } else {
      cells.values.toggle(cells.highlights.getCheckedIndexes(), e.key)
      cells.candidates.clear(cells.highlights.getCheckedIndexes())
    }
    return
  }
  if ((isMac ? e.metaKey : e.ctrlKey) && e.code === 'KeyA') {
    cells.highlights.all(true)
    cells.highlights.render()
    return
  }
})
addEventListener('resize', () => {
  const padding = 50
  const boardSide = board.clientWidth
  const scale = (Math.min(document.body.clientWidth, document.body.clientHeight) - padding * 2) / boardSide
  board.style.transform = `scale(${scale})`
  board.style.top = `${Math.min((document.body.clientHeight - boardSide * scale) / 2, padding)}px`
  board.style.left = `${Math.min((document.body.clientWidth - boardSide * scale) / 2, padding)}px`
  cells.scale = scale
})
dispatchEvent(new Event('resize'))
