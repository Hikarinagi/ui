'use client'

import { useEffect, useState } from 'react'

export function usePaginationPageTooltip(label: HTMLElement | null, blocked: boolean) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!label) {
      setContent('')
      return
    }
    const measure = () => {
      setContent(label.scrollWidth > label.clientWidth ? (label.textContent?.trim() ?? '') : '')
    }
    const resize = new ResizeObserver(measure)
    resize.observe(label)
    const mutation = new MutationObserver(measure)
    mutation.observe(label, { childList: true, characterData: true, subtree: true })
    const fonts = label.ownerDocument.fonts
    fonts?.addEventListener('loadingdone', measure)
    return () => {
      resize.disconnect()
      mutation.disconnect()
      fonts?.removeEventListener('loadingdone', measure)
    }
  }, [label])

  return blocked ? false : content
}
