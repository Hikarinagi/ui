import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
} from 'vue'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import { activatesStepOnPointer } from '../../../../shared/src/primitives/stepper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectStepperItemContext, injectStepperRootContext } from './context'

export interface StepperTriggerProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

export const StepperTrigger = defineComponent({
  name: 'StepperTrigger',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectStepperRootContext()
    const itemContext = injectStepperItemContext()
    const stepperItems = computed(() => Array.from(rootContext.totalStepperItems.value))

    function handleMouseDown(event: MouseEvent) {
      if (itemContext.disabled.value) return
      if (
        activatesStepOnPointer(
          event,
          rootContext.linear.value,
          itemContext.step.value,
          rootContext.modelValue.value!,
        )
      ) {
        rootContext.changeModelValue(itemContext.step.value)
        return
      }
      event.preventDefault()
    }

    function handleKeyDown(event: KeyboardEvent) {
      event.preventDefault()
      if (itemContext.disabled.value) return
      if ((event.key === 'Enter' || event.key === ' ') && !event.ctrlKey && !event.shiftKey)
        rootContext.changeModelValue(itemContext.step.value)
      if (ARROW_KEYS.includes(event.key))
        arrowNavigation(event, getActiveElement() as HTMLElement | null, undefined, {
          itemsArray: stepperItems.value,
          focus: true,
          loop: false,
          arrowKeyOptions: rootContext.orientation.value,
          dir: rootContext.dir.value,
        })
    }

    const { forwardRef, currentElement } = useForwardExpose()
    let registeredElement: HTMLElement | null = null
    onMounted(() => {
      registeredElement = currentElement.value
      if (registeredElement) rootContext.totalStepperItems.value.add(registeredElement)
    })
    onUnmounted(() => {
      if (registeredElement) {
        rootContext.totalStepperItems.value.delete(registeredElement)
        registeredElement = null
      }
    })

    const onMousedown = withModifiers(handleMouseDown as (event: Event) => void, ['left'])
    const onKeydown = withKeys(handleKeyDown as (event: Event) => void, [
      'enter',
      'space',
      'left',
      'right',
      'up',
      'down',
    ])

    return () => {
      const unavailable = itemContext.disabled.value || !itemContext.isFocusable.value
      return h(
        Primitive,
        {
          ref: forwardRef,
          type: props.as === 'button' ? 'button' : undefined,
          as: props.as,
          'as-child': props.asChild,
          'data-state': itemContext.state.value,
          disabled: unavailable ? '' : undefined,
          'data-disabled': unavailable ? '' : undefined,
          'data-orientation': rootContext.orientation.value,
          tabindex: itemContext.isFocusable.value ? 0 : -1,
          'aria-describedby': itemContext.descriptionId,
          'aria-labelledby': itemContext.titleId,
          onMousedown,
          onKeydown,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
    }
  },
})
