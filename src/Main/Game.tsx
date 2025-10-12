import {type CSSProperties, useEffect, useLayoutEffect, useRef, useState} from 'react'
import classes from './Game.module.css'
import {ControlsProvider} from '../Controls/useControls.tsx'
import CellsProvider from '../Cells/CellsProvider.tsx'
import Cells from '../Cells'
import Controls from '../Controls'
import useHighlights from '../Cells/useHighlights.tsx'

export default function Game() {
  const ref = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [boardStyle, setBoardStyle] = useState<CSSProperties>({})
  const controlsRef = useRef<HTMLDivElement>(null)
  const [controlsStyle, setControlsStyle] = useState<CSSProperties>({})
  const {checkedSet, setCheckedSet} = useHighlights()
  useLayoutEffect(() => {
    const element = ref.current, boardElement = boardRef.current, controlsElement = controlsRef.current
    if (!(element && boardElement && controlsElement)) return
    const listener = (width: number, height: number) => {
      const gap = 10
      const board = {scale: 1, top: 0, left: 0}
      const controls = {scale: 1, top: 0, left: 0, flexDirection: 'column' as 'row' | 'column'}
      if (width >= height) {
        controls.flexDirection = 'column'
        controls.scale = Math.min(height / controlsElement.clientHeight, 1)
        board.scale = Math.min(height / boardElement.clientHeight, (width - gap - controlsElement.clientWidth * controls.scale) / boardElement.clientWidth)
        board.top = height / 2
        controls.top = height / 2
        board.left = (width - gap - controlsElement.clientWidth * controls.scale) / 2
        controls.left = (width + gap + boardElement.clientWidth * board.scale) / 2
      } else {
        controls.flexDirection = 'row'
        controls.scale = Math.min(width / controlsElement.clientWidth, 1)
        board.scale = Math.min(width / boardElement.clientWidth, (height - gap - controlsElement.clientHeight * controls.scale) / boardElement.clientHeight)
        board.top = (height - gap - controlsElement.clientHeight * controls.scale) / 2
        controls.top = (height + gap + boardElement.clientHeight * board.scale) / 2
        board.left = width / 2
        controls.left = width / 2
      }
      setBoardStyle({
        transform: `translate(-50%, -50%) scale(${board.scale})`,
        top: board.top,
        left: board.left
      })
      setControlsStyle({
        transform: `translate(-50%, -50%) scale(${controls.scale})`,
        top: controls.top,
        left: controls.left,
        flexDirection: controls.flexDirection
      })
    }
    listener(element.clientWidth, element.clientHeight)
    const resizeObserver = new ResizeObserver(([{borderBoxSize: [{inlineSize, blockSize}]}]) => listener(inlineSize, blockSize))
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])
  useEffect(() => {
    const gameElement = ref.current
    if (!gameElement) return
    const abortController = new AbortController()
    gameElement.addEventListener('mousedown', (event: MouseEvent) => {
      if (!event.composedPath().find(eventTarget => gridRef.current === eventTarget || controlsRef.current === eventTarget)
        && checkedSet.size) setCheckedSet(new Set())
    }, {signal: abortController.signal})
    return () => abortController.abort()
  }, [checkedSet])
  return (
    <CellsProvider>
      <ControlsProvider>
        <div
          ref={ref}
          className={classes.game}
        >
          <div
            ref={boardRef}
            className={classes.board}
            style={boardStyle}
          >
            <Cells gridRef={gridRef}/>
          </div>
          <Controls
            ref={controlsRef}
            style={controlsStyle}
          />
        </div>
      </ControlsProvider>
    </CellsProvider>
  )
}