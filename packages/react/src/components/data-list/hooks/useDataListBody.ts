'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import type { DataListOptions } from '../types'

const length = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)

export function useDataListBody<T>(props: DataListOptions<T>) {
  const body = useRef<HTMLDivElement>(null)
  const lastHeight = useRef(0)
  const latest = useRef(props)
  latest.current = props

  useEffect(() => {
    const element = body.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry && !latest.current.loading && latest.current.items.length)
        lastHeight.current = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  let style: CSSProperties
  if (props.height !== undefined || props.virtualize)
    style = { height: length(props.height ?? 320) }
  else {
    const minimum = length(props.minHeight ?? 160)
    style = {
      minHeight:
        props.loading && lastHeight.current ? `max(${minimum}, ${lastHeight.current}px)` : minimum,
    }
  }
  return { body, style }
}
