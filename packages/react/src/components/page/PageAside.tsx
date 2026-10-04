'use client'

import { useId, type HTMLAttributes, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { Text } from '../text/Text'

export interface PageAsideProps extends HTMLAttributes<HTMLElement> {
  label?: string
  ref?: Ref<HTMLElement>
}

export function PageAside({ label, className, children, ...attrs }: PageAsideProps) {
  const titleId = useId()
  return (
    <aside
      aria-labelledby={label ? titleId : undefined}
      {...attrs}
      className={cn('hidden w-56 shrink-0 xl:block', className)}
    >
      <div className="sticky top-8 flex flex-col gap-3">
        {label ? (
          <Text id={titleId} as="h2" size="sm" tone="muted" weight="medium">
            {label}
          </Text>
        ) : null}
        {children}
      </div>
    </aside>
  )
}
