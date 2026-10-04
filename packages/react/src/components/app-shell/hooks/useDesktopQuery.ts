'use client'

import { useEffect, useState } from 'react'

export function useDesktopQuery(query = '(min-width: 64rem)') {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setIsDesktop(media.matches)
    media.addEventListener('change', onChange)
    onChange()
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return isDesktop
}
