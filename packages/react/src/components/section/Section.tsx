import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { Heading } from '../heading/Heading'

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: string
  ref?: Ref<HTMLElement>
}

export function Section({ title, className, children, ...props }: SectionProps) {
  return (
    <section {...props} className={cn('flex scroll-mt-6 flex-col gap-4', className)}>
      {title ? <Heading level={2}>{title}</Heading> : null}
      {children}
    </section>
  )
}
