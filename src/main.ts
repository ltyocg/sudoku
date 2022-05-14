import './style.scss'

const cells = document.querySelector<HTMLDivElement>('.cells')!
for (let i = 0; i < 9; i++) {
  const row = cells.appendChild(document.createElement('div'))
  row.classList.add('row')
  for (let j = 0; j < 9; j++) {
    const cell = row.appendChild(document.createElement('div'))
    cell.classList.add('cell')
  }
}
