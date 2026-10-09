import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  ref,
  renderSlot,
  toRaw,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import {
  getClosestValueIndex,
  resolveSliderUpdate,
  sliderStepAmount,
  type SliderOrientation,
  type SliderThumbAlignment,
} from '../../../../shared/src/primitives/slider'
import { useCollection } from '../collection'
import type { PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import { provideSliderRootContext } from './context'
import { SliderHorizontal, SliderVertical } from './SliderOrientation'

export interface SliderRootProps {
  defaultValue?: number[]
  modelValue?: number[] | null
  disabled?: boolean
  orientation?: SliderOrientation
  dir?: Direction
  inverted?: boolean
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  thumbAlignment?: SliderThumbAlignment
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type SliderRootEmits = {
  'update:modelValue': [value: number[] | undefined]
  valueCommit: [value: number[]]
}

export const SliderRoot = defineComponent({
  name: 'SliderRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: Array as PropType<number[]>, required: false, default: () => [0] },
    modelValue: { type: [Array, null] as PropType<number[] | null>, required: false },
    disabled: { type: Boolean, required: false, default: false },
    orientation: {
      type: String as PropType<SliderOrientation>,
      required: false,
      default: 'horizontal',
    },
    dir: { type: String as PropType<Direction>, required: false },
    inverted: { type: Boolean, required: false, default: false },
    min: { type: Number, required: false, default: 0 },
    max: { type: Number, required: false, default: 100 },
    step: { type: Number, required: false, default: 1 },
    minStepsBetweenThumbs: { type: Number, required: false, default: 0 },
    thumbAlignment: {
      type: String as PropType<SliderThumbAlignment>,
      required: false,
      default: 'contain',
    },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'valueCommit'],
  setup(props, { emit, attrs, slots }) {
    const {
      min,
      max,
      step,
      minStepsBetweenThumbs,
      orientation,
      disabled,
      thumbAlignment,
      dir: propDir,
    } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef, currentElement } = useForwardExpose()
    const isFormControl = useFormControl(currentElement)
    const { CollectionSlot } = useCollection({ isProvider: true })
    const modelValue = useVModel(
      props,
      'modelValue',
      (_, value) => emit('update:modelValue', value as number[] | undefined),
      { defaultValue: props.defaultValue, passive: props.modelValue === undefined },
    )
    const currentModelValue = computed(() =>
      Array.isArray(modelValue.value) ? [...modelValue.value] : [],
    )
    const valueIndexToChangeRef = ref(0)
    const valuesBeforeSlideStartRef = ref(currentModelValue.value)
    const thumbElements = ref<HTMLElement[]>([])

    function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
      const update = resolveSliderUpdate(currentModelValue.value, value, atIndex, {
        min: min.value,
        max: max.value,
        step: step.value,
        minStepsBetweenThumbs: minStepsBetweenThumbs.value,
      })
      if (!update) return
      valueIndexToChangeRef.value = update.index
      const hasChanged = String(update.values) !== String(modelValue.value)
      if (hasChanged && commit) emit('valueCommit', update.values)
      if (hasChanged) {
        thumbElements.value[valueIndexToChangeRef.value]?.focus()
        modelValue.value = update.values
      }
    }

    function handleSlideStart(value: number) {
      updateValues(value, getClosestValueIndex(currentModelValue.value, value))
    }
    function handleSlideMove(value: number) {
      updateValues(value, valueIndexToChangeRef.value)
    }
    function handleSlideEnd() {
      const previous = valuesBeforeSlideStartRef.value[valueIndexToChangeRef.value]
      const next = currentModelValue.value[valueIndexToChangeRef.value]
      if (next !== previous) emit('valueCommit', toRaw(currentModelValue.value))
    }

    provideSliderRootContext({
      modelValue,
      currentModelValue,
      valueIndexToChangeRef,
      thumbElements,
      orientation,
      min,
      max,
      disabled,
      thumbAlignment,
    })

    const handlers = {
      onPointerdown: () => {
        if (!disabled.value) valuesBeforeSlideStartRef.value = currentModelValue.value
      },
      onSlideStart: (value: number) => !disabled.value && handleSlideStart(value),
      onSlideMove: (value: number) => !disabled.value && handleSlideMove(value),
      onSlideEnd: () => !disabled.value && handleSlideEnd(),
      onHomeKeyDown: () => !disabled.value && updateValues(min.value, 0, { commit: true }),
      onEndKeyDown: () =>
        !disabled.value &&
        updateValues(max.value, currentModelValue.value.length - 1, { commit: true }),
      onStepKeyDown: (event: KeyboardEvent, direction: number) => {
        if (disabled.value) return
        const atIndex = valueIndexToChangeRef.value
        const value = currentModelValue.value[atIndex]!
        updateValues(value + sliderStepAmount(event, step.value) * direction, atIndex, {
          commit: true,
        })
      },
    }

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            orientation.value === 'horizontal' ? SliderHorizontal : SliderVertical,
            mergeProps(attrs, {
              ref: forwardRef,
              'as-child': props.asChild,
              as: props.as,
              min: min.value,
              max: max.value,
              dir: dir.value,
              inverted: props.inverted,
              'aria-disabled': disabled.value,
              'data-disabled': disabled.value ? '' : undefined,
              ...handlers,
            }) as { min: number; max: number; inverted: boolean },
            {
              default: withCtx(() => [
                renderSlot(slots, 'default', { modelValue: modelValue.value }),
                isFormControl.value && props.name
                  ? h(VisuallyHiddenInput, {
                      key: 0,
                      type: 'number',
                      value: modelValue.value,
                      name: props.name,
                      required: props.required,
                      disabled: disabled.value,
                      step: step.value,
                    })
                  : createCommentVNode('v-if', true),
              ]),
            },
          ),
        ]),
      })
  },
})
