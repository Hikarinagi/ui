'use client'

import type { InputHTMLAttributes, KeyboardEvent, MouseEvent, Ref } from 'react'
import { X } from 'lucide-react'
import { TagsInputInput, TagsInputItem, TagsInputRoot } from '../../primitives/tags-input'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useFieldControl } from '../form-field/context'
import { focusFieldFrom } from '../../../../shared/src/lib/field-focus'
import { useUiLocale } from '../../locale'
import { InputAction } from '../input/InputAction'
import { inputActionSlot, inputHost, type InputVariants } from '../input/input.variants'
import { TagsInputChip } from './TagsInputChip'
import { tagsInputControl, tagsInputHost, tagsInputList } from './tags-input.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const XIcon = lucide(X)
const EMPTY: string[] = []

export interface TagsInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'size' | 'disabled' | 'onChange' | 'onInvalid' | 'max' | 'name'
> {
  placeholder?: string
  max?: number
  duplicate?: boolean
  delimiter?: string | RegExp
  addOnPaste?: boolean
  addOnBlur?: boolean
  clearable?: boolean
  name?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  onInvalid?: (value: string) => void
  onClear?: () => void
  ref?: Ref<HTMLInputElement>
  [attribute: `data-${string}`]: string | undefined
}

export function TagsInput({
  placeholder,
  max = 0,
  duplicate,
  delimiter = ',',
  addOnPaste = true,
  addOnBlur = false,
  clearable = false,
  name,
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  onInvalid,
  onClear,
  className,
  onKeyDownCapture,
  ...attrs
}: TagsInputProps) {
  const t = useUiLocale()
  const [modelValue, setModel] = useControllableState<string[]>({
    prop: value,
    defaultProp: defaultValue ?? EMPTY,
    onChange: onValueChange,
    caller: 'TagsInput',
  })
  const model = modelValue ?? EMPTY

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({ invalid: invalidProp, disabled: disabledProp }, attrs)

  const chipSize = size === 'sm' ? 'sm' : 'md'
  const clearing = clearable && model.length > 0 && !disabled

  function remove(tag: string) {
    if (disabled) return
    setModel(model.filter(item => item !== tag))
  }

  function clear() {
    if (!model.length) return
    setModel([])
    onClear?.()
  }

  function onInputKeydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || (event.target as HTMLInputElement).value !== '') return
    if (event.key === 'Backspace') {
      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      if (model.length) setModel(model.slice(0, -1))
    } else if (event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
    }
  }

  return (
    <div
      data-hn-tags-input=""
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={(event: MouseEvent<HTMLDivElement>) =>
        focusFieldFrom(event.currentTarget, event.target as HTMLElement)
      }
      className={cn(
        inputHost({ variant, size }),
        tagsInputHost({ size, trailing: clearing }),
        className,
      )}
    >
      <TagsInputRoot
        value={model}
        onValueChange={next => setModel(next as string[])}
        max={max}
        duplicate={duplicate}
        delimiter={delimiter}
        addOnPaste={addOnPaste}
        addOnBlur={addOnBlur}
        name={name}
        disabled={disabled}
        className={tagsInputList()}
        onInvalid={payload => onInvalid?.(String(payload))}
      >
        {model.map(tag => (
          <TagsInputItem key={tag} value={tag} asChild>
            <TagsInputChip
              tag={tag}
              size={chipSize}
              disabled={disabled}
              onRemove={() => remove(tag)}
            />
          </TagsInputItem>
        ))}
        <TagsInputInput
          {...attrs}
          onKeyDownCapture={event => {
            onInputKeydown(event)
            onKeyDownCapture?.(event)
          }}
          id={fieldId}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={tagsInputControl({ size })}
        />
      </TagsInputRoot>
      <Transition
        show={clearing}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
      >
        <span
          data-hn-tags-input-clear=""
          className={cn(inputActionSlot(), 'absolute inset-y-0 end-0')}
        >
          <InputAction
            label={t.common.clear}
            onClick={event => {
              event.stopPropagation()
              clear()
            }}
          >
            <XIcon />
          </InputAction>
        </span>
      </Transition>
    </div>
  )
}
