import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type PropType,
} from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import {
  adjacentStepperItems,
  canGoToStep,
  STEPPER_STATUS_STYLE,
  stepperStatusText,
} from '../../../../shared/src/primitives/stepper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { provideStepperRootContext } from './context'

export interface StepperRootProps {
  defaultValue?: number
  orientation?: Orientation
  dir?: Direction
  modelValue?: number
  linear?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type StepperRootEmits = {
  'update:modelValue': [value: number | undefined]
}

const STATUS_PROPS = {
  'aria-live': 'polite',
  'aria-atomic': 'true',
  role: 'status',
  style: STEPPER_STATUS_STYLE,
}

export const StepperRoot = defineComponent({
  name: 'StepperRoot',
  props: {
    defaultValue: { type: Number, required: false, default: 1 },
    orientation: { type: String as PropType<Orientation>, required: false, default: 'horizontal' },
    dir: { type: String as PropType<Direction>, required: false },
    modelValue: { type: Number, required: false },
    linear: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose, slots }) {
    const { dir: propDir, orientation: propOrientation, linear } = toRefs(props)
    const dir = useDirection(propDir)
    const totalStepperItems = ref(new Set<HTMLElement>())
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === undefined,
    })
    const totalStepperItemsArray = computed(() => Array.from(totalStepperItems.value))
    const isFirstStep = computed(() => modelValue.value === 1)
    const isLastStep = computed(() => modelValue.value === totalStepperItemsArray.value.length)
    const totalSteps = computed(() => totalStepperItems.value.size)

    function goToStep(step: number) {
      if (!canGoToStep(step, totalStepperItemsArray.value, linear.value, modelValue.value)) return
      modelValue.value = step
    }
    function nextStep() {
      goToStep((modelValue.value ?? 1) + 1)
    }
    function prevStep() {
      goToStep((modelValue.value ?? 1) - 1)
    }
    function hasNext() {
      return (modelValue.value ?? 1) < totalSteps.value
    }
    function hasPrev() {
      return (modelValue.value ?? 1) > 1
    }

    const nextStepperItem = ref<HTMLElement | null | 0>(null)
    const prevStepperItem = ref<HTMLElement | null | 0>(null)
    const isNextDisabled = computed(() =>
      nextStepperItem.value ? nextStepperItem.value.getAttribute('disabled') === '' : true,
    )
    const isPrevDisabled = computed(() =>
      prevStepperItem.value ? prevStepperItem.value.getAttribute('disabled') === '' : true,
    )

    function updateAdjacent() {
      const adjacent = adjacentStepperItems(totalStepperItemsArray.value, modelValue.value!)
      nextStepperItem.value = adjacent.next ?? null
      prevStepperItem.value = adjacent.prev ?? null
    }
    watch(modelValue, async () => {
      await nextTick(updateAdjacent)
    })
    watch(totalStepperItemsArray, async () => {
      await nextTick(updateAdjacent)
    })

    provideStepperRootContext({
      modelValue,
      changeModelValue: value => {
        modelValue.value = value
      },
      orientation: propOrientation,
      dir,
      linear,
      totalStepperItems,
    })

    expose({
      goToStep,
      nextStep,
      prevStep,
      modelValue,
      totalSteps,
      isNextDisabled,
      isPrevDisabled,
      isFirstStep,
      isLastStep,
      hasNext,
      hasPrev,
    })
    useForwardExpose()

    return () =>
      h(
        Primitive,
        {
          role: 'group',
          'aria-label': 'progress',
          as: props.as,
          'as-child': props.asChild,
          'data-linear': linear.value ? '' : undefined,
          'data-orientation': props.orientation,
        },
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {
              modelValue: modelValue.value,
              totalSteps: totalStepperItems.value.size,
              isNextDisabled: isNextDisabled.value,
              isPrevDisabled: isPrevDisabled.value,
              isFirstStep: isFirstStep.value,
              isLastStep: isLastStep.value,
              goToStep,
              nextStep,
              prevStep,
              hasNext,
              hasPrev,
            }),
            h(
              'div',
              STATUS_PROPS,
              stepperStatusText(modelValue.value, totalStepperItems.value.size),
            ),
          ]),
        },
      )
  },
})
