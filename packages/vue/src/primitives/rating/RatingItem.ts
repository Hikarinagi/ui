import { computed, defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { ratingSteps } from '../../../../shared/src/primitives/rating'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectRatingRootContext, provideRatingItemContext } from './context'

export interface RatingItemProps {
  item: number
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const RatingItem = defineComponent({
  name: 'RatingItem',
  props: {
    item: { type: Number, required: true },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'label',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectRatingRootContext()
    const steps = computed(() => ratingSteps(props.item, rootContext.step.value))
    provideRatingItemContext({ steps })

    return () =>
      h(
        Primitive,
        { as: props.as, 'as-child': props.asChild },
        { default: withCtx(() => [renderSlot(slots, 'default', { steps: steps.value })]) },
      )
  },
})
