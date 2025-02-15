import Cells from './Cells'
import CellsProvider from './Cells/CellsProvider.tsx'
import Toolbar from './Toolbar.tsx'
import Game from './Game.tsx'
import Controls from './Controls'
import useHighlights, {HighlightsProvider} from './Cells/useHighlights.tsx'
import {useEffect, useRef} from 'react'
import {AppProvider} from './useApp.tsx'

export default function App() {
  return (
    <AppProvider>
      <Toolbar/>
      <HighlightsProvider>
        <Main/>
      </HighlightsProvider>
    </AppProvider>
  )
}

function Main() {
  const {checkedSet, setCheckedSet} = useHighlights()
  const gameRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const gameElement = gameRef.current
    if (!gameElement) return
    const listener = (event: MouseEvent) => {
      if (!event.composedPath().find(eventTarget => cellsRef.current === eventTarget || controlsRef.current === eventTarget)
        && checkedSet.size) setCheckedSet(new Set())
    }
    gameElement.addEventListener('mousedown', listener)
    return () => gameElement.removeEventListener('mousedown', listener)
  })
  return (
    <CellsProvider>
      <Game ref={gameRef}>
        <Cells ref={cellsRef}/>
        <Controls ref={controlsRef}/>
      </Game>
    </CellsProvider>
  )
}