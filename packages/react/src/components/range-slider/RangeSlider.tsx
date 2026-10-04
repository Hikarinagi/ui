'use client'

import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { composeEventHandlers, useComposedRefs, useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useDirection } from '../../lib/useDirection'
import { useUiLocale } from '../../locale'
import { SliderRoot, SliderTrack } from '../../primitives/slider'
import { useFieldControl } from '../form-field/context'
import { useSliderChrome } from '../slider/hooks/useSliderChrome'
import { SliderHandle } from '../slider/SliderHandle'
import { SliderMarks } from '../slider/SliderMarks'
import {
  slider,
  sliderRangeBetween,
  sliderRoot,
  sliderTrack,
  type SliderVariants,
} from '../slider/slider.variants'

const both = { checkForDefaultPrevented: false }

export interface RangeSliderProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  min?: number
  max?: number
  step?: number
  dir?: 'ltr' | 'rtl'
  minSteps?: number
  marks?: Array<{ value: number; label?: string }>
  label?: 'auto' | 'always' | 'none'
  format?: (value: number) => string
  size?: SliderVariants['size']
  disabled?: boolean
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
  onCommit?: (value: [number, number]) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  dir,
  minSteps = 0,
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
  style,
  ref,
  ...attrs
}: RangeSliderProps) {
  const [model, setModel] = useControllableState<[number, number] | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: [number, number] | undefined) => void) | undefined,
    caller: 'RangeSlider',
  })
  const { root, direction, rootDirection } = useDirection<HTMLSpanElement>(dir)
  const composedRef = useComposedRefs(root, ref)
  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { disabled: disabledProp },
    attrs,
  )
  const { dragging, ring, labelOpen, onPointerDown, listeners } = useSliderChrome(disabled, label)

  const values: [number, number] = model ?? [min, max]
  const hasMarkLabels = !!marks?.some(mark => mark.label)

  function fraction(next: number) {
    const span = max - min
    return span > 0 ? (next - min) / span : 0
  }

  function text(next: number) {
    return format ? format(next) : new Intl.NumberFormat(t.tag).format(next)
  }

  return (
    <span
      ref={composedRef}
      data-hn-range-slider=""
      data-hn-state-group=""
      role="group"
      {...attrs}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      dir={rootDirection}
      data-disabled={disabled ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      style={
        {
          ...style,
          '--hn-slider-p': String(fraction(values[0])),
          '--hn-slider-q': String(fraction(values[1])),
        } as CSSProperties
      }
      className={cn(slider({ size }), className)}
      onPointerDownCapture={composeEventHandlers(attrs.onPointerDownCapture, onPointerDown, both)}
      onKeyDown={composeEventHandlers(attrs.onKeyDown, listeners.onKeyDown, both)}
      onFocus={composeEventHandlers(attrs.onFocus, listeners.onFocus, both)}
      onBlur={composeEventHandlers(attrs.onBlur, listeners.onBlur, both)}
      onPointerEnter={composeEventHandlers(attrs.onPointerEnter, listeners.onPointerEnter, both)}
      onPointerLeave={composeEventHandlers(attrs.onPointerLeave, listeners.onPointerLeave, both)}
    >
      <SliderRoot
        dir={direction}
        value={values}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minSteps}
        disabled={disabled}
        className={sliderRoot()}
        onValueChange={next => setModel([next[0]!, next[1]!])}
        onValueCommit={next => onCommit?.([next[0]!, next[1]!])}
      >
        <SliderTrack className={sliderTrack()}>
          <span className={sliderRangeBetween()} />
        </SliderTrack>
        {!!marks?.length && <SliderMarks marks={marks} min={min} max={max} />}
        <SliderHandle
          aria-label={t.slider.minimum}
          style={{ '--hn-slider-p': String(fraction(values[0])) } as CSSProperties}
          text={text(values[0])}
          open={labelOpen}
          ring={ring}
          tooltip={label !== 'none'}
        />
        <SliderHandle
          aria-label={t.slider.maximum}
          style={{ '--hn-slider-p': String(fraction(values[1])) } as CSSProperties}
          text={text(values[1])}
          open={labelOpen}
          ring={ring}
          tooltip={label !== 'none'}
        />
      </SliderRoot>
      {hasMarkLabels && <SliderMarks marks={marks!} min={min} max={max} labels />}
    </span>
  )
}
