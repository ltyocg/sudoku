import classes from './Toolbar.module.css'
import {useEffect, useState} from 'react'
import {useMain} from './useMain.tsx'
import Dialog from '../components/Dialog.tsx'
import {Paused, Resume} from '../components/icon.tsx'

export default function Toolbar() {
  return (
    <div className={classes.toolbar}>
      <div style={{flex: 1}}/>
      <Timer/>
    </div>
  )
}

function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const {paused, setPaused} = useMain()
  useEffect(() => {
    let interval: number | undefined
    if (!paused) {
      const start = Date.now() - elapsedTime
      interval = setInterval(() => setElapsedTime(Date.now() - start), 100)
    } else if (interval !== undefined) clearInterval(interval)
    return () => clearInterval(interval)
  }, [elapsedTime, paused])
  useEffect(() => {
    const abortController = new AbortController()
    addEventListener('app.reset-time', () => setElapsedTime(0), {signal: abortController.signal})
    return () => abortController.abort()
  }, [])
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
        onClick={() => setPaused(v => !v)}
        title={paused ? '继续' : '暂停'}
      >
        {paused ? <Resume/> : <Paused/>}
      </button>
      <Dialog
        open={paused}
        onOpenChange={setPaused}
      >
        <h1 style={{textAlign: 'center'}}>游戏暂停</h1>
        <div>
          <button
            className={classes.resume}
            onClick={() => setPaused(false)}
          >
            继续
            <Resume/>
          </button>
        </div>
      </Dialog>
    </>
  )
}