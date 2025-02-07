import classes from './Grid.module.css'

const edge = 64
export default function Grid() {
  return (
    <g className={classes.grid}>
      <Thin/>
      <Thick/>
    </g>
  )
}

function Thin() {
  const array = Array.from({length: 10}).map((_, index) => index)
  return (
    <path
      stroke="black"
      d={[
        ...array.map(i => `M0 ${edge * i} L${edge * 9} ${edge * i}`),
        ...array.map(i => `M${edge * i} 0 L${edge * i} ${edge * 9}`),
        'Z'
      ].join(' ')}
    />
  )
}

function Thick() {
  const strokeWidth = 3
  const width = strokeWidth / 2
  const array = Array.from({length: 4}).map((_, index) => index * 3)
  return (
    <path
      stroke="rgba(0 0 0 / 1)"
      strokeWidth={strokeWidth}
      d={[
        ...array.map(i => `M${-width} ${edge * i} L${edge * 9 + width} ${edge * i}`),
        ...array.map(i => `M${edge * i} ${-width} L${edge * i} ${edge * 9 + width}`),
        'Z'
      ].join(' ')}
    />
  )
}