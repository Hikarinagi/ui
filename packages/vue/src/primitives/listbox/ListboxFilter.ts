import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  watchSyncEffect,
  withCtx,
  withKeys,
  type PropType,
} from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useComposing } from '../utils/useComposing'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { injectListboxRootContext } from './context'

export interface ListboxFilterProps {
  modelValue?: string
  autoFocus?: boolean
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type ListboxFilterEmits = {
  'update:modelValue': [value: string]
}

export const ListboxFilter = defineComponent({
  name: 'ListboxFilter',
  props: {
    modelValue: { type: String, required: false },
    autoFocus: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'input',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: '',
      passive: props.modelValue === undefined,
    })
    const rootContext = injectListboxRootContext()
    const { primitiveElement, currentElement } = usePrimitiveElement()
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false)

    const activedescendant = ref<string | undefined>()
    watchSyncEffect(() => (activedescendant.value = rootContext.highlightedElement.value?.id))

    onMounted(() => {
      rootContext.focusable.value = false
      setTimeout(() => {
        if (props.autoFocus) currentElement.value?.focus()
      }, 1)
    })

    onUnmounted(() => {
      rootContext.focusable.value = true
    })

    const {
      isComposing,
      shouldDeferInput,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
    } = useComposing(event => {
      modelValue.value = (event.target as HTMLInputElement).value
      rootContext.onCompositionEnd()
      rootContext.highlightFirstItem()
    })

    function onCompositionStart() {
      rootContext.onCompositionStart()
      handleCompositionStart()
    }

    function handleInput(event: Event) {
      if (shouldDeferInput.value) return
      modelValue.value = (event.target as HTMLInputElement).value
      rootContext.highlightFirstItem()
    }

    function handleKeydownNavigation(event: KeyboardEvent) {
      if (isComposing.value) return
      event.preventDefault()
      rootContext.onKeydownNavigation(event)
    }

    function handleKeydownEnter(event: KeyboardEvent) {
      if (isComposing.value) return
      rootContext.onKeydownEnter(event)
    }

    return () =>
      h(
        Primitive,
        {
          ref: primitiveElement,
          as: props.as,
          'as-child': props.asChild,
          value: modelValue.value,
          disabled: disabled.value ? '' : undefined,
          'data-disabled': disabled.value ? '' : undefined,
          'aria-disabled': disabled.value ?? undefined,
          'aria-activedescendant': activedescendant.value,
          type: 'text',
          onKeydown: [
            withKeys(handleKeydownNavigation, ['down', 'up', 'home', 'end']),
            withKeys(handleKeydownEnter, ['enter']),
          ],
          onInput: handleInput,
          onCompositionstart: onCompositionStart,
          onCompositionupdate: handleCompositionUpdate,
          onCompositionend: handleCompositionEnd,
        },
        {
          default: withCtx(() => [renderSlot(slots, 'default', { modelValue: modelValue.value })]),
        },
      )
  },
})
