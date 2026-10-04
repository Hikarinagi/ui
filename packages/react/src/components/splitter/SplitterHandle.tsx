'use client'

import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { SplitterResizeHandle, type SplitterResizeHandleProps } from '../../primitives/splitter'

export interface SplitterHandleProps extends Omit<SplitterResizeHandleProps, 'children'> {
  label?: string
}

export function SplitterHandle({ label, className, ...attrs }: SplitterHandleProps) {
  const t = useUiLocale()
  return (
    <SplitterResizeHandle
      aria-label={label ?? t.splitter.handleLabel}
      {...attrs}
      className={cn(
        'hn-focus-ring group/handle relative flex shrink-0 items-center justify-center',
        'data-[orientation=horizontal]:w-2 data-[orientation=vertical]:h-2',
        className,
      )}
    >
      <div className="border-line group-hover/handle:border-line-strong group-data-[resize-handle-state=drag]/handle:border-line-strong group-data-[orientation=horizontal]/handle:h-full group-data-[orientation=horizontal]/handle:border-s group-data-[orientation=vertical]/handle:w-full group-data-[orientation=vertical]/handle:border-t" />
    </SplitterResizeHandle>
  )
}
