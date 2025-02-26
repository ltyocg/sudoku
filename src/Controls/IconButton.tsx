import type {ReactNode} from 'react'
import classes from './index.module.css'

export default function IconButton({className, disabled, title, onClick, children}: {
  className?: string
  disabled?: boolean
  title?: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      className={className}
      style={{fontSize: 0}}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      <div className={classes.icon}>{children}</div>
    </button>
  )
}