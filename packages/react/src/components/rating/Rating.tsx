'use client'

import { useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { radixRatingStepStyle } from '../../lib/radix/styles'
import { starFill } from '../../../../shared/src/lib/rating'
import { useUiLocale } from '../../locale'
import { useServerRender } from '../../primitives/utils/hidden-input'
import { RatingItem, RatingItemIndicator, RatingRoot } from '../../primitives/rating'
import { useFieldControl } from '../form-field/context'
import {
  ratingFill,
  ratingItem,
  ratingRoot,
  ratingStar,
  ratingStep,
  type RatingVariants,
} from './rating.variants'
import { useRatingScale } from './hooks/useRatingScale'
import { useControllableState } from '../../primitives/utils/controllable-state'

const StarIcon = lucide(Star)

export interface RatingProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  max?: number
  stars?: number
  step?: 1 | 0.5
  clearable?: boolean
  readonly?: boolean
  name?: string
  size?: RatingVariants['size']
  disabled?: boolean
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  required?: boolean
  form?: string
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

function HiddenScore({
  name,
  value,
  disabled,
  form,
}: {
  name: string
  value: number
  disabled: boolean
  form?: string
}) {
  const server = useServerRender()
  const node = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    const input = node.current
    if (input && input.value !== String(value)) input.value = String(value)
  }, [value, server])
  return (
    <input
      ref={node}
      type="hidden"
      name={name}
      defaultValue={server ? String(value) : undefined}
      disabled={disabled}
      form={form}
    />
  )
}

export function Rating({
  max = 5,
  stars,
  step = 1,
  clearable = true,
  readonly,
  name,
  size,
  disabled: disabledProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...attrs
}: RatingProps) {
  const [model = 0, setModel] = useControllableState<number>({
    prop: valueProp,
    defaultProp: defaultValue ?? 0,
    onChange: onValueChange,
    caller: 'Rating',
  })
  const { count, scaled, value, setValue, toScore } = useRatingScale(model, setModel, max, stars)
  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { disabled: disabledProp },
    attrs,
  )

  if (readonly)
    return (
      <span
        {...attrs}
        data-hn-rating=""
        data-readonly=""
        role="img"
        aria-label={scaled ? t.rating.score(model, max) : t.rating.label(model, max)}
        className={cn(ratingRoot({ size }), className)}
      >
        {Array.from({ length: count }, (_, i) => i + 1).map(index => (
          <span key={index} className={ratingItem()}>
            <StarIcon className={ratingStar()} />
            <span className={ratingFill()} style={{ width: starFill(value, index) }}>
              <StarIcon className={ratingStar({ active: true })} />
            </span>
          </span>
        ))}
      </span>
    )

  return (
    <RatingRoot
      {...attrs}
      data-hn-rating=""
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      value={value}
      onValueChange={setValue}
      length={count}
      step={step}
      clearable={clearable}
      hoverable
      disabled={disabled}
      name={scaled ? undefined : name}
      className={cn(ratingRoot({ size }), className)}
    >
      {({ items }) => (
        <>
          {items.map(item => (
            <RatingItem key={item} item={item} className={ratingItem()}>
              {({ steps }) =>
                steps.map(rating => (
                  <RatingItemIndicator
                    key={rating}
                    step={rating}
                    aria-label={
                      scaled ? t.rating.score(toScore(rating), max) : t.rating.star(rating)
                    }
                    className={ratingStep()}
                    style={radixRatingStepStyle as CSSProperties}
                  >
                    <StarIcon className={ratingStar()} />
                  </RatingItemIndicator>
                ))
              }
            </RatingItem>
          ))}
          {scaled && name && (
            <HiddenScore name={name} value={model} disabled={disabled} form={attrs.form} />
          )}
        </>
      )}
    </RatingRoot>
  )
}
