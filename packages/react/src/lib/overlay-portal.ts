'use client'

import { useState } from 'react'

export function useOverlayPortal(open: boolean | undefined) {
  const [content, setContent] = useState<HTMLElement | null>(null)
  return { contentRef: setContent, content, present: !!open || !!content }
}
