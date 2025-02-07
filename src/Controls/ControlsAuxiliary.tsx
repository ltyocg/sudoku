import classes from './index.module.css'
import {Check, Redo, Select, Undo} from '../icon.tsx'
import IconButton from './IconButton.tsx'

export default function ControlsAuxiliary() {
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
      <IconButton className={classes.surface}>
        <Select/>
      </IconButton>
    </div>
  )
}