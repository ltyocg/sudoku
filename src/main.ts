import './style.css'
import Cells from './cell/Cells'

const board = document.querySelector<HTMLDivElement>('#board')!
const cells = new Cells(document.querySelector<HTMLDivElement>('.Cells')!)

const isMac = navigator.userAgent.includes('Mac')
document.addEventListener('keydown', event => {
  if (event.code === 'Escape') {
    cells.highlights.all(false)
    cells.highlights.render()
    return
  }
  if (event.code === 'Backspace') {
    if (isMac ? event.metaKey : event.ctrlKey) cells.candidates.clear(cells.highlights.getCheckedIndexes())
    else cells.values.set(cells.highlights.getCheckedIndexes(), '')
    return
  }
  if (/Digit\d/.test(event.code)) {
    event.preventDefault()
    if (isMac ? event.metaKey : event.ctrlKey) {
      const highlightIndexes = cells.highlights.getCheckedIndexes()
      cells.candidates.toggle(highlightIndexes.filter((i) => !cells.values.values[i]), event.key)
    } else {
      cells.values.toggle(cells.highlights.getCheckedIndexes(), event.key)
      cells.candidates.clear(cells.highlights.getCheckedIndexes())
    }
    return
  }
  if ((isMac ? event.metaKey : event.ctrlKey) && event.code === 'KeyA') {
    cells.highlights.all(true)
    cells.highlights.render()
    return
  }
})
addEventListener('resize', () => {
  const padding = 50
  const boardSide = board.clientWidth
  const scale = (Math.min(document.body.clientWidth, document.body.clientHeight) - padding * 2) / boardSide
  board.attributeStyleMap.set('transform', `scale(${scale})`)
  board.attributeStyleMap.set('top', `${Math.min((document.body.clientHeight - boardSide * scale) / 2, padding)}px`)
  board.attributeStyleMap.set('left', `${Math.min((document.body.clientWidth - boardSide * scale) / 2, padding)}px`)
  cells.scale = scale
})
dispatchEvent(new Event('resize'))
