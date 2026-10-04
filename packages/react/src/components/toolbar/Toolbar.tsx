'use client'

import { useMemo } from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import { ToolbarRoot } from '../../primitives/toolbar'
import { cn } from '../../lib/cn'
import { useAccessibleName } from '../../lib/a11y'
import { useDirection } from '../stepper/hooks/useDirection'
import { ToolbarContext } from './context'
import { toolbar } from './toolbar.variants'
import type { ToolbarProps } from './types'

export function Toolbar({
  label,
  orientation = 'horizontal',
  dir,
  loop = true,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className,
  children,
  ref,
  ...attrs
}: ToolbarProps) {
  const { root, direction, rootDirection } = useDirection(dir)
  const composedRef = useComposedRefs(ref, root)
  const context = useMemo(() => ({ orientation, size, disabled }), [orientation, size, disabled])
  useAccessibleName('Toolbar', !label, attrs)

  return (
    <ToolbarContext value={context}>
      <ToolbarRoot
        asChild
        orientation={orientation}
        dir={direction}
        loop={loop}
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={cn(toolbar({ orientation, variant }), className)}
        {...attrs}
      >
        <div ref={composedRef} dir={rootDirection} data-hn-toolbar="">
          {children}
        </div>
      </ToolbarRoot>
    </ToolbarContext>
  )
}
