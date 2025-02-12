import classes from './index.module.css'
import {Check, Redo, Select, Undo} from '../icon.tsx'
import IconButton from './IconButton.tsx'
import useControls from './useControls.tsx'

export default function ControlsAuxiliary() {
  const {multiple} = useControls()
  return (
    <div className={classes.controlsAuxiliary}>
      <IconButton className={classes.surface}>
        <Undo/>
      </IconButton>
      <IconButton className={classes.surface}>
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