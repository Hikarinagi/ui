import { useId, type HTMLAttributes, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { Heading } from '../heading/Heading'

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: string
  ref?: Ref<HTMLElement>
}

export function Section({ title, className, children, ...props }: SectionProps) {
  const headingId = useId()
  const labelledBy =
    props['aria-labelledby'] ?? (title && !props['aria-label'] ? headingId : undefined)
  return (
    <section
      {...props}
      aria-labelledby={labelledBy}
      className={cn('flex scroll-mt-6 flex-col gap-4', className)}
    >
      {title ? (
        <Heading id={headingId} level={2}>
          {title}
        </Heading>
      ) : null}
      {children}
    </section>
  )
}
