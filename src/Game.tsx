import {createContext, type ReactNode, use, useEffect, useRef, useState} from 'react'
import classes from './App.module.css'
import {ControlsProvider} from './Controls/useControls.tsx'

interface Size {
  width: number
  height: number
}

const Context = createContext<Size>(null!)

export function useSize() {
  return use(Context)
}

export default function Game({children}: { children: ReactNode }) {
  const [size, setSize] = useState<Size>({width: 0, height: 0})
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    setSize({width: element.scrollWidth, height: element.scrollHeight})
    const resizeObserver = new ResizeObserver(([{borderBoxSize: [{inlineSize, blockSize}]}]) => setSize({width: inlineSize, height: blockSize}))
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])
  const portraitMode = size.width < size.height
  return (
    <Context value={size}>
      <ControlsProvider>
        <div
          ref={ref}
          className={classes.game}
          data-portrait={portraitMode}
        >
          <div
            className={classes.board}
            style={{
              transform: `scale(1)`
            }}
          >{children}</div>
        </div>
      </ControlsProvider>
    </Context>
  )
}