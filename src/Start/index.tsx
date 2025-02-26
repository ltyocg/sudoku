import classes from './index.module.css'
import useAppState from '../useAppState.tsx'

export default function Start() {
  const {navigate} = useAppState()
  return (
    <div className={classes.start}>
      <h1>数独游戏</h1>
      <div className={classes.buttonGroup}>
        <button
          className={classes.button}
          onClick={() => navigate('/start/selectLevel')}
        >开始游戏
        </button>
        <button className={classes.button}>自定义游戏</button>
      </div>
    </div>
  )
}