'use client'

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

export function useFileDrop(disabled: boolean, onFiles: (files: File[]) => void) {
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)

  function onDragEnter(event: DragEvent) {
    if (disabled) return
    event.preventDefault()
    depth.current += 1
    setDragging(true)
  }

  function onDragOver(event: DragEvent) {
    if (disabled) return
    event.preventDefault()
  }

  function onDragLeave() {
    if (disabled) return
    depth.current = Math.max(depth.current - 1, 0)
    if (depth.current === 0) setDragging(false)
  }

  function onDrop(event: DragEvent) {
    if (disabled) return
    event.preventDefault()
    depth.current = 0
    setDragging(false)
    const files = Array.from(event.dataTransfer?.files ?? [])
    if (files.length) onFiles(files)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (files.length) onFiles(files)
  }

  return { dragging, onDragEnter, onDragOver, onDragLeave, onDrop, onChange }
}
