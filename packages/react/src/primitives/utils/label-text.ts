'use client'

import { useLayoutEffect, useState } from 'react'
import { getLabelText } from '../../../../shared/src/primitives/label'

export function useLabelText(
  id: string | undefined,
  element: Element | null | undefined,
  skip?: unknown,
) {
  const [text, setText] = useState<string | undefined>(undefined)
  useLayoutEffect(() => {
    setText(skip ? undefined : getLabelText(id, element))
  }, [id, element, skip])
  return text
}
