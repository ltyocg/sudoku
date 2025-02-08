import classes from './index.module.css'
import {Centre, Color, Corner, Delete, Digit} from '../icon.tsx'
import {useEffect, useState} from 'react'
import IconButton from './IconButton.tsx'
import {useCells} from '../Cells/CellsProvider.tsx'
import useControls from './useControls.tsx'

export default function ControlsMain() {
  const {toolType} = useControls()
  const {pencilMarks, candidates, values} = useCells()
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (/Digit\d/.test(event.code)) {
        event.preventDefault()
        values.set(event.key)
      } else if (event.code === 'Backspace') values.set('')
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  })
  return (
    <div className={classes.controlsMain}>
      {toolType.value === 'color' ? (
        <ColorKeyboard
          onInput={console.log}
          onDelete={console.log}
        />
      ) : (
        <DigitKeyboard
          toolType={toolType.value}
          onInput={value => {
            switch (toolType.value) {
              case 'normal':
                values.set(value)
                break
              case 'corner':
                pencilMarks.set(value)
                break
              case 'centre':
                candidates.set(value)
                break
            }
          }}
          onDelete={() => {
            switch (toolType.value) {
              case 'normal':
                values.set('')
                break
              case 'corner':
                pencilMarks.set('')
                break
              case 'centre':
                candidates.set('')
                break
            }
          }}
        />
      )}
      <div className={classes.controlsTool}>
        {[
          {value: 'normal', icon: <Digit/>},
          {value: 'corner', icon: <Corner/>},
          {value: 'centre', icon: <Centre/>},
          {value: 'color', icon: <Color/>}
        ].map(o => (
          <IconButton
            key={o.value}
            className={o.value === toolType.value ? classes.solid : classes.surface}
            onClick={() => toolType.set(o.value)}
          >{o.icon}</IconButton>
        ))}
      </div>
    </div>
  )
}

function DigitKeyboard({toolType, onInput, onDelete}: {
  toolType: string
  onInput: (value: string) => void
  onDelete: () => void
}) {
  const [digit, setDigit] = useState(true)
  return (
    <div className={[classes.controlsInput, classes[`tool-${toolType}`]].join(' ')}>
      {(digit
        ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'O']).map(v => (
        <button
          key={v}
          className={[classes.solid, classes.hover, classes.digit].join(' ')}
          data-key={v}
          onClick={() => onInput(v)}
        >{v}</button>
      ))}
      <button
        className={[classes.solid, classes.hover, classes.toggle].join(' ')}
        data-digit={digit}
        onClick={() => setDigit(v => !v)}
      />
      <IconButton
        className={[classes.solid, classes.hover].join(' ')}
        onClick={onDelete}
      >
        <Delete/>
      </IconButton>
    </div>
  )
}

function ColorKeyboard({onInput, onDelete}: {
  onInput: (value: string) => void
  onDelete: () => void
}) {
  const [page, setPage] = useState(0)
  const colorGroup = [
    'rgb(214 214 214)',
    'rgb(124 124 124)',
    'black',
    'rgb(179 229 106)',
    'rgb(232 124 241)',
    'rgb(228 150 50)',
    'rgb(245 58 55)',
    'rgb(252 235 63)',
    'rgb(61 153 245)',
    'rgb(204 51 17)',
    'rgb(17 119 51)',
    'rgb(0 68 196)',
    'rgb(238 153 170)',
    'rgb(255 255 25)',
    'rgb(240 70 240)',
    'rgb(160 90 30)',
    'rgb(51 187 238)',
    'rgb(145 30 180)',
    'rgb(245 58 55)',
    'rgb(76 175 80)',
    'rgb(61 153 245)',
    'rgb(249 136 134)',
    'rgb(149 208 151)',
    'rgb(158 204 250)',
    'rgb(170 12 9)',
    'rgb(47 106 49)',
    'rgb(9 89 170)'
  ].slice(page * 9, (page + 1) * 9)
  return (
    <div className={classes.controlsInput}>
      {colorGroup.map(color => (
        <button
          key={color}
          className={[classes.solid, classes.hover, classes.color].join(' ')}
          style={{color}}
          onClick={() => onInput(color)}
        />
      ))}
      <button
        className={[classes.solid, classes.hover, classes.color].join(' ')}
        style={{color: 'white'}}
        onClick={() => onInput('transparent')}
      />
      <IconButton
        className={[classes.solid, classes.hover].join(' ')}
        onClick={() => setPage(v => (v + 1) % 3)}
      >
        <svg
          viewBox="0 0 64 64"
          width="48"
          height="48"
        >
          <g
            stroke="#0003"
            strokeWidth={0.3}
            clipPath="inset(0.5rem 0.5rem 0.5rem 0.5rem round 0rem)"
          >
            <path
              color="var(--main-color)"
              d="M32.00 32.00 L46.92 0.00 L64.00 0.00 L64.00 14.26 L32.00 32.00"
            />
            <path
              color={colorGroup[0]}
              d="M32.00 32.00 L64.00 14.26 L64.00 35.93 L32.00 32.00"
            />
            <path
              color={colorGroup[1]}
              d="M32.00 32.00 L64.00 35.93 L64.00 61.84 L32.00 32.00"
            />
            <path
              color={colorGroup[2]}
              d="M32.00 32.00 L64.00 61.84 L64.00 64.00 L38.22 64.00 L32.00 32.00"
            />
            <path
              color={colorGroup[3]}
              d="M32.00 32.00 L38.22 64.00 L17.08 64.00 L32.00 32.00"
            />
            <path
              color={colorGroup[4]}
              d="M32.00 32.00 L17.08 64.00 L0.00 64.00 L0.00 49.74 L32.00 32.00"
            />
            <path
              color={colorGroup[5]}
              d="M32.00 32.00 L0.00 49.74 L0.00 28.07 L32.00 32.00"
            />
            <path
              color={colorGroup[6]}
              d="M32.00 32.00 L0.00 28.07 L0.00 2.16 L32.00 32.00"
            />
            <path
              color={colorGroup[7]}
              d="M32.00 32.00 L0.00 2.16 L0.00 0.00 L25.78 0.00 L32.00 32.00"
            />
            <path
              color={colorGroup[8]}
              d="M32.00 32.00 L25.78 0.00 L46.92 0.00 L32.00 32.00"
            />
          </g>
          <g
            stroke="white"
            strokeWidth={1}
          >
            <circle
              cx="38"
              cy="10"
              r="3"
              fill={page !== 0 ? 'none' : undefined}
            />
            <circle
              cx="46"
              cy="10"
              r="3"
              fill={page !== 1 ? 'none' : undefined}
            />
            <circle
              cx="54"
              cy="10"
              r="3"
              fill={page !== 2 ? 'none' : undefined}
            />
          </g>
        </svg>
      </IconButton>
      <IconButton
        className={[classes.solid, classes.hover].join(' ')}
        onClick={onDelete}
      >
        <Delete/>
      </IconButton>
    </div>
  )
}
