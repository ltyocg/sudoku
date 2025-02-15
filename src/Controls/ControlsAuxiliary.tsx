import classes from './index.module.css'
import {Check, Redo, Select, Undo} from '../components/icon.tsx'
import IconButton from './IconButton.tsx'
import useControls from './useControls.tsx'
import {useCells} from '../Cells/CellsProvider.tsx'

export default function ControlsAuxiliary() {
  const {history} = useCells()
  const {multiple} = useControls()
  return (
    <div className={classes.controlsAuxiliary}>
      <IconButton
        className={classes.surface}
        onClick={history.undo}
      >
        <Undo/>
      </IconButton>
      <IconButton
        className={classes.surface}
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