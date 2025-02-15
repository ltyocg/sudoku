import {createContext, type ReactNode, type RefObject, use, useEffect, useState} from 'react'
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

export default function Game({ref, children}: {
  ref: RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const [size, setSize] = useState<Size>({width: 0, height: 0})
  useEffect(() => {
    const element = ref.current
    if (!element) return
    setSize({width: element.scrollWidth, height: element.scrollHeight})
    const resizeObserver = new ResizeObserver(([{borderBoxSize: [{inlineSize, blockSize}]}]) => setSize({width: inlineSize, height: blockSize}))
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])
  return (
    <Context value={size}>
      <ControlsProvider>
        <div
          ref={ref}
          className={classes.game}
          data-portrait={size.width < size.height}
        >
          <div className={classes.board}>{children}</div>
        </div>
      </ControlsProvider>
    </Context>
  )
}