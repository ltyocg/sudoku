import Toolbar from './Toolbar.tsx'
import Game from './Game.tsx'
import {HighlightsProvider} from './Cells/useHighlights.tsx'
import {AppProvider} from './useApp.tsx'

export default function App() {
  return (
    <AppProvider>
      <Toolbar/>
      <HighlightsProvider>
        <Game/>
      </HighlightsProvider>
    </AppProvider>
  )
}
