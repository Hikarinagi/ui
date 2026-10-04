import {
  computed,
  inject,
  onScopeDispose,
  provide,
  ref,
  watch,
  type InjectionKey,
  type Ref,
} from 'vue'
import {
  createNumberFieldPressHold,
  isNumberFieldStepDisabled,
  numberFieldStepAttributes,
  type NumberFieldBound,
  type NumberFieldFormat,
  type NumberFieldInputMode,
  type NumberFieldRange,
  type NumberFieldStep,
} from '../../../../shared/src/primitives/number-field'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { isClient, windowTimers } from '../utils/timers'

export interface NumberFieldRootContext {
  modelValue: Ref<number | null | undefined>
  step: (direction: NumberFieldStep, multiplier?: number) => void
  jump: (bound: NumberFieldBound) => void
  commit: (text: string) => void
  inputEl: Ref<HTMLInputElement | undefined>
  onInputElement: (element: HTMLInputElement) => void
  inputMode: Ref<NumberFieldInputMode>
  textValue: Ref<string>
  range: Ref<NumberFieldRange>
  format: Ref<NumberFieldFormat>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  disableWheelChange: Ref<boolean>
  invertWheelChange: Ref<boolean>
  isDecreaseDisabled: Ref<boolean>
  isIncreaseDisabled: Ref<boolean>
  id: Ref<string | undefined>
}

const NUMBER_FIELD_ROOT = Symbol('NumberFieldRootContext') as InjectionKey<NumberFieldRootContext>

export function provideNumberFieldRootContext(context: NumberFieldRootContext) {
  provide(NUMBER_FIELD_ROOT, context)
  return context
}

export function injectNumberFieldRootContext() {
  const context = inject(NUMBER_FIELD_ROOT, null)
  if (!context)
    throw new Error(
      'Injection `Symbol(NumberFieldRootContext)` not found. Component must be used within `NumberFieldRoot`',
    )
  return context
}

export function useNumberFieldStep(
  direction: NumberFieldStep,
  props: { as?: unknown; disabled?: boolean },
) {
  const root = injectNumberFieldRootContext()
  const isDisabled = computed(() =>
    isNumberFieldStepDisabled({
      disabled: root.disabled.value,
      readonly: root.readonly.value,
      own: !!props.disabled,
      atLimit:
        direction === 'increase' ? root.isIncreaseDisabled.value : root.isDecreaseDisabled.value,
    }),
  )
  const { primitiveElement, currentElement } = usePrimitiveElement()
  const isPressed = ref(false)
  const hold = createNumberFieldPressHold({
    timers: windowTimers,
    disabled: () => isDisabled.value,
    trigger: () => root.step(direction),
    pressed: pressed => (isPressed.value = pressed),
  })

  if (isClient) {
    watch(
      currentElement,
      (element, _, onCleanup) => {
        if (!element) return
        element.addEventListener('pointerdown', hold.press)
        onCleanup(() => element.removeEventListener('pointerdown', hold.press))
      },
      { immediate: true, flush: 'post' },
    )
    window.addEventListener('pointerup', hold.release)
    window.addEventListener('pointercancel', hold.release)
    onScopeDispose(() => {
      window.removeEventListener('pointerup', hold.release)
      window.removeEventListener('pointercancel', hold.release)
    })
  }

  const attributes = computed(() =>
    numberFieldStepAttributes({
      direction,
      button: props.as === 'button',
      disabled: isDisabled.value,
      pressed: isPressed.value,
    }),
  )

  return { primitiveElement, attributes }
}
