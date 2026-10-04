'use client'

import { useImperativeHandle, type CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { affix as affixVariants } from './affix.variants'
import { useAffix } from './hooks/useAffix'
import type { AffixProps } from './types'

export function Affix({
  as = 'div',
  position = 'top',
  offset: offsetProp = 0,
  disabled = false,
  onChange,
  className,
  style,
  children,
  ref,
  ...attrs
}: AffixProps) {
  const { element, affixed, offset, affix } = useAffix(
    { as, position, offset: offsetProp, disabled },
    value => onChange?.(value),
  )

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return element.current ?? undefined
      },
      get affixed() {
        return affix.affixed
      },
      update: affix.update,
    }),
    [affix, element],
  )

  const Tag = as
  return (
    <Tag
      data-hn-affix=""
      data-position={position}
      data-affixed={affixed ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...attrs}
      ref={element}
      className={cn(affixVariants({ position, disabled }), className)}
      style={{ '--hn-affix-offset': `${offset}px`, ...style } as CSSProperties}
    >
      {typeof children === 'function' ? children({ affixed }) : children}
    </Tag>
  )
}
