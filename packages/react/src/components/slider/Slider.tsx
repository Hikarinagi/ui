'use client'

import { useMemo, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useDirection } from '../../lib/useDirection'
import { useUiLocale } from '../../locale'
import { SliderRoot, SliderTrack } from '../../primitives/slider'
import { useFieldControl } from '../form-field/context'
import { useSliderChrome } from './hooks/useSliderChrome'
import { SliderHandle } from './SliderHandle'
import { SliderMarks } from './SliderMarks'
import {
  slider,
  sliderRange,
  sliderRoot,
  sliderTrack,
  type SliderVariants,
} from './slider.variants'

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  min?: number
  max?: number
  step?: number
  dir?: 'ltr' | 'rtl'
  marks?: Array<{ value: number; label?: string }>
  label?: 'auto' | 'always' | 'none'
  format?: (value: number) => string
  size?: SliderVariants['size']
  disabled?: boolean
  value?: number
  defaultValue?: number
  onValueChange?: (value: number | undefined) => void
  onCommit?: (value: number) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  dir,
  marks,
  label = 'auto',
  format,
  size,
  disabled: disabledProp,
  value,
  defaultValue,
  onValueChange,
  onCommit,
  className,
  ...attrs
}: SliderProps) {
  const [model, setModel] = useControllableState<number | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'Slider',
  })
  const { root, direction, rootDirection } = useDirection<HTMLSpanElement>(dir)
  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { disabled: disabledProp },
    attrs,
  )
  const { dragging, ring, labelOpen, onPointerDown, listeners } = useSliderChrome(disabled, label)

  const current = model ?? min
  const values = useMemo(() => [current], [current])
  const text = format ? format(current) : new Intl.NumberFormat(t.tag).format(current)
  const hasMarkLabels = !!marks?.some(mark => mark.label)
  const span = max - min
  const p = span > 0 ? (current - min) / span : 0

  return (
    <span
      ref={root}
      data-hn-slider=""
      data-hn-state-group=""
      dir={rootDirection}
      data-disabled={disabled ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      style={{ '--hn-slider-p': String(p) } as CSSProperties}
      className={cn(slider({ size }), className)}
      onPointerDownCapture={onPointerDown}
      {...listeners}
    >
      <SliderRoot
        dir={direction}
        value={values}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={sliderRoot()}
        onValueChange={next => setModel(next?.[0])}
        onValueCommit={next => onCommit?.(next[0]!)}
      >
        <SliderTrack className={sliderTrack()}>
          <span className={sliderRange()} />
        </SliderTrack>
        {!!marks?.length && <SliderMarks marks={marks} min={min} max={max} />}
        <SliderHandle
          {...attrs}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          text={text}
          open={labelOpen}
          ring={ring}
          tooltip={label !== 'none'}
        />
      </SliderRoot>
      {hasMarkLabels && <SliderMarks marks={marks!} min={min} max={max} labels />}
    </span>
  )
}
