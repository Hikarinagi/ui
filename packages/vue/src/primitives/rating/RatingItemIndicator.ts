import {
  computed,
  defineComponent,
  h,
  normalizeStyle,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { useActiveElement } from '@vueuse/core'
import {
  isRatingStepActive,
  isRatingStepVisible,
  ratingStepWidth,
  ratingStepZIndex,
} from '../../../../shared/src/primitives/rating'
import type { PrimitiveProps } from '../primitive'
import { RadioGroupIndicator, RadioGroupItem } from '../radio-group'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectRatingItemContext, injectRatingRootContext } from './context'

export interface RatingItemIndicatorProps {
  step: number
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const RatingItemIndicator = defineComponent({
  name: 'RatingItemIndicator',
  props: {
    step: { type: Number, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectRatingRootContext()
    const { currentElement, forwardRef } = useForwardExpose()
    const activeElement = useActiveElement()
    const itemContext = injectRatingItemContext()
    const isActive = computed(() =>
      isRatingStepActive(props.step, rootContext.hoveredRating.value, rootContext.modelValue.value),
    )
    const isVisible = computed(() =>
      isRatingStepVisible(
        activeElement.value === currentElement.value,
        rootContext.step.value,
        props.step,
        rootContext.hoveredRating.value,
        rootContext.modelValue.value,
      ),
    )
    const onSelect = () => rootContext.changeModelValue(props.step)
    const onMouseenter = () => rootContext.changeHoveredRating(props.step)

    return () =>
      h(
        RadioGroupItem,
        {
          ref: forwardRef,
          as: props.as,
          'as-child': props.asChild,
          style: normalizeStyle({
            '--reka-rating-item-step-width': ratingStepWidth(props.step),
            '--reka-rating-item-step-opacity': isVisible.value ? 1 : 0,
            '--reka-rating-item-step-z-index': ratingStepZIndex(
              itemContext.steps.value,
              props.step,
            ),
          }),
          value: props.step,
          'data-state': isActive.value ? 'active' : undefined,
          disabled: rootContext.disabled.value,
          onSelect,
          onMouseenter,
        },
        {
          default: withCtx(() => [
            h(
              RadioGroupIndicator,
              { forceMount: true, 'as-child': '' },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
