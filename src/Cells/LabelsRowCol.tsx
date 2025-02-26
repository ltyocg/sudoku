import {CELL_SIDE_LENGTH, TEXT_OFFSET} from '../Constants.ts'

export default function LabelsRowCol() {
  return (
    <g>
      {Array.from({length: 9}, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)).map((value, index) => (
        <text
          key={value}
          x={-15}
          y={TEXT_OFFSET.Y + index * CELL_SIDE_LENGTH}
        >{value}</text>
      ))}
      {Array.from({length: 9}, (_, i) => i + 1).map((value, index) => (
        <text
          key={value}
          x={TEXT_OFFSET.X + index * CELL_SIDE_LENGTH}
          y={-15}
        >{value}</text>
      ))}
    </g>
  )
}