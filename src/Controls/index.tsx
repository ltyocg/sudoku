import classes from './index.module.css'
import {type CSSProperties} from 'react'
import {Info, Restart, Rules, Settings} from '../icon.tsx'
import ControlsMain from './ControlsMain.tsx'
import ControlsAuxiliary from './ControlsAuxiliary.tsx'
import IconButton from './IconButton.tsx'

export default function Controls() {
  return (
    <div className={classes.controls}>
      <div
        style={{
          '--button-size': '3rem'
        } as CSSProperties}
      >
        <IconButton className={[classes.surface, classes.hover].join(' ')}>
          <Settings/>
        </IconButton>
        <IconButton className={[classes.surface, classes.hover].join(' ')}>
          <Rules/>
        </IconButton>
        <IconButton className={[classes.surface, classes.hover].join(' ')}>
          <Info/>
        </IconButton>
        <IconButton className={[classes.surface, classes.hover].join(' ')}>
          <Restart/>
        </IconButton>
      </div>
      <ControlsMain/>
      <ControlsAuxiliary/>
    </div>
  )
}