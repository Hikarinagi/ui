'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Center } from '@hina-ui/react'

const STAGE_WIDTH = 640
const INSET = 24

export function CategoryPreview({ children }: { children?: ReactNode }) {
  const box = useRef<HTMLElement>(null)
  const stage = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const boxEl = box.current
    const stageEl = stage.current
    if (!boxEl || !stageEl) return
    const measure = () => {
      const kids = [...stageEl.children] as HTMLElement[]
      const width = Math.max(0, ...kids.map(el => el.offsetWidth))
      const height = stageEl.offsetHeight
      setScale(
        Math.min(
          1,
          width ? (boxEl.clientWidth - INSET) / width : 1,
          height ? (boxEl.clientHeight - INSET) / height : 1,
        ),
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(boxEl)
    observer.observe(stageEl)
    measure()
    return () => observer.disconnect()
  }, [])

  return (
    <Center ref={box} className="bg-inset h-48 overflow-hidden" aria-hidden="true">
      <Center
        ref={stage}
        style={{ width: `${STAGE_WIDTH}px`, transform: `scale(${scale})` }}
        className="pointer-events-none shrink-0"
      >
        {children}
      </Center>
    </Center>
  )
}
