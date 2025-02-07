import classes from './index.module.css'
import Grid from './Grid.tsx'
import Repeat from '../Repeat.tsx'
import Highlights from './Highlights.tsx'
import Givens from './Givens.tsx'
import useHighlights from './useHighlights.tsx'
import Values from './Values.tsx'
import Errors from './Errors.tsx'
import Candidates from './Candidates.tsx'

export default function Cells() {
  const {setCheckedSet} = useHighlights()
  return (
    <>
      <div>
        <Repeat length={9}>
          {y => (
            <div className={classes.row}>
              <Repeat length={9}>
                {x => (
                  <div
                    className={classes.cell}
                    onMouseDown={() => setCheckedSet(new Set([y * 9 + x]))}
                    onMouseMove={event => {
                      if (event.buttons !== 1) return
                      if ((event.nativeEvent.offsetX - 32) ** 2 + (event.nativeEvent.offsetY - 32) ** 2 > 29 ** 2) return
                      setCheckedSet(v => new Set(v).add(y * 9 + x))
                    }}
                  />
                )}
              </Repeat>
            </div>
          )}
        </Repeat>
      </div>
      <svg
        className={classes.boardsvg}
        viewBox="-48 -64 672 704"
      >
        <g id="background"></g>
        <g id="underlay"></g>
        <g id="cell-colors"></g>
        <Highlights/>
        <g id="arrows"></g>
        <Grid/>
        <Errors/>
        <g id="overlay"></g>
        <Givens/>
        <g id="cell-pen"></g>
        <g id="cell-pencilmarks"></g>
        <Candidates/>
        <Values/>
      </svg>
    </>
  )
}