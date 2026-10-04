'use client'

import { Check, Copy } from 'lucide-react'
import type { HTMLAttributes, MouseEvent, ReactElement, Ref } from 'react'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { IconButton } from '../icon-button/IconButton'
import type { ButtonVariants } from '../button/button.variants'
import { useCopy, COPIED_RESET_MS } from './hooks/useCopy'

const CheckIcon = lucide(Check)
const CopyIcon = lucide(Copy)

export interface CopyButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  text: string
  label?: string
  size?: ButtonVariants['size']
  timeout?: number
  disabled?: boolean
  tooltip?: boolean
  onCopied?: (text: string) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

type TransitionChild = ReactElement<{ ref?: Ref<HTMLElement> }>

export function CopyButton({
  text,
  label,
  size = 'sm',
  timeout = COPIED_RESET_MS,
  disabled = false,
  tooltip = false,
  onCopied,
  className,
  onClick,
  ...attrs
}: CopyButtonProps) {
  const t = useUiLocale()
  const { copied, copy } = useCopy(
    () => text,
    value => onCopied?.(value),
    () => timeout,
  )

  function handleClick(event: MouseEvent<HTMLElement>) {
    onClick?.(event)
    void copy()
  }

  const transition = {
    enterActiveClass: 'hn-transition-base',
    enterFromClass: 'scale-90 opacity-0',
    leaveActiveClass: 'hn-transition',
    leaveToClass: 'scale-90 opacity-0',
  }
  const check = (
    <Transition key="check" show={copied} {...transition}>
      {(<CheckIcon className="text-success-text absolute inset-0" />) as TransitionChild}
    </Transition>
  )
  const idle = (
    <Transition key="copy" show={!copied} {...transition}>
      {(<CopyIcon className="absolute inset-0" />) as TransitionChild}
    </Transition>
  )

  return (
    <IconButton
      {...attrs}
      label={copied ? t.common.copied : (label ?? t.common.copy)}
      tooltip={tooltip}
      size={size}
      disabled={disabled}
      className={className}
      onClick={handleClick}
    >
      <span className="relative inline-flex size-[1em]">
        {copied ? [idle, check] : [check, idle]}
      </span>
    </IconButton>
  )
}
