import classes from './Toolbar.module.css'
import {useEffect, useState} from 'react'

export default function Toolbar() {
  return (
    <div className={classes.toolbar}>
      <div style={{flex: 1}}/>
      <Timer/>
    </div>
  )
}

function Timer() {
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  useEffect(() => {
    let interval: number | undefined
    if (isRunning) {
      const start = Date.now() - elapsedTime
      setStartTime(start)
      interval = setInterval(() => setElapsedTime(Date.now() - start), 100)
    } else if (interval !== undefined) clearInterval(interval)
    return () => clearInterval(interval)
  }, [isRunning])
  const totalSeconds = Math.floor(elapsedTime / 1000)
  return (
    <>
      <div>
        {Math.floor(totalSeconds / 3600).toString().padStart(2, '0')}
        :
        {Math.floor(totalSeconds % 3600 / 60).toString().padStart(2, '0')}
        :
        {(totalSeconds % 60).toString().padStart(2, '0')}
      </div>
      <button
        className={classes.timerControl}
        onClick={() => setIsRunning(v => !v)}
        title={isRunning ? '暂停' : '继续'}
      >
        <svg viewBox="0 0 24 24">
          <path
            d={isRunning
              ? 'M10 16c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1zm2-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-4c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z'
              : 'M10.8 15.9l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1c-.33-.25-.8-.01-.8.4v7c0 .41.47.65.8.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'}
          />
        </svg>
      </button>
    </>
  )
}