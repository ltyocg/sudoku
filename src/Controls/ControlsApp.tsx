import type {CSSProperties} from 'react'
import IconButton from './IconButton.tsx'
import classes from './index.module.css'
import {Info, Restart, Rules, Settings} from '../components/icon.tsx'

export default function ControlsApp({style}: { style: CSSProperties }) {
  return (
    <div
      style={{
        ...style,
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
  )
}