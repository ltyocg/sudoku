import classes from './index.module.css'
import {type CSSProperties, type RefObject} from 'react'
import ControlsMain from './ControlsMain.tsx'
import ControlsAuxiliary from './ControlsAuxiliary.tsx'
import ControlsApp from './ControlsApp.tsx'

export default function Controls({ref, style}: {
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
}) {
  const v = style.flexDirection === 'column'
  return (
    <div
      ref={ref}
      className={classes.controls}
      style={style}
    >
      <ControlsApp style={{flexDirection: v ? undefined : 'column'}}/>
      {v ? (
        <>
          <ControlsMain/>
          <ControlsAuxiliary style={{flexDirection: v ? undefined : 'column'}}/>
        </>
      ) : (
        <>
          <ControlsAuxiliary style={{flexDirection: v ? undefined : 'column'}}/>
          <ControlsMain/>
        </>
      )}
    </div>
  )
}