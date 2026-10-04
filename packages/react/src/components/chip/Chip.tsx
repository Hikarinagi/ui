'use client'

import { useEffect } from 'react'
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { devWarn } from '../../lib/dev'
import { hasContent } from '../../lib/content'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { useUiLocale } from '../../locale'
import { Ripple } from '../ripple/Ripple'
import { CloseButton } from '../close-button/CloseButton'
import { IconSlot } from './IconSlot'
import { chip, chipRemove, type ChipVariants } from './chip.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface ChipProps
  extends
    PrimitiveProps,
    HTMLAttributes<HTMLElement>,
    Pick<AnchorHTMLAttributes<HTMLElement>, 'href' | 'target' | 'rel' | 'download'> {
  variant?: ChipVariants['variant']
  tone?: ChipVariants['tone']
  size?: ChipVariants['size']
  selectable?: boolean
  removable?: boolean
  disabled?: boolean
  ripple?: boolean
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  onRemove?: () => void
  icon?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Chip({
  as,
  asChild,
  variant,
  tone,
  size,
  selectable,
  removable: removableProp,
  disabled,
  ripple = true,
  selected: selectedProp,
  defaultSelected = false,
  onSelectedChange,
  onRemove,
  icon,
  className,
  children,
  onClick,
  onClickCapture,
  ...attrs
}: ChipProps) {
  const t = useUiLocale()
  const [selected, setSelected] = useControllableState({
    prop: selectedProp,
    defaultProp: defaultSelected,
    onChange: onSelectedChange,
    caller: 'Chip',
  })

  const conflict = !!selectable && !!removableProp
  useEffect(() => {
    if (conflict) devWarn('Chip', 'selectable 与 removable 不能同时使用，removable 已忽略')
  }, [conflict])

  const tag = as ?? (selectable ? 'button' : 'span')
  const nativeButton = tag === 'button' && !asChild
  const interactive = !!selectable || tag === 'button' || tag === 'a' || !!asChild
  const rootAttrs = nativeButton
    ? { type: 'button' as const, disabled }
    : interactive && disabled
      ? { 'data-disabled': '', 'aria-disabled': 'true' as const, tabIndex: -1 }
      : disabled
        ? { 'data-disabled': '' }
        : undefined
  const removable = !!removableProp && !selectable
  const showCheck = !!selectable && selected
  const hasIcon = hasContent(icon)

  function guard(event: MouseEvent<HTMLElement>) {
    if (disabled) {
      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      return
    }
    onClickCapture?.(event)
  }

  function toggle(event: MouseEvent<HTMLElement>) {
    if (selectable) setSelected(!selected)
    onClick?.(event)
  }

  function onRemoveKeydown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return
    event.preventDefault()
    onRemove?.()
  }

  return (
    <Primitive
      as={tag}
      data-hn-chip=""
      asChild={asChild}
      {...rootAttrs}
      aria-pressed={selectable ? selected : undefined}
      data-state={showCheck ? 'selected' : undefined}
      {...attrs}
      className={cn(
        chip({
          variant,
          tone,
          size,
          interactive,
          selected: showCheck,
          disabled,
        }),
        className,
      )}
      onClickCapture={guard}
      onClick={toggle}
    >
      {asChild ? (
        children
      ) : (
        <>
          {interactive && ripple && <Ripple disabled={disabled} />}
          {(selectable || hasIcon) && (
            <IconSlot size={size} checked={showCheck} icon={hasIcon}>
              {icon}
            </IconSlot>
          )}
          {children}
          {removable && (
            <CloseButton
              size="xs"
              label={t.chip.remove}
              disabled={disabled}
              className={chipRemove({ size })}
              onClick={event => {
                event.stopPropagation()
                onRemove?.()
              }}
              onKeyDown={onRemoveKeydown}
            />
          )}
        </>
      )}
    </Primitive>
  )
}
