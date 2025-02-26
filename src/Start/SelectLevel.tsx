import classes from './index.module.css'
import useAppState from '../useAppState.tsx'

export default function SelectLevel() {
  const {navigate} = useAppState()
  return (
    <div className={classes.selectLevel}>
      <div className={classes.title}>
        <h1>选择关卡</h1>
        <button
          className={classes.button}
          onClick={() => navigate('/start')}
        >返回
        </button>
      </div>
    </div>
  )
}