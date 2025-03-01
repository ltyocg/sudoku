import {type CSSProperties, useState} from 'react'
import IconButton from './IconButton.tsx'
import classes from './index.module.css'
import {Info, Restart, Rules} from '../components/icon.tsx'
import {useCells} from '../Cells/CellsProvider.tsx'
import Dialog from '../components/Dialog.tsx'
import {MdSettings} from 'react-icons/md'

export default function ControlsApp({style}: { style: CSSProperties }) {
  return (
    <div
      style={{
        ...style,
        '--button-size': '3rem'
      } as CSSProperties}
    >
      <IconButton className={[classes.surface, classes.hover].join(' ')}>
        <MdSettings size={24}/>
      </IconButton>
      <IconButton className={[classes.surface, classes.hover].join(' ')}>
        <Rules/>
      </IconButton>
      <IconButton className={[classes.surface, classes.hover].join(' ')}>
        <Info/>
      </IconButton>
      <RestartButton/>
    </div>
  )
}

function RestartButton() {
  const {history} = useCells()
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton
        className={[classes.surface, classes.hover].join(' ')}
        title="重置"
        onClick={() => setOpen(true)}
      >
        <Restart/>
      </IconButton>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <h1 style={{textAlign: 'center'}}>重新开始</h1>
        <button
          onClick={() => {
            history.reset()
            dispatchEvent(new CustomEvent('app.reset-time'))
            setOpen(false)
          }}
        >确定
        </button>
        <button onClick={() => setOpen(false)}>取消</button>
      </Dialog>
    </>
  )
}