import classes from './App.module.css'
import Cells from './Cells'
import CellsProvider from './Cells/CellsProvider.tsx'
import Toolbar from './Toolbar.tsx'
import Game from './Game.tsx'
import Controls from './Controls'
import {HighlightsProvider} from './Cells/useHighlights.tsx'

export default function App() {
  return (
    <>
      <Toolbar/>
      <HighlightsProvider>
        <CellsProvider>
          <Game>
            <div className={classes.grid}>
              <Cells/>
            </div>
            <Controls/>
          </Game>
        </CellsProvider>
      </HighlightsProvider>
    </>
  )
}
