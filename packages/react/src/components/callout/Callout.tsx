import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { callout, calloutIcon, type CalloutVariants } from './callout.variants'
import { calloutIcons } from './icons'

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutVariants['tone']
  title?: string
  icon?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Callout({
  tone = 'neutral',
  title,
  icon = true,
  className,
  children,
  ...attrs
}: CalloutProps) {
  const Icon = calloutIcons[tone]
  return (
    <div role="note" {...attrs} className={cn(callout({ tone }), className)}>
      {icon === true ? <Icon className={calloutIcon({ tone })} aria-hidden="true" /> : icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? <p className="text-fg font-medium">{title}</p> : null}
        {children}
      </div>
    </div>
  )
}
