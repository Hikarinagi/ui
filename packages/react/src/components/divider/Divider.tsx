import { Separator } from 'radix-ui'
import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  ref?: Ref<HTMLDivElement>
}

export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
  children,
  ...props
}: DividerProps) {
  if (hasContent(children) && orientation === 'horizontal')
    return (
      <div {...props} className={cn('flex w-full items-center gap-3', className)}>
        <Separator.Root decorative className="bg-line h-px flex-1" />
        <span className="text-faint shrink-0 text-sm">{children}</span>
        <Separator.Root decorative className="bg-line h-px flex-1" />
      </div>
    )
  return (
    <Separator.Root
      {...props}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'bg-line',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className,
      )}
    />
  )
}
