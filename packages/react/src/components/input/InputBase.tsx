'use client'

import {
  useImperativeHandle,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { focusFieldFrom } from '../../../../shared/src/lib/field-focus'
import { useUiLocale } from '../../locale'
import { IconSlot } from '../button/IconSlot'
import { Spinner } from '../spinner/Spinner'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import { InputAction } from './InputAction'
import { useModelText } from './hooks/useModelText'
import {
  inputActionSlot,
  inputAdornment,
  inputControl,
  inputEmbedded,
  textInputHost,
  type TextInputVariants,
} from './input.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const XIcon = lucide(X)

export interface InputHandle {
  clear: () => void
  focus: () => void
}

export interface InputBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'disabled'
> {
  variant?: TextInputVariants['variant']
  size?: TextInputVariants['size']
  clearable?: boolean
  loading?: boolean
  disabled?: boolean
  invalid?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
  leading?: ReactNode
  trailing?: ReactNode
  action?: ReactNode
  ref?: Ref<InputHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function InputBase({
  variant,
  size: sizeProp,
  clearable,
  loading,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  onClear,
  leading,
  trailing,
  action,
  className,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...attrs
}: InputBaseProps) {
  const t = useUiLocale()
  const group = useInputGroup()
  const [model, setModel] = useControllableState<string | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    caller: 'Input',
  })
  const { element, bindings } = useModelText<HTMLInputElement>(model, next => setModel(next), {
    onChange,
    onCompositionStart,
    onCompositionEnd,
  })

  const size = group ? group.size : sizeProp
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )
  const hasLeading = hasContent(leading)
  const hasTrailing = hasContent(trailing)
  const clearing = !!clearable && !!model && !disabled
  const trailingSpinner = !!loading && !hasLeading
  const spinnerSize = size === 'lg' ? 'md' : 'sm'

  function clear() {
    if (!model) return
    setModel('')
    onClear?.()
    element.current?.focus()
  }

  useImperativeHandle(ref, () => ({ clear, focus: () => element.current?.focus() }))

  function onRootClick(event: MouseEvent<HTMLDivElement>) {
    focusFieldFrom(event.currentTarget, event.target as HTMLElement)
  }

  return (
    <div
      data-hn-input=""
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      aria-busy={loading || undefined}
      className={cn(
        group ? inputEmbedded() : textInputHost({ variant, size: sizeProp }),
        className,
      )}
      onClick={onRootClick}
    >
      {hasLeading && (
        <span className={inputAdornment()}>
          <IconSlot
            boxClass="relative inline-flex items-center justify-center"
            swapped={!!loading}
            spinnerSize={spinnerSize}
          >
            {leading}
          </IconSlot>
        </span>
      )}
      <input
        ref={element}
        {...attrs}
        {...bindings}
        id={fieldId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={inputControl({
          leading: hasLeading,
          trailing: clearing || trailingSpinner || hasTrailing,
        })}
      />
      <Transition
        show={trailingSpinner}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
      >
        <span className={inputAdornment()}>
          <Spinner size={spinnerSize} />
        </span>
      </Transition>
      <Transition
        show={clearing}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
      >
        <span className={inputActionSlot()}>
          <InputAction label={t.common.clear} onClick={clear}>
            <XIcon />
          </InputAction>
        </span>
      </Transition>
      {action}
      {hasTrailing && <span className={inputAdornment()}>{trailing}</span>}
    </div>
  )
}
