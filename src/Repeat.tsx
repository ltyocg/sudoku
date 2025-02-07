import {Fragment, type ReactNode} from 'react'

export default function Repeat({length, children}: {
  length: number
  children: (index: number) => ReactNode
}) {
  return Array.from({length})
    .map((_, index) => <Fragment key={index}>{children(index)}</Fragment>)
}