import {createContext, type ReactNode, use, useState} from 'react'

interface Wrapper<T> {
  value: T
  set: (value: T) => void
}

const ControlsContext = createContext<{
  toolType: Wrapper<string>
  multiple: Wrapper<boolean>
}>(null!)
export default function useControls() {
  return use(ControlsContext)
}

export function ControlsProvider({children}: { children: ReactNode }) {
  const [state, setState] = useState<{
    toolType: string
    multiple: boolean
  }>({
    toolType: 'normal',
    multiple: false
  })
  return (
    <ControlsContext value={{
      toolType: {
        value: state.toolType,
        set: toolType => setState(v => ({...v, toolType}))
      },
      multiple: {
        value: state.multiple,
        set: multiple => setState(v => ({...v, multiple}))
      }
    }}>{children}</ControlsContext>
  )
}