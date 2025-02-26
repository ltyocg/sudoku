import classes from './index.module.css'
import {Check, Redo, Select, Undo} from '../components/icon.tsx'
import IconButton from './IconButton.tsx'
import useControls from './useControls.tsx'
import {useCells} from '../Cells/CellsProvider.tsx'
import {type CSSProperties, useEffect} from 'react'
import {ctrlKey} from '../util.ts'

export default function ControlsAuxiliary({style}: { style: CSSProperties }) {
  const {history} = useCells()
  const {multiple} = useControls()
  useEffect(() => {
    const abortController = new AbortController()
    document.addEventListener('keydown', event => {
      if (!ctrlKey(event)) return
      if (event.code === 'KeyZ') {
        event.preventDefault()
        history.undo()
      } else if (event.code === 'KeyY') {
        event.preventDefault()
        history.redo()
      }
    }, {signal: abortController.signal})
    return () => abortController.abort()
  })
  return (
    <div
      className={classes.controlsAuxiliary}
      style={style}
    >
      <IconButton
        className={classes.surface}
        disabled={!history.canUndo}
        title="撤销"
        onClick={history.undo}
      >
        <Undo/>
      </IconButton>
      <IconButton
        className={classes.surface}
        disabled={!history.canRedo}
        title="重做"
        onClick={history.redo}
      >
        <Redo/>
      </IconButton>
      <IconButton className={classes.surface}>
        <Check/>
      </IconButton>
      <IconButton
        className={multiple.value ? classes.solid : classes.surface}
        onClick={() => multiple.set(!multiple.value)}
      >
        <Select/>
      </IconButton>
    </div>
  )
}