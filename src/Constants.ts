export const CELL_SIDE_LENGTH = 64
export const TEXT_OFFSET = {X: 32, Y: 35.8}
export const PLACEMENT = {
  TOP_LEFT: 1,
  TOP: 1 << 1,
  TOP_RIGHT: 1 << 2,
  RIGHT: 1 << 3,
  BOTTOM_RIGHT: 1 << 4,
  BOTTOM: 1 << 5,
  BOTTOM_LEFT: 1 << 6,
  LEFT: 1 << 7
} as const