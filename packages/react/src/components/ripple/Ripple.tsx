'use client'

import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react'
import clsx from 'clsx'
import { createRipple } from '../../../../shared/src/behavior/ripple'
import { useComposedRefs } from '../../primitives/utils/compose-refs'

export interface RippleProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Ripple({ disabled, className, ref, ...attrs }: RippleProps) {
  const container = useRef<HTMLDivElement>(null)
  const containerRef = useComposedRefs(container, ref)
  const surface = useRef<HTMLDivElement>(null)
  const isDisabled = useRef(!!disabled)
  isDisabled.current = !!disabled
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const ripple = createRipple({
      container: () => container.current,
      surface: () => surface.current,
      disabled: () => isDisabled.current,
      onPressedChange: setPressed,
    })
    ripple.connect()
    return ripple.disconnect
  }, [])

  return (
    <div ref={containerRef} aria-hidden="true" {...attrs} className={clsx('hn-ripple', className)}>
      <div
        ref={surface}
        className="hn-ripple-surface"
        data-pressed={pressed ? '' : undefined}
      ></div>
    </div>
  )
}
