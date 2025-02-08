import type {MouseEvent} from 'react'

export function initCellArray<T>(initialValue: () => T) {
  return repeat(() => repeat(() => initialValue()))

  function repeat<R>(mapfn: () => R) {
    return Array.from({length: 9}, mapfn)
  }
}

export function arrayMap<T, R>(array: T[][], callback: (value: T, x: number, y: number) => R) {
  return array.map((row, y) => row.map((value, x) => callback(value, x, y)))
}

export function ctrlKey(event: MouseEvent<HTMLDivElement> | KeyboardEvent) {
  return navigator.userAgent.includes('Mac') ? event.metaKey : event.ctrlKey
}