import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  renderSlot,
  watch,
  withCtx,
  withKeys,
  type PropType,
} from 'vue'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  navigatePin,
  pinFocusRedirect,
  pinInputLabel,
  pinPlaceholder,
  resolvePinComposition,
  resolvePinInput,
  resolvePinPaste,
  setPinValueAt,
  spreadPinValue,
  type PinTextAction,
} from '../../../../shared/src/primitives/pin-input'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useComposing } from '../utils/useComposing'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { injectPinInputRootContext } from './context'

export interface PinInputInputProps {
  index: number
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const PinInputInput = defineComponent({
  name: 'PinInputInput',
  props: {
    index: { type: Number, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'input',
    },
  },
  setup(props, { slots }) {
    const context = injectPinInputRootContext()
    const inputElements = computed(() => [...context.inputElements!.value])
    const currentValue = computed(() => context.currentModelValue.value[props.index])
    const disabled = computed(() => props.disabled || context.disabled.value)
    const isOtpMode = computed(() => context.otp.value)
    const isPasswordMode = computed(() => context.mask.value)
    const { primitiveElement, currentElement } = usePrimitiveElement()

    function updateModelValueAt(index: number, value: string) {
      context.modelValue.value = setPinValueAt(
        context.currentModelValue.value,
        index,
        value,
        context.isNumericMode.value,
      )
    }

    function handleMultipleCharacter(characters: string) {
      const { values, filled, end } = spreadPinValue(
        context.currentModelValue.value,
        characters,
        props.index,
        inputElements.value.length,
        context.isNumericMode.value,
      )
      for (const at of filled) inputElements.value[at]!.focus()
      context.modelValue.value = values
      inputElements.value[end]?.focus()
    }

    function apply(target: HTMLInputElement, action: PinTextAction) {
      if (action.kind === 'clear') target.value = ''
      else if (action.kind === 'filter') target.value = action.value
      else if (action.kind === 'spread') handleMultipleCharacter(action.characters)
      else {
        target.value = action.character
        updateModelValueAt(props.index, target.value)
        inputElements.value[props.index + 1]?.focus()
      }
    }

    const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing(event => {
      const target = event.target as HTMLInputElement
      apply(target, resolvePinComposition(event.data || target.value, context.isNumericMode.value))
    })

    function handleInput(event: InputEvent) {
      if (isComposing.value || event.isComposing) return
      const target = event.target as HTMLInputElement
      apply(target, resolvePinInput(event.data, target.value, context.isNumericMode.value))
    }

    function updatePlaceholder() {
      void nextTick(() => {
        const target = currentElement.value as HTMLInputElement | undefined
        if (!target) return
        pinPlaceholder(target, getActiveElement(), context.placeholder.value)
      })
    }

    function handleKeydown(event: KeyboardEvent) {
      if (isComposing.value || event.isComposing) return
      navigatePin(
        event,
        getActiveElement() as HTMLElement | null,
        inputElements.value,
        context.dir.value,
      )
    }

    function handleBackspace(event: KeyboardEvent) {
      event.preventDefault()
      const target = event.target as HTMLInputElement
      if (target.value) updateModelValueAt(props.index, '')
      else {
        const previous = inputElements.value[props.index - 1]
        if (previous) {
          previous.focus()
          updateModelValueAt(props.index - 1, '')
        }
      }
    }

    function handleDelete(event: KeyboardEvent) {
      if (event.key === 'Delete') {
        event.preventDefault()
        updateModelValueAt(props.index, '')
      }
    }

    function handleFocus(event: FocusEvent) {
      if (context.otp.value) {
        const redirect = pinFocusRedirect(
          context.currentModelValue.value,
          inputElements.value.length,
          props.index,
        )
        if (redirect !== -1) {
          inputElements.value[redirect]!.focus()
          return
        }
      }
      ;(event.target as HTMLInputElement).setSelectionRange(1, 1)
      updatePlaceholder()
    }

    function handlePaste(event: ClipboardEvent) {
      event.preventDefault()
      const clipboardData = event.clipboardData
      if (!clipboardData) return
      handleMultipleCharacter(
        resolvePinPaste(clipboardData.getData('text'), context.isNumericMode.value),
      )
    }

    watch(currentValue, updatePlaceholder)
    onMounted(() => {
      context.onInputElementChange(currentElement.value as HTMLInputElement)
    })
    onUnmounted(() => {
      context.inputElements?.value.delete(currentElement.value as HTMLInputElement)
    })

    const onInput = (event: Event) => handleInput(event as InputEvent)
    const onKeydown = [
      withKeys(handleKeydown as (event: Event) => void, [
        'left',
        'right',
        'up',
        'down',
        'home',
        'end',
      ]),
      withKeys(handleBackspace as (event: Event) => void, ['backspace']),
      withKeys(handleDelete as (event: Event) => void, ['delete']),
    ]

    return () =>
      h(
        Primitive,
        {
          ref: primitiveElement,
          autocapitalize: 'none',
          as: props.as,
          'as-child': props.asChild,
          autocomplete: isOtpMode.value ? 'one-time-code' : 'false',
          type: isPasswordMode.value ? 'password' : 'text',
          inputmode: context.isNumericMode.value ? 'numeric' : 'text',
          pattern: context.isNumericMode.value ? '[0-9]*' : undefined,
          placeholder: context.placeholder.value,
          value: currentValue.value,
          disabled: disabled.value,
          'data-disabled': disabled.value ? '' : undefined,
          'data-complete': context.isCompleted.value ? '' : undefined,
          'aria-label': pinInputLabel(props.index, inputElements.value.length),
          onInput,
          onKeydown,
          onFocus: handleFocus,
          onBlur: updatePlaceholder,
          onPaste: handlePaste,
          onCompositionstart: handleCompositionStart,
          onCompositionend: handleCompositionEnd,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
