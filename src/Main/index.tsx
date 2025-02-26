import {MainProvider} from './useMain.tsx'
import Toolbar from './Toolbar.tsx'
import {HighlightsProvider} from '../Cells/useHighlights.tsx'
import Game from './Game.tsx'

export default function Main() {
  return (
    <MainProvider>
      <Toolbar/>
      <HighlightsProvider>
        <Game/>
      </HighlightsProvider>
    </MainProvider>
  )
}