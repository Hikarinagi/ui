import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number
  ref?: Ref<HTMLDivElement>
}

export function AspectRatio({ ratio = 16 / 9, className, children, ...props }: AspectRatioProps) {
  const aspect = (1 / ratio) * 100
  return (
    <div
      {...props}
      className={cn(
        '[&_img]:size-full [&_img]:object-cover [&_video]:size-full [&_video]:object-cover',
        className,
      )}
    >
      <div
        style={{ position: 'relative', width: '100%', paddingBottom: `${aspect}%` }}
        data-radix-aspect-ratio-wrapper=""
      >
        <div style={{ position: 'absolute', inset: '0px' }}>{children}</div>
      </div>
    </div>
  )
}
