'use client'

import {
  useImperativeHandle,
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useFieldControl } from '../form-field/context'
import { useModelText } from '../input/hooks/useModelText'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { useTextareaSizing } from './hooks/useTextareaSizing'
import { textarea, textareaField, type TextareaVariants } from './textarea.variants'

export interface TextareaHandle {
  input: HTMLTextAreaElement | null
  focus: () => void
}

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'disabled' | 'rows'
> {
  variant?: TextareaVariants['variant']
  size?: TextareaVariants['size']
  rows?: number
  autosize?: boolean | { minRows?: number; maxRows?: number }
  resize?: TextareaVariants['resize']
  disabled?: boolean
  invalid?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ref?: Ref<TextareaHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function Textarea({
  variant,
  size,
  rows = 3,
  autosize,
  resize,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  className,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...attrs
}: TextareaProps) {
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({ invalid: invalidProp, disabled: disabledProp }, attrs)

  const [model, setModel] = useControllableState<string | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    caller: 'Textarea',
  })

  const { element, bindings } = useModelText<HTMLTextAreaElement>(model, next => setModel(next), {
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event)
      fit()
    },
    onCompositionStart,
    onCompositionEnd,
  })

  const { area, bounds, fit, focus } = useTextareaSizing(
    { autosize, rows, size, variant },
    model,
    element,
  )

  useImperativeHandle(ref, () => ({
    get input() {
      return element.current
    },
    focus: () => element.current?.focus({ preventScroll: true }),
  }))

  const style = {
    '--hn-textarea-rows': bounds.min,
    '--hn-textarea-max-rows': bounds.max,
  } as CSSProperties

  return (
    <div
      data-hn-textarea=""
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      style={style}
      className={cn(
        textarea({
          variant,
          size,
          autosize: Boolean(autosize),
          resize: autosize ? 'none' : resize,
        }),
        className,
      )}
      onClick={(event: MouseEvent) => focus(event)}
    >
      <ScrollArea ref={area} shadow={false} className="min-h-0 grow">
        <textarea
          ref={element}
          {...attrs}
          {...bindings}
          id={fieldId}
          rows={bounds.min}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={textareaField()}
        />
      </ScrollArea>
    </div>
  )
}
