import {type ReactNode, useEffect, useRef} from 'react'
import classes from './Dialog.module.css'

export default function Dialog({open, onOpenChange, children}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}) {
  const ref = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      el.showModal()
      onOpenChange?.(true)
    } else el.close()
    const listener = () => onOpenChange?.(false)
    el.addEventListener('close', listener)
    return () => el.removeEventListener('close', listener)
  }, [open])
  return (
    <dialog
      ref={ref}
      className={classes.dialog}
    >{children}</dialog>
  )
}
