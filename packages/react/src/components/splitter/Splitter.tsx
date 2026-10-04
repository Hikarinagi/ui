import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { SplitterGroup } from '../../primitives/splitter'

export interface SplitterProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
  autoSaveId?: string
  ref?: Ref<HTMLDivElement>
}

export function Splitter({
  direction = 'horizontal',
  autoSaveId,
  className,
  children,
  ...attrs
}: SplitterProps) {
  return (
    <div {...attrs} className={cn(className)}>
      <SplitterGroup direction={direction} autoSaveId={autoSaveId}>
        {children}
      </SplitterGroup>
    </div>
  )
}
