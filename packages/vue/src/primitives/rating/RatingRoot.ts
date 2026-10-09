import {
  computed,
  defineComponent,
  h,
  mergeProps,
  ref,
  renderSlot,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import { nextRating, ratingItems } from '../../../../shared/src/primitives/rating'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { PrimitiveProps } from '../primitive'
import { RadioGroupRoot } from '../radio-group'
import type { Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { provideRatingRootContext } from './context'

export interface RatingRootProps {
  defaultValue?: number
  modelValue?: number
  length?: number
  clearable?: boolean
  hoverable?: boolean
  step?: number
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type RatingRootEmits = {
  'update:modelValue': [value: number]
}

const OMITTED = ['length', 'clearable', 'hoverable', 'step']

export const RatingRoot = defineComponent({
  name: 'RatingRoot',
  props: {
    defaultValue: { type: Number, required: false },
    modelValue: { type: Number, required: false },
    length: { type: Number, required: false, default: 5 },
    clearable: { type: Boolean, required: false },
    hoverable: { type: Boolean, required: false },
    step: { type: Number, required: false, default: 1 },
    disabled: { type: Boolean, required: false },
    orientation: { type: String as PropType<Orientation>, required: false, default: 'horizontal' },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { length, disabled, clearable, hoverable, step } = toRefs(props)
    useForwardExpose()
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === undefined,
    })
    const items = computed(() => ratingItems(length.value))
    const hoveredRating = ref(0)

    function changeModelValue(rating: number) {
      if (disabled.value) return
      const next = nextRating(clearable.value, modelValue.value, rating)
      if (next === 0) hoveredRating.value = 0
      modelValue.value = next
    }
    function changeHoveredRating(rating: number) {
      if (disabled.value || !hoverable.value) return
      hoveredRating.value = rating
    }
    function resetHoveredRating() {
      hoveredRating.value = 0
    }

    provideRatingRootContext({
      modelValue,
      items,
      hoveredRating,
      disabled,
      step,
      changeModelValue,
      changeHoveredRating,
    })

    return () =>
      h(
        RadioGroupRoot,
        mergeProps(
          Object.fromEntries(Object.entries(props).filter(([key]) => !OMITTED.includes(key))),
          { disabled: disabled.value, onMouseleave: resetHoveredRating },
        ),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', { items: items.value, modelValue: modelValue.value }),
          ]),
        },
      )
  },
})
