import classes from './index.module.css'
import {type CSSProperties, type RefObject} from 'react'
import {Info, Restart, Rules, Settings} from '../components/icon.tsx'
import ControlsMain from './ControlsMain.tsx'
import ControlsAuxiliary from './ControlsAuxiliary.tsx'
import IconButton from './IconButton.tsx'

export default function Controls({ref}: { ref: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className={classes.controls}
    >
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