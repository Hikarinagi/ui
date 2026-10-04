import { computed, defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import { isStepFocusable, stepperItemState } from '../../../../shared/src/primitives/stepper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectStepperRootContext, provideStepperItemContext } from './context'

export interface StepperItemProps {
  step: number
  disabled?: boolean
  completed?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const StepperItem = defineComponent({
  name: 'StepperItem',
  props: {
    step: { type: Number, required: true },
    disabled: { type: Boolean, required: false, default: false },
    completed: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { disabled, step, completed } = toRefs(props)
    const { forwardRef } = useForwardExpose()
    const rootContext = injectStepperRootContext()
    const titleId = useId(undefined, 'reka-stepper-item-title')
    const descriptionId = useId(undefined, 'reka-stepper-item-description')
    const itemState = computed(() =>
      stepperItemState(completed.value, rootContext.modelValue.value!, step.value),
    )
    const isFocusable = computed(() =>
      isStepFocusable(
        disabled.value,
        rootContext.linear.value,
        step.value,
        rootContext.modelValue.value!,
      ),
    )

    provideStepperItemContext({
      titleId,
      descriptionId,
      state: itemState,
      disabled,
      step,
      isFocusable,
    })

    return () =>
      h(
        Primitive,
        {
          ref: forwardRef,
          as: props.as,
          'as-child': props.asChild,
          'aria-current': itemState.value === 'active' ? 'true' : undefined,
          'data-state': itemState.value,
          disabled: disabled.value || !isFocusable.value ? '' : undefined,
          'data-disabled': disabled.value || !isFocusable.value ? '' : undefined,
          'data-orientation': rootContext.orientation.value,
        },
        { default: withCtx(() => [renderSlot(slots, 'default', { state: itemState.value })]) },
      )
  },
})
