import { cn } from '@hina-ui/react'
import { wordmarkSvg } from './wordmark-svg'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Hina UI"
      className={cn('text-fg inline-flex items-baseline gap-1', className)}
    >
      <span
        className="h-5 [&>svg]:h-full [&>svg]:w-auto"
        dangerouslySetInnerHTML={{ __html: wordmarkSvg }}
      />
      <span className="-translate-y-[0.045em] text-lg leading-none font-semibold tracking-tight">
        UI
      </span>
    </span>
  )
}
