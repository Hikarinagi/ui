'use client'

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useAccessibleName } from '../../lib/a11y'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { Toggle as ToggleRoot } from '../../primitives/toggle-group'
import { buttonIconBox } from '../button/button.variants'
import { useFieldControl } from '../form-field/context'
import { Ripple } from '../ripple/Ripple'
import { Tooltip } from '../tooltip/Tooltip'
import { useTooltipProviderPresence } from '../tooltip/context'
import { toggle, type ToggleVariants } from './toggle.variants'

export interface ToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLElement>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'children' | 'disabled'
> {
  label?: string
  tooltip?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  variant?: Extract<ToggleVariants['variant'], 'ghost' | 'outline'>
  size?: ToggleVariants['size']
  pill?: boolean
  disabled?: boolean
  ripple?: boolean
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (value: boolean) => void
  children?: ReactNode
  renderIcon?: (props: { pressed: boolean }) => ReactNode
  pressedIcon?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Toggle({
  label,
  tooltip = true,
  side = 'top',
  variant = 'ghost',
  size,
  pill,
  disabled: disabledProp,
  ripple = true,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  renderIcon,
  pressedIcon,
  ...attrs
}: ToggleProps) {
  const [pressed = false, setPressed] = useControllableState<boolean>({
    prop: value,
    defaultProp: defaultValue ?? false,
    onChange: onValueChange,
    caller: 'Toggle',
  })
  const { id: fieldId, disabled, describedBy } = useFieldControl({ disabled: disabledProp }, attrs)
  const titled = hasContent(children)

  useAccessibleName('Toggle', !label && !titled, attrs)

  const provided = useTooltipProviderPresence()
  const swapped = pressed && hasContent(pressedIcon)

  const button = (
    <ToggleRoot
      {...attrs}
      pressed={pressed}
      onPressedChange={setPressed}
      id={fieldId}
      disabled={disabled}
      aria-describedby={describedBy}
      aria-label={label}
      data-hn-toggle=""
      className={cn(toggle({ variant, size, iconOnly: !!label && !titled, pill }), className)}
    >
      {ripple && <Ripple disabled={disabled} />}
      {renderIcon && (
        <span className={buttonIconBox({ size })}>
          <Transition
            show={swapped}
            enterActiveClass="hn-transition-base"
            enterFromClass="scale-90 opacity-0"
            leaveActiveClass="hn-transition absolute"
            leaveToClass="scale-90 opacity-0"
          >
            <span key="on" className="inline-flex items-center justify-center">
              {pressedIcon}
            </span>
          </Transition>
          <Transition
            show={!swapped}
            enterActiveClass="hn-transition-base"
            enterFromClass="scale-90 opacity-0"
            leaveActiveClass="hn-transition absolute"
            leaveToClass="scale-90 opacity-0"
          >
            <span key="off" className="inline-flex items-center justify-center">
              {renderIcon({ pressed })}
            </span>
          </Transition>
        </span>
      )}
      {titled && <span className="inline-flex items-center">{children}</span>}
    </ToggleRoot>
  )

  if (!provided) return button
  return (
    <Tooltip disabled={!tooltip || !label} content={label ?? ''} side={side}>
      {button}
    </Tooltip>
  )
}
