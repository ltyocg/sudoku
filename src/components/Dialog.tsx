import {type ReactNode, useEffect, useRef} from 'react'
import classes from './Dialog.module.css'
import {createPortal} from 'react-dom'

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
    const abortController = new AbortController()
    el.addEventListener('close', () => onOpenChange?.(false), {signal: abortController.signal})
    return () => abortController.abort()
  }, [open])
  return (
    <>
      {createPortal(
        <dialog
          ref={ref}
          className={classes.dialog}
        >{children}</dialog>,
        document.body
      )}
    </>
  )
}
