import { unrefElement } from '@vueuse/core'
import {
  computed,
  createCommentVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  Teleport,
  watch,
  watchEffect,
  withCtx,
  withModifiers,
  type Component,
  type ComponentPublicInstance,
  type PropType,
} from 'vue'
import { createTypeahead, valueComparator } from '../../../../shared/src/primitives/listbox'
import { focusFirstCandidate } from '../../../../shared/src/primitives/roving-focus'
import {
  CONTENT_MARGIN,
  createSelectedItemTracker,
  selectNavigationCandidates,
  trackTriggerRelease,
} from '../../../../shared/src/primitives/select'
import { useCollection } from '../collection'
import { PopperContent, popperContentProps } from '../popper'
import { Presence } from '../presence'
import type { PrimitiveProps } from '../primitive'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { DismissableLayer, FocusScope, useBodyScrollLock, useFocusGuards } from '../utils/layers'
import type { Direction } from '../utils/useDirection'
import { useForwardProps } from '../utils/useForwardProps'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useHideOthers } from '../utils/useHideOthers'
import {
  injectSelectRootContext,
  provideSelectContentContext,
  provideSelectRootContext,
  SelectContentDefaultContextValue,
  type SelectRootContext,
} from './context'

const contentEmits = ['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside']

const positionProps = {
  ...propsWithoutDefaults(popperContentProps),
  align: { type: null as unknown as PropType<'start' | 'center' | 'end'>, required: false },
  dir: { type: String as PropType<Direction>, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
}

const SelectPopperPosition = defineComponent({
  name: 'SelectPopperPosition',
  props: {
    ...positionProps,
    align: { ...positionProps.align, default: 'start' },
    collisionPadding: {
      type: [Number, Object] as PropType<number | Partial<Record<string, number>>>,
      required: false,
      default: CONTENT_MARGIN,
    },
  },
  setup(props, { slots }) {
    const forwarded = useForwardProps(props)
    return () =>
      h(
        PopperContent as Component,
        mergeProps(forwarded.value, {
          style: {
            boxSizing: 'border-box',
            '--reka-select-content-transform-origin': 'var(--reka-popper-transform-origin)',
            '--reka-select-content-available-width': 'var(--reka-popper-available-width)',
            '--reka-select-content-available-height': 'var(--reka-popper-available-height)',
            '--reka-select-trigger-width': 'var(--reka-popper-anchor-width)',
            '--reka-select-trigger-height': 'var(--reka-popper-anchor-height)',
          },
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

const implProps = {
  position: { type: String as PropType<'popper'>, required: false, default: 'popper' },
  bodyLock: { type: Boolean, required: false, default: true },
  ...positionProps,
  align: { ...positionProps.align, default: 'start' },
  disableOutsidePointerEvents: { type: Boolean, required: false, default: true },
}

const SelectContentImpl = defineComponent({
  name: 'SelectContentImpl',
  props: implProps,
  emits: contentEmits,
  setup(props, { attrs, emit, slots }) {
    const rootContext = injectSelectRootContext()
    useFocusGuards()
    useBodyScrollLock(props.bodyLock)
    const { CollectionSlot, getItems } = useCollection()
    const content = ref<HTMLElement>()
    useHideOthers(content)
    const typeahead = createTypeahead()
    onUnmounted(() => typeahead.dispose())
    const viewport = ref<HTMLElement>()
    const selectedItem = ref<HTMLElement>()
    const selectedItemText = ref<HTMLElement>()
    const isPositioned = ref(false)
    const tracker = createSelectedItemTracker()

    function focusSelectedItem() {
      if (selectedItem.value && content.value)
        focusFirstCandidate([selectedItem.value, content.value])
    }

    watch(isPositioned, () => {
      focusSelectedItem()
    })

    const { onOpenChange, triggerPointerDownPosRef } = rootContext
    watchEffect(cleanupFn => {
      if (!content.value) return
      cleanupFn(
        trackTriggerRelease({
          content: content.value,
          origin: () => triggerPointerDownPosRef.value,
          onOutsideRelease: () => onOpenChange(false),
          onRelease: () => {
            triggerPointerDownPosRef.value = null
          },
        }),
      )
    })

    function handleKeyDown(event: KeyboardEvent) {
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
      if (event.key === 'Tab') event.preventDefault()
      if (!isModifierKey && event.key.length === 1) typeahead.handle(event.key, getItems())
      const candidateNodes = selectNavigationCandidates(
        getItems().map(item => item.ref),
        event.key,
        event.target,
      )
      if (candidateNodes) {
        setTimeout(() => focusFirstCandidate(candidateNodes))
        event.preventDefault()
      }
    }

    const forwardedProps = useForwardProps(props)

    provideSelectContentContext({
      content,
      viewport,
      onViewportChange: node => {
        viewport.value = node
      },
      itemRefCallback: (node, value, disabled) => {
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by)
        if (tracker.item(isSelectedItem, disabled, rootContext.multiple.value))
          selectedItem.value = node
      },
      selectedItem,
      selectedItemText,
      onItemLeave: () => {
        content.value?.focus()
      },
      itemTextRefCallback: (node, value, disabled) => {
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by)
        if (tracker.text(isSelectedItem, disabled)) selectedItemText.value = node
      },
      focusSelectedItem,
      position: props.position,
      isPositioned,
      searchRef: typeahead,
    })

    function contentRef(node: Element | ComponentPublicInstance | null) {
      if (!node) return undefined
      const element = unrefElement(node as HTMLElement) as HTMLElement | undefined
      if (element?.hasAttribute('data-reka-popper-content-wrapper'))
        content.value = element.firstElementChild as HTMLElement
      else content.value = element
      return undefined
    }

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            FocusScope as Component,
            {
              'as-child': '',
              onMountAutoFocus: withModifiers(() => {}, ['prevent']),
              onUnmountAutoFocus: (event: Event) => {
                emit('closeAutoFocus', event)
                if (event.defaultPrevented) return
                rootContext.triggerElement.value?.focus({ preventScroll: true })
                event.preventDefault()
              },
            },
            {
              default: withCtx(() => [
                h(
                  DismissableLayer as Component,
                  {
                    'as-child': '',
                    'disable-outside-pointer-events': props.disableOutsidePointerEvents,
                    onFocusOutside: withModifiers(() => {}, ['prevent']),
                    onDismiss: () => rootContext.onOpenChange(false),
                    onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
                    onPointerDownOutside: (event: Event) => emit('pointerDownOutside', event),
                  },
                  {
                    default: withCtx(() => [
                      h(
                        SelectPopperPosition as Component,
                        mergeProps(
                          { ...attrs, ...forwardedProps.value },
                          {
                            id: rootContext.contentId,
                            ref: contentRef,
                            role: 'listbox',
                            'data-state': rootContext.open.value ? 'open' : 'closed',
                            dir: rootContext.dir.value,
                            style: { display: 'flex', flexDirection: 'column', outline: 'none' },
                            onContextmenu: withModifiers(() => {}, ['prevent']),
                            onPlaced: () => (isPositioned.value = true),
                            onKeydown: handleKeyDown,
                          },
                        ),
                        { default: withCtx(() => [renderSlot(slots, 'default')]) },
                      ),
                    ]),
                  },
                ),
              ]),
            },
          ),
        ]),
      })
  },
})

const SelectProvider = defineComponent({
  name: 'SelectProvider',
  inheritAttrs: false,
  props: { context: { type: Object as PropType<SelectRootContext>, required: true } },
  setup(props, { slots }) {
    provideSelectRootContext(props.context)
    provideSelectContentContext(SelectContentDefaultContextValue)
    return () => renderSlot(slots, 'default')
  },
})

const { position: _position, bodyLock: _bodyLock, ...implTypeProps } = implProps

export const SelectContent = defineComponent({
  name: 'SelectContent',
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, required: false },
    position: { type: String as PropType<'popper'>, required: false },
    bodyLock: { type: Boolean, required: false },
    ...propsWithoutDefaults(implTypeProps),
  },
  emits: contentEmits,
  setup(props, { attrs, emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const rootContext = injectSelectRootContext()
    const fragment = ref<DocumentFragment>()
    onMounted(() => {
      fragment.value = new DocumentFragment()
    })
    const presenceRef = ref<{ present?: boolean }>()
    const present = computed(() => props.forceMount || rootContext.open.value)
    const renderPresence = ref(present.value)
    let renderPresenceTimeout: ReturnType<typeof setTimeout> | undefined

    function clearRenderPresenceTimeout() {
      if (renderPresenceTimeout) {
        clearTimeout(renderPresenceTimeout)
        renderPresenceTimeout = undefined
      }
    }

    watch(present, (_value, _oldValue, onCleanup) => {
      clearRenderPresenceTimeout()
      renderPresenceTimeout = setTimeout(() => {
        renderPresence.value = present.value
        renderPresenceTimeout = undefined
      })
      onCleanup(clearRenderPresenceTimeout)
    })
    onUnmounted(clearRenderPresenceTimeout)

    return () =>
      present.value || renderPresence.value || presenceRef.value?.present
        ? h(
            Presence,
            { key: 0, ref: presenceRef, present: present.value },
            {
              default: withCtx(() => [
                h(
                  SelectContentImpl as Component,
                  normalizeProps(guardReactiveProps({ ...forwarded.value, ...attrs })),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              ]),
            },
          )
        : fragment.value
          ? h('div', { key: 1 }, [
              h(Teleport, { to: fragment.value as unknown as HTMLElement }, [
                h(
                  SelectProvider,
                  { context: rootContext },
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              ]),
            ])
          : createCommentVNode('v-if', true)
  },
})
