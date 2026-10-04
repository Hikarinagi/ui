'use client'

import { useMemo, useState } from 'react'

export function useClearTransition(visible: boolean) {
  const [leaving, setLeaving] = useState(false)
  const hooks = useMemo(() => {
    const finishLeave = () => setLeaving(false)
    return {
      onBeforeEnter(element: HTMLElement) {
        setLeaving(false)
        element.removeAttribute('inert')
      },
      onBeforeLeave(element: HTMLElement) {
        setLeaving(true)
        element.setAttribute('inert', '')
      },
      onAfterLeave: finishLeave,
      onLeaveCancelled: finishLeave,
    }
  }, [])
  return { reserved: visible || leaving, hooks }
}
