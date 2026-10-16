import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  renderSlot,
  withCtx,
  withKeys,
  type PropType,
} from 'vue'
import {
  matchesTagsInputDelimiter,
  splitTagsInputPaste,
} from '../../../../shared/src/primitives/tags-input'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useComposing } from '../utils/useComposing'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectTagsInputRootContext } from './context'

export interface TagsInputInputProps {
  placeholder?: string
  autoFocus?: boolean
  maxLength?: number
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TagsInputInput = defineComponent({
  name: 'TagsInputInput',
  props: {
    placeholder: { type: String, required: false },
    autoFocus: { type: Boolean, required: false },
    maxLength: { type: Number, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'input',
    },
  },
  setup(props, { slots }) {
    const context = injectTagsInputRootContext()
    const { forwardRef, currentElement } = useForwardExpose()

    function handleBlur(event: FocusEvent) {
      context.selectedElement.value = undefined
      if (!context.addOnBlur.value) return
      const target = event.target as HTMLInputElement
      const relatedTarget = event.relatedTarget as HTMLElement | null
      const controlledId = target.getAttribute('aria-controls')
      if (controlledId && relatedTarget?.closest(`#${CSS.escape(controlledId)}`)) return
      if (!target.value) return
      if (context.onAddValue(target.value)) target.value = ''
    }

    function handleTab(event: Event) {
      if (!context.addOnTab.value) return
      void handleCustomKeydown(event)
    }

    const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing()

    async function handleCustomKeydown(event: Event) {
      if (isComposing.value) return
      await nextTick()
      if (event.defaultPrevented) return
      const target = event.target as HTMLInputElement
      if (!target.value) return
      if (context.onAddValue(target.value)) target.value = ''
      event.preventDefault()
    }

    function handleInput(event: Event) {
      if (isComposing.value) return
      context.isInvalidInput.value = false
      const data = (event as InputEvent).data
      if (data === null) return
      const delimiter = context.delimiter.value
      if (matchesTagsInputDelimiter(delimiter, data)) {
        const target = event.target as HTMLInputElement
        target.value = target.value.replace(delimiter, '')
        if (target.value.trim() === '') {
          target.value = ''
          return
        }
        if (context.onAddValue(target.value)) target.value = ''
      }
    }

    function handleInputKeydown(event: KeyboardEvent) {
      if (isComposing.value) return
      context.onInputKeydown(event)
    }

    function handlePaste(event: ClipboardEvent) {
      if (!context.addOnPaste.value) return
      event.preventDefault()
      const clipboardData = event.clipboardData
      if (!clipboardData) return
      for (const part of splitTagsInputPaste(
        clipboardData.getData('text'),
        context.delimiter.value,
      ))
        context.onAddValue(part)
    }

    onMounted(() => {
      const input =
        currentElement.value.nodeName === 'INPUT'
          ? currentElement.value
          : currentElement.value.querySelector('input')
      if (!input) return
      setTimeout(() => {
        if (props.autoFocus) input?.focus()
      }, 1)
    })

    return () =>
      h(
        Primitive,
        {
          id: context.id?.value,
          ref: forwardRef,
          type: 'text',
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          as: props.as,
          'as-child': props.asChild,
          maxlength: props.maxLength,
          placeholder: props.placeholder,
          disabled: context.disabled.value,
          'data-invalid': context.isInvalidInput.value ? '' : undefined,
          onInput: handleInput,
          onKeydown: [
            withKeys(handleCustomKeydown, ['enter']),
            withKeys(handleTab, ['tab']),
            handleInputKeydown,
          ],
          onBlur: handleBlur,
          onCompositionstart: handleCompositionStart,
          onCompositionend: handleCompositionEnd,
          onPaste: handlePaste,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
