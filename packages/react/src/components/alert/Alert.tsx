'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useCollapseHooks } from '../../lib/collapse'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { CloseButton } from '../close-button/CloseButton'
import { callout, calloutIcon, type CalloutVariants } from '../callout/callout.variants'
import { calloutIcons } from '../callout/icons'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutVariants['tone']
  title?: string
  icon?: ReactNode
  closable?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  actions?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Alert({
  tone = 'neutral',
  title,
  icon = true,
  closable,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onClose,
  actions,
  className,
  children,
  ...attrs
}: AlertProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'Alert',
  })
  const hooks = useCollapseHooks()
  const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status'
  const Icon = calloutIcons[tone]

  function close() {
    setOpen(false)
    onClose?.()
  }

  return (
    <Transition
      show={open}
      enterFromClass="hn-collapse-closed"
      enterToClass="hn-collapse-open"
      leaveFromClass="hn-collapse-open"
      leaveToClass="hn-collapse-closed"
      {...hooks}
    >
      <div data-hn-alert="" className="hn-collapse" {...attrs}>
        <div className="hn-collapse-body">
          <div role={role} className={cn(callout({ tone }), className)}>
            {icon === true ? <Icon className={calloutIcon({ tone })} aria-hidden="true" /> : icon}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {title ? <p className="text-fg font-medium">{title}</p> : null}
              {children}
            </div>
            {hasContent(actions) && (
              <div className="flex shrink-0 items-center gap-2 self-center">{actions}</div>
            )}
            {closable && <CloseButton size="sm" className="-my-0.5 -me-1" onClick={close} />}
          </div>
        </div>
      </div>
    </Transition>
  )
}
