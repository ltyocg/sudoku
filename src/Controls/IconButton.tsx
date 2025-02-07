import type {ReactNode} from 'react'
import classes from './index.module.css'

export default function IconButton({className, onClick, children}: {
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      className={className}
      style={{fontSize: 0}}
      onClick={onClick}
    >
      <div className={classes.icon}>{children}</div>
    </button>
  )
}