export function initCellArray<T>(defaultValue: T) {
  return repeat(() => repeat(() => defaultValue))

  function repeat<R>(mapfn: () => R) {
    return Array.from({length: 9}, mapfn)
  }
}