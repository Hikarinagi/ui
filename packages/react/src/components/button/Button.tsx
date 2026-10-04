'use client'

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useAccessibleName } from '../../lib/a11y'
import { hasContent } from '../../lib/content'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { Transition } from '../../lib/transition/Transition'
import { button, buttonIconBox, type ButtonVariants } from './button.variants'
import { IconSlot } from './IconSlot'
import { Ripple } from '../ripple/Ripple'
import { Spinner } from '../spinner/Spinner'

export interface ButtonProps
  extends
    PrimitiveProps,
    Omit<ButtonHTMLAttributes<HTMLElement>, 'type' | 'disabled'>,
    Pick<AnchorHTMLAttributes<HTMLElement>, 'href' | 'target' | 'rel' | 'download'> {
  variant?: ButtonVariants['variant']
  tone?: ButtonVariants['tone']
  size?: ButtonVariants['size']
  type?: 'button' | 'submit' | 'reset'
  iconOnly?: boolean
  block?: boolean
  pill?: boolean
  loading?: boolean
  disabled?: boolean
  ripple?: boolean
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Button({
  as = 'button',
  asChild,
  variant,
  tone,
  size,
  type = 'button',
  iconOnly,
  block,
  pill,
  loading,
  disabled,
  ripple = true,
  icon,
  trailing,
  className,
  children,
  onClickCapture,
  ...attrs
}: ButtonProps) {
  useAccessibleName('Button', !!iconOnly, attrs)

  const isDisabled = !!disabled || !!loading
  const isNativeButton = as === 'button' && !asChild
  const spinnerAt = hasContent(icon) ? 'icon' : hasContent(trailing) ? 'trailing' : 'center'
  const withRipple = ripple && variant !== 'link'
  const spinnerSize = size === 'lg' ? 'md' : 'sm'
  const iconBox = buttonIconBox({ size })

  const nativeAttrs = isNativeButton
    ? { type, disabled: isDisabled }
    : isDisabled
      ? { 'data-disabled': '', 'aria-disabled': true, tabIndex: -1 }
      : undefined

  function guard(event: MouseEvent<HTMLElement>) {
    if (isDisabled) {
      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      return
    }
    onClickCapture?.(event)
  }

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...nativeAttrs}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      {...attrs}
      className={cn(button({ variant, tone, size, iconOnly, block, pill }), className)}
      onClickCapture={guard}
    >
      {asChild ? (
        children
      ) : (
        <>
          {withRipple && <Ripple disabled={isDisabled} />}
          {hasContent(icon) && (
            <IconSlot
              boxClass={iconBox}
              swapped={!!loading && spinnerAt === 'icon'}
              spinnerSize={spinnerSize}
            >
              {icon}
            </IconSlot>
          )}
          {hasContent(children) && (
            <span
              className={`hn-transition inline-flex items-center gap-[var(--hn-control-gap)] ${loading && spinnerAt === 'center' ? 'opacity-0' : 'opacity-100'}`}
            >
              {children}
            </span>
          )}
          {hasContent(trailing) && (
            <IconSlot
              boxClass={iconBox}
              swapped={!!loading && spinnerAt === 'trailing'}
              spinnerSize={spinnerSize}
            >
              {trailing}
            </IconSlot>
          )}
          <Transition
            show={!!loading && spinnerAt === 'center'}
            enterActiveClass="hn-transition-base"
            enterFromClass="opacity-0"
            leaveActiveClass="hn-transition"
            leaveToClass="opacity-0"
          >
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <Spinner size={spinnerSize} />
            </span>
          </Transition>
        </>
      )}
    </Primitive>
  )
}
