import {
  createCommentVNode,
  defineComponent,
  h,
  nextTick,
  onScopeDispose,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type PropType,
  type Ref,
} from 'vue'
import { isClient } from '@vueuse/core'
import {
  compare,
  createEventHook,
  createTypeahead,
  enabledListboxItems,
  listboxNavigation,
  listboxRangeValues,
  nextListboxValue,
  type Comparator,
  type ListboxSelectionBehavior,
} from '../../../../shared/src/primitives/listbox'
import { getFocusIntent, type Orientation } from '../../../../shared/src/primitives/roving-focus'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { VisuallyHiddenInput } from '../visually-hidden'
import {
  injectListboxHighlightScrollContext,
  provideListboxHighlightScrollContext,
  provideListboxRootContext,
} from './context'

export interface ListboxRootProps<T = unknown> {
  modelValue?: T | T[]
  defaultValue?: T | T[]
  multiple?: boolean
  orientation?: Orientation
  dir?: Direction
  disabled?: boolean
  selectionBehavior?: ListboxSelectionBehavior
  highlightOnHover?: boolean
  by?: Comparator<T>
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type ListboxRootEmits<T = unknown> = {
  'update:modelValue': [value: T]
  highlight: [payload: { ref: HTMLElement; value: T } | undefined]
  entryFocus: [event: CustomEvent]
  leave: [event: Event]
}

export const ListboxRoot = defineComponent({
  name: 'ListboxRoot',
  props: {
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    multiple: { type: Boolean, required: false },
    orientation: { type: String as PropType<Orientation>, required: false, default: 'vertical' },
    dir: { type: String as PropType<Direction>, required: false },
    disabled: { type: Boolean, required: false },
    selectionBehavior: {
      type: String as PropType<ListboxSelectionBehavior>,
      required: false,
      default: 'toggle',
    },
    highlightOnHover: { type: Boolean, required: false },
    by: { type: [String, Function] as PropType<Comparator>, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'highlight', 'entryFocus', 'leave'],
  setup(props, { emit, expose, slots }) {
    const {
      multiple,
      highlightOnHover,
      orientation,
      disabled,
      selectionBehavior,
      dir: propDir,
    } = toRefs(props)
    const { getItems } = useCollection({ isProvider: true })
    const typeahead = createTypeahead()
    onScopeDispose(() => typeahead.dispose())
    const { primitiveElement, currentElement } = usePrimitiveElement()
    const dir = useDirection(propDir)
    const highlightScrollContext = injectListboxHighlightScrollContext(null)

    provideListboxHighlightScrollContext({
      suppressHighlightScroll: ref(false),
      onHighlightScrollRequest: () => {},
    })

    const isFormControl = useFormControl(currentElement)

    const firstValue = ref<unknown>()
    const isUserAction = ref(false)
    const focusable = ref(true)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : undefined),
      passive: props.modelValue === undefined,
    }) as Ref<unknown>

    function releaseUserAction() {
      setTimeout(() => {
        isUserAction.value = false
      }, 1)
    }

    function onValueChange(value: unknown) {
      isUserAction.value = true
      const next = nextListboxValue(modelValue.value, value, {
        multiple: props.multiple,
        selectionBehavior: props.selectionBehavior,
        by: props.by,
      })
      modelValue.value = next.value
      if (next.anchor) firstValue.value = value
      releaseUserAction()
    }

    const highlightedElement = ref<HTMLElement | null>(null)
    const previousElement = ref<HTMLElement | null>(null)
    const isVirtual = ref(false)
    const isComposing = ref(false)
    const virtualFocusHook = createEventHook<{ event?: Event; scroll: boolean }>()
    const virtualKeydownHook = createEventHook<KeyboardEvent>()
    const virtualHighlightHook = createEventHook<unknown>()

    function getCollectionItem() {
      return enabledListboxItems(getItems().map(item => item.ref))
    }

    function changeHighlight(element: HTMLElement, scrollIntoView = true, focus?: boolean) {
      if (!element) return

      highlightedElement.value = element
      const suppressHighlightScroll = highlightScrollContext?.suppressHighlightScroll.value ?? false
      if (focus ?? focusable.value) {
        if (suppressHighlightScroll) element.focus({ preventScroll: true })
        else element.focus()
      }

      if (suppressHighlightScroll) {
        highlightScrollContext?.onHighlightScrollRequest(
          scrollIntoView
            ? () => {
                const current = highlightedElement.value
                if (current?.isConnected) current.scrollIntoView({ block: 'nearest' })
              }
            : undefined,
        )
      } else if (scrollIntoView) element.scrollIntoView({ block: 'nearest' })

      emit(
        'highlight',
        getItems().find(item => item.ref === element),
      )
    }

    function highlightItem(value: unknown) {
      if (isVirtual.value) virtualHighlightHook.trigger(value)
      else {
        const item = getItems().find(entry => compare(entry.value, value, props.by))
        if (item) {
          highlightedElement.value = item.ref
          changeHighlight(item.ref)
        }
      }
    }

    function onKeydownEnter(event: KeyboardEvent) {
      const current = highlightedElement.value
      if (current && current.isConnected) {
        if (event.ctrlKey || event.metaKey || event.altKey) return
        event.preventDefault()
        event.stopPropagation()
        if (!isComposing.value) current.click()
      }
    }

    function onKeydownTypeAhead(event: KeyboardEvent) {
      if (!focusable.value) return
      isUserAction.value = true
      if (isVirtual.value) virtualKeydownHook.trigger(event)
      else {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
        if (isMetaKey && event.key === 'a' && multiple.value) {
          const collection = getItems()
          modelValue.value = collection.map(item => item.value)
          event.preventDefault()
          const lastItem = collection.at(-1)
          if (lastItem) changeHighlight(lastItem.ref)
        } else if (!isMetaKey) {
          const element = typeahead.handle(event.key, getItems())
          if (element) changeHighlight(element)
        }
      }
      releaseUserAction()
    }

    function onCompositionStart() {
      isComposing.value = true
    }

    function onCompositionEnd() {
      void nextTick(() => {
        isComposing.value = false
      })
    }

    function highlightFirstItem() {
      void nextTick(() => {
        onKeydownNavigation(new KeyboardEvent('keydown', { key: 'PageUp' }))
      })
    }

    function onLeave(event: Event) {
      const element = highlightedElement.value
      if (element?.isConnected) previousElement.value = element
      highlightedElement.value = null
      emit('leave', event)
    }

    function onEnter(event: Event) {
      const entryFocusEvent = new CustomEvent('listbox.entryFocus', {
        bubbles: false,
        cancelable: true,
      })
      event.currentTarget?.dispatchEvent(entryFocusEvent)
      emit('entryFocus', entryFocusEvent)
      if (entryFocusEvent.defaultPrevented) return
      if (previousElement.value) changeHighlight(previousElement.value)
      else changeHighlight(getCollectionItem()[0]!)
    }

    function onKeydownNavigation(event: KeyboardEvent) {
      const intent = getFocusIntent(event, orientation.value, dir.value)
      if (!intent) return

      const navigation = listboxNavigation(getCollectionItem(), highlightedElement.value, intent)
      if (navigation.extendsRange) handleMultipleReplace(event, navigation.rangeTarget)
      if (navigation.target) changeHighlight(navigation.target)
      if (isVirtual.value) virtualKeydownHook.trigger(event)
    }

    function handleMultipleReplace(event: KeyboardEvent, target: HTMLElement | undefined) {
      if (
        isVirtual.value ||
        props.selectionBehavior !== 'replace' ||
        !multiple.value ||
        !Array.isArray(modelValue.value)
      )
        return
      const values = listboxRangeValues(event, getItems(), target, firstValue.value)
      if (values) modelValue.value = values
    }

    async function highlightSelected(event?: Event, scroll = true) {
      if (!isClient) return
      await nextTick()
      if (isVirtual.value) virtualFocusHook.trigger({ event, scroll })
      else {
        const collection = getCollectionItem()
        const item = collection.find(element => element.dataset.state === 'checked')
        const focus = scroll ? undefined : false
        if (item) changeHighlight(item, scroll, focus)
        else if (collection.length) changeHighlight(collection[0]!, scroll, focus)
      }
    }

    let hasHighlightedOnMount = false

    watch(
      modelValue,
      () => {
        if (!isUserAction.value) {
          const scroll = hasHighlightedOnMount
          hasHighlightedOnMount = true
          void nextTick(() => {
            void highlightSelected(undefined, scroll)
          })
        }
      },
      { immediate: true, deep: true },
    )

    expose({
      highlightedElement,
      highlightItem,
      highlightFirstItem,
      highlightSelected,
      getItems,
    })

    provideListboxRootContext({
      modelValue,
      onValueChange,
      multiple,
      orientation,
      dir,
      disabled,
      highlightOnHover,
      highlightedElement,
      isVirtual,
      virtualFocusHook,
      virtualKeydownHook,
      virtualHighlightHook,
      by: props.by,
      firstValue,
      selectionBehavior,
      focusable,
      onLeave,
      onEnter,
      changeHighlight,
      onKeydownEnter,
      onKeydownNavigation,
      onKeydownTypeAhead,
      onCompositionStart,
      onCompositionEnd,
      highlightFirstItem,
    })

    const onFocusout = async (event: FocusEvent) => {
      const target = (event.relatedTarget || event.target) as HTMLElement | null
      await nextTick()
      if (
        highlightedElement.value &&
        currentElement.value &&
        !currentElement.value.contains(target)
      )
        onLeave(event)
    }

    return () =>
      h(
        Primitive,
        {
          ref: primitiveElement,
          as: props.as,
          'as-child': props.asChild,
          dir: dir.value,
          'data-disabled': disabled.value ? '' : undefined,
          onPointerleave: onLeave,
          onFocusout,
        },
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', { modelValue: modelValue.value }),
            isFormControl.value && props.name
              ? h(VisuallyHiddenInput, {
                  key: 0,
                  name: props.name,
                  value: modelValue.value,
                  disabled: disabled.value,
                  required: props.required,
                })
              : createCommentVNode('v-if', true),
          ]),
        },
      )
  },
})
