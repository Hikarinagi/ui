'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function useObjectUrls(files: File[], enabled: boolean) {
  const [urls, setUrls] = useState(() => new Map<File, string>())
  const current = useRef(urls)

  useLayoutEffect(() => {
    const supported = typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    const previous = current.current
    if (!enabled || !supported) {
      if (previous.size) {
        for (const url of previous.values()) URL.revokeObjectURL(url)
        current.current = new Map()
        setUrls(current.current)
      }
      return
    }
    const next = new Map<File, string>()
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      next.set(file, previous.get(file) ?? URL.createObjectURL(file))
    }
    for (const [file, url] of previous) if (!next.has(file)) URL.revokeObjectURL(url)
    const same =
      next.size === previous.size && [...next].every(([file, url]) => previous.get(file) === url)
    if (same) return
    current.current = next
    setUrls(next)
  }, [files, enabled])

  useEffect(
    () => () => {
      for (const url of current.current.values()) URL.revokeObjectURL(url)
      current.current = new Map()
    },
    [],
  )

  return { urls }
}
