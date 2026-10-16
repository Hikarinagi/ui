import { createEventHook } from '@vueuse/core'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  guardReactiveProps,
  h,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  withKeys,
  type Component,
  type ComponentPublicInstance,
  type PropType,
  type Ref,
} from 'vue'
import { createCollatorFilter } from '../../../../shared/src/lib/virtual/filter'
import {
  comboboxSearchText,
  filterComboboxItems,
  type ComboboxFilterState,
} from '../../../../shared/src/primitives/combobox'
import type { Comparator } from '../../../../shared/src/primitives/listbox'
import {
  injectListboxRootContext,
  ListboxFilter,
  ListboxRoot,
  provideListboxHighlightScrollContext,
} from '../listbox'
import { PopperAnchor, PopperRoot } from '../popper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { useComposing } from '../utils/useComposing'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import {
  injectComboboxRootContext,
  provideComboboxRootContext,
  type ComboboxContentPosition,
} from './context'

export const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

interface ListboxRootExpose extends ComponentPublicInstance {
  highlightedElement?: HTMLElement | null
  highlightItem?: (value: unknown) => void
  highlightFirstItem?: () => void
  highlightSelected?: (event?: Event) => void
}

function useComboboxContentPositioning(open: Ref<boolean>) {
  const contentPosition = ref<ComboboxContentPosition>('inline')
  const contentPlaced = ref(false)
  const currentContent = ref<symbol>()
  const suppressHighlightScroll = computed(
    () => contentPosition.value === 'popper' && !contentPlaced.value,
  )
  let pendingHighlightScroll: (() => void) | undefined

  provideListboxHighlightScrollContext({
    suppressHighlightScroll,
    onHighlightScrollRequest(scroll) {
      pendingHighlightScroll = scroll
    },
  })

  function onContentPositionChange(content: symbol, position: ComboboxContentPosition) {
    if (currentContent.value !== content || contentPosition.value !== position) {
      contentPlaced.value = false
      pendingHighlightScroll = undefined
    }
    currentContent.value = content
    contentPosition.value = position
  }

  function onContentPlaced(content: symbol) {
    if (
      currentContent.value !== content ||
      contentPosition.value !== 'popper' ||
      contentPlaced.value
    )
      return
    contentPlaced.value = true
    const scroll = pendingHighlightScroll
    pendingHighlightScroll = undefined
    if (open.value) scroll?.()
  }

  function onContentUnmount(content: symbol) {
    if (currentContent.value !== content) return
    currentContent.value = undefined
    contentPosition.value = 'inline'
    contentPlaced.value = false
    pendingHighlightScroll = undefined
  }

  return { onContentPositionChange, onContentPlaced, onContentUnmount }
}

export const ComboboxRoot = defineComponent({
  name: 'ComboboxRoot',
  props: {
    open: { type: Boolean, required: false, default: undefined },
    defaultOpen: { type: Boolean, required: false },
    resetSearchTermOnBlur: { type: Boolean, required: false, default: true },
    resetSearchTermOnSelect: { type: Boolean, required: false, default: true },
    openOnFocus: { type: Boolean, required: false, default: false },
    openOnClick: { type: Boolean, required: false, default: false },
    ignoreFilter: { type: Boolean, required: false },
    resetModelValueOnClear: { type: Boolean, required: false, default: false },
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    multiple: { type: Boolean, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    disabled: { type: Boolean, required: false },
    highlightOnHover: { type: Boolean, required: false, default: true },
    by: { type: [String, Function] as PropType<Comparator>, required: false },
    ...primitive(),
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'highlight', 'update:open'],
  setup(props, { attrs, emit, expose, slots }) {
    const { primitiveElement, currentElement: parentElement } =
      usePrimitiveElement<ListboxRootExpose>()
    const {
      multiple,
      disabled,
      ignoreFilter,
      resetSearchTermOnSelect,
      openOnFocus,
      openOnClick,
      dir: propDir,
      resetModelValueOnClear,
      highlightOnHover,
    } = toRefs(props)
    const dir = useDirection(propDir)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : undefined),
      passive: props.modelValue === undefined,
      deep: true,
    }) as Ref<unknown>
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>

    async function onOpenChange(value: boolean) {
      open.value = value
      filterSearch.value = ''
      if (value) {
        await nextTick()
        primitiveElement.value?.highlightSelected?.()
        isUserInputted.value = true
        inputElement.value?.focus()
      } else {
        isUserInputted.value = false
        setTimeout(() => {
          if (!value && props.resetSearchTermOnBlur) resetSearchTerm.trigger()
        }, 1)
      }
    }

    const resetSearchTerm = createEventHook<void>()
    const isUserInputted = ref(false)
    const isVirtual = ref(false)
    const inputElement = ref<HTMLInputElement>()
    const triggerElement = ref<HTMLElement>()
    const highlightedElement = computed(
      () => primitiveElement.value?.highlightedElement ?? undefined,
    )
    const contentPositioning = useComboboxContentPositioning(open)
    const allItems = ref(new Map<string, string>())
    const allGroups = ref(new Map<string, Set<string>>())
    const { contains } = createCollatorFilter({ sensitivity: 'base' })
    const filterSearch = ref('')
    const filterState = computed<ComboboxFilterState>(oldValue => {
      if (!filterSearch.value || props.ignoreFilter || isVirtual.value)
        return {
          count: allItems.value.size,
          items: oldValue?.items ?? new Map(),
          groups: oldValue?.groups ?? new Set(allGroups.value.keys()),
        }
      return filterComboboxItems(allItems.value, allGroups.value, filterSearch.value, contains)
    })

    const instance = getCurrentInstance()
    onMounted(() => {
      if (instance?.exposed) {
        instance.exposed.highlightItem = primitiveElement.value?.highlightItem
        instance.exposed.highlightFirstItem = primitiveElement.value?.highlightFirstItem
        instance.exposed.highlightSelected = primitiveElement.value?.highlightSelected
      }
    })

    expose({
      filtered: filterState,
      highlightedElement,
      highlightItem: primitiveElement.value?.highlightItem,
      highlightFirstItem: primitiveElement.value?.highlightFirstItem,
      highlightSelected: primitiveElement.value?.highlightSelected,
    })

    provideComboboxRootContext({
      modelValue,
      multiple,
      disabled,
      open,
      onOpenChange,
      ...contentPositioning,
      contentId: '',
      isUserInputted,
      isVirtual,
      inputElement,
      highlightedElement,
      onInputElementChange: value => (inputElement.value = value),
      triggerElement,
      onTriggerElementChange: value => (triggerElement.value = value),
      parentElement,
      resetSearchTermOnSelect,
      onResetSearchTerm: resetSearchTerm.on,
      allItems,
      allGroups,
      filterSearch,
      filterState,
      ignoreFilter,
      openOnFocus,
      openOnClick,
      resetModelValueOnClear,
    })

    return () =>
      h(PopperRoot, null, {
        default: withCtx(() => [
          h(
            ListboxRoot as Component,
            mergeProps({ ref: primitiveElement }, attrs, {
              modelValue: modelValue.value,
              'onUpdate:modelValue': (value: unknown) => (modelValue.value = value),
              style: { pointerEvents: open.value ? 'auto' : undefined },
              as: props.as,
              'as-child': props.asChild,
              dir: dir.value,
              multiple: multiple.value,
              name: props.name,
              required: props.required,
              disabled: disabled.value,
              'highlight-on-hover': highlightOnHover.value,
              by: props.by,
              onHighlight: (payload: unknown) => emit('highlight', payload),
            }),
            {
              default: withCtx(() => [
                renderSlot(slots, 'default', { open: open.value, modelValue: modelValue.value }),
              ]),
            },
          ),
        ]),
      })
  },
})

export const ComboboxAnchor = defineComponent({
  name: 'ComboboxAnchor',
  props: { reference: { type: null, required: false }, ...primitive() },
  setup(props, { attrs, slots }) {
    const { forwardRef } = useForwardExpose()
    return () =>
      h(
        PopperAnchor as Component,
        { 'as-child': '', reference: props.reference },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps({ ref: forwardRef, 'as-child': props.asChild, as: props.as }, attrs),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const ComboboxInput = defineComponent({
  name: 'ComboboxInput',
  props: {
    displayValue: { type: Function as PropType<(value: never) => string>, required: false },
    modelValue: { type: String, required: false },
    autoFocus: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    ...primitive('input'),
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const rootContext = injectComboboxRootContext()
    const listboxContext = injectListboxRootContext()
    const { primitiveElement, currentElement } = usePrimitiveElement()
    const modelValue = useVModel(props, 'modelValue', emit, {
      passive: props.modelValue === undefined,
    }) as Ref<string | undefined>

    onMounted(() => {
      if (currentElement.value)
        rootContext.onInputElementChange(currentElement.value as HTMLInputElement)
    })

    const {
      isComposing,
      shouldDeferInput,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
    } = useComposing(event => {
      const element = event.target as HTMLInputElement | null
      if (element) processInputValue(element.value)
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (isComposing.value) return
      event.preventDefault()
      if (!rootContext.open.value) rootContext.onOpenChange(true)
    }

    function processInputValue(value: string) {
      if (!rootContext.open.value) {
        rootContext.onOpenChange(true)
        nextTick(() => {
          if (value) {
            rootContext.filterSearch.value = value
            listboxContext.highlightFirstItem()
          }
        })
      } else rootContext.filterSearch.value = value
    }

    function handleInput(event: Event) {
      if (shouldDeferInput.value) return
      processInputValue((event.target as HTMLInputElement).value)
    }

    function handleFocus() {
      if (rootContext.openOnFocus.value && !rootContext.open.value) rootContext.onOpenChange(true)
    }

    function handleBlur(event: FocusEvent) {
      if (!rootContext.open.value) return
      const nextFocus = event.relatedTarget as Node | null
      if (!nextFocus) return
      const isInsideRoot = rootContext.parentElement.value?.contains(nextFocus)
      const isInsideContent = document.getElementById(rootContext.contentId)?.contains(nextFocus)
      if (!isInsideRoot && !isInsideContent)
        requestAnimationFrame(() => {
          if (!rootContext.open.value) return
          const active = document.activeElement
          const isStillOutside =
            !rootContext.parentElement.value?.contains(active) &&
            !document.getElementById(rootContext.contentId)?.contains(active)
          if (isStillOutside) rootContext.onOpenChange(false)
        })
    }

    function handleClick() {
      if (rootContext.openOnClick.value && !rootContext.open.value) rootContext.onOpenChange(true)
    }

    function resetSearchTerm() {
      modelValue.value = comboboxSearchText(
        rootContext.modelValue.value,
        rootContext.multiple.value,
        props.displayValue as ((value: unknown) => string) | undefined,
      )
      nextTick(() => {
        modelValue.value = modelValue.value
      })
    }

    rootContext.onResetSearchTerm(() => {
      resetSearchTerm()
    })

    watch(
      rootContext.modelValue,
      async () => {
        if (!rootContext.isUserInputted.value && rootContext.resetSearchTermOnSelect.value)
          resetSearchTerm()
      },
      { immediate: true, deep: true },
    )

    watch(rootContext.filterState, (_newValue, oldValue) => {
      if (!rootContext.isVirtual.value && oldValue.count === 0) listboxContext.highlightFirstItem()
    })

    return () =>
      h(
        ListboxFilter as Component,
        {
          ref: primitiveElement,
          modelValue: modelValue.value,
          'onUpdate:modelValue': (value: string) => (modelValue.value = value),
          as: props.as,
          'as-child': props.asChild,
          'auto-focus': props.autoFocus,
          disabled: props.disabled,
          'aria-expanded': rootContext.open.value,
          'aria-controls': rootContext.contentId,
          'aria-autocomplete': 'list',
          role: 'combobox',
          autocomplete: 'off',
          onClick: handleClick,
          onInput: handleInput,
          onKeydown: withKeys(handleKeyDown as (event: Event) => void, ['down', 'up']),
          onFocus: handleFocus,
          onBlur: handleBlur,
          onCompositionstart: handleCompositionStart,
          onCompositionupdate: handleCompositionUpdate,
          onCompositionend: handleCompositionEnd,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ComboboxTrigger = defineComponent({
  name: 'ComboboxTrigger',
  props: { disabled: { type: Boolean, required: false }, ...primitive('button') },
  setup(props, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectComboboxRootContext()
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false)

    onMounted(() => {
      if (currentElement.value) rootContext.onTriggerElementChange(currentElement.value)
    })

    return () =>
      h(
        Primitive,
        mergeProps(props, {
          ref: forwardRef,
          type: props.as === 'button' ? 'button' : undefined,
          tabindex: '-1',
          'aria-label': 'Show popup',
          'aria-haspopup': 'listbox',
          'aria-expanded': rootContext.open.value,
          'aria-controls': rootContext.contentId,
          'data-state': rootContext.open.value ? 'open' : 'closed',
          disabled: disabled.value,
          'data-disabled': disabled.value ? '' : undefined,
          'aria-disabled': disabled.value ?? undefined,
          onClick: () => rootContext.onOpenChange(!rootContext.open.value),
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ComboboxPortal = defineComponent({
  name: 'ComboboxPortal',
  props: {
    to: { type: null as unknown as PropType<string | HTMLElement>, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  setup(props, { slots }) {
    return () =>
      h(Teleport as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
