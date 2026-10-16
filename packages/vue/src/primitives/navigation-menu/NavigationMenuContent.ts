import { isClient, reactiveOmit, useResizeObserver } from '@vueuse/core'
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  ref,
  renderSlot,
  Teleport,
  watch,
  watchEffect,
  withCtx,
  type Component,
  type PropType,
} from 'vue'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  EVENT_ROOT_CONTENT_DISMISS,
  focusFirst,
  getMotionAttribute,
  getOpenState,
  getTabbableCandidates,
  getViewportPosition,
  makeContentId,
  makeTriggerId,
  whenMouse,
} from '../../../../shared/src/primitives/navigation-menu'
import { useCollection } from '../collection'
import {
  DismissableLayer,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../dismissable-layer'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { injectNavigationMenuContext, injectNavigationMenuItemContext } from './context'

const contentEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside']

const implProps = {
  disableOutsidePointerEvents: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
} as const

const NavigationMenuContentImpl = defineComponent({
  name: 'NavigationMenuContentImpl',
  props: implProps,
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const { getItems } = useCollection({ key: 'NavigationMenu' })
    const { forwardRef, currentElement } = useForwardExpose()
    const menuContext = injectNavigationMenuContext()
    const itemContext = injectNavigationMenuItemContext()
    const triggerId = makeTriggerId(menuContext.baseId, itemContext.value)
    const contentId = makeContentId(menuContext.baseId, itemContext.value)
    const prevMotionAttributeRef = ref<string | null>(null)

    const motionAttribute = computed(() => {
      const attribute = getMotionAttribute({
        triggers: getItems().map(item => item.ref),
        dir: menuContext.dir.value,
        modelValue: menuContext.modelValue.value,
        previousValue: menuContext.previousValue.value,
        value: itemContext.value,
      })
      if (attribute === undefined) return prevMotionAttributeRef.value
      prevMotionAttributeRef.value = attribute
      return attribute
    })

    function handleFocusOutside(event: FocusOutsideEvent) {
      emit('focusOutside', event)
      emit('interactOutside', event)
      const target = event.detail.originalEvent.target as HTMLElement
      if (target.hasAttribute('data-navigation-menu-trigger')) event.preventDefault()
      if (!event.defaultPrevented) {
        itemContext.onContentFocusOutside()
        const outsideTarget = event.target as HTMLElement
        if (menuContext.rootNavigationMenu?.value?.contains(outsideTarget)) event.preventDefault()
      }
    }

    function handlePointerDownOutside(event: PointerDownOutsideEvent) {
      emit('pointerDownOutside', event)
      if (!event.defaultPrevented) {
        const target = event.target as HTMLElement
        const isTrigger = getItems().some(item => item.ref.contains(target))
        const isRootViewport =
          menuContext.isRootMenu && menuContext.viewport.value?.contains(target)
        if (isTrigger || isRootViewport || !menuContext.isRootMenu) event.preventDefault()
      }
    }

    watchEffect(cleanupFn => {
      const content = currentElement.value
      if (menuContext.isRootMenu && content) {
        const handleClose = () => {
          menuContext.onItemDismiss()
          itemContext.onRootContentClose()
          if (content.contains(getActiveElement())) itemContext.triggerRef.value?.focus()
        }
        content.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose)
        cleanupFn(() => content.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose))
      }
    })

    function handleEscapeKeyDown(event: KeyboardEvent) {
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented) {
        menuContext.onItemDismiss()
        itemContext.triggerRef?.value?.focus()
        itemContext.wasEscapeCloseRef.value = true
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (
        (event.target as HTMLElement).closest('[data-reka-navigation-menu]') !==
        menuContext.rootNavigationMenu.value
      )
        return
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
      const isTabKey = event.key === 'Tab' && !isMetaKey
      const candidates = getTabbableCandidates(event.currentTarget as HTMLElement)
      if (isTabKey) {
        const focusedElement = getActiveElement()
        const index = candidates.findIndex(candidate => candidate === focusedElement)
        const isMovingBackwards = event.shiftKey
        const nextCandidates = isMovingBackwards
          ? candidates.slice(0, index).reverse()
          : candidates.slice(index + 1, candidates.length)
        if (focusFirst(nextCandidates)) event.preventDefault()
        else {
          itemContext.focusProxyRef.value?.focus()
          return
        }
      }
      const newSelectedElement = arrowNavigation(
        event,
        getActiveElement() as HTMLElement | null,
        undefined,
        { itemsArray: candidates, loop: false, enableIgnoredElement: true },
      )
      newSelectedElement?.focus()
    }

    function handleDismiss() {
      if (menuContext.modelValue.value !== itemContext.value) return
      const rootContentDismissEvent = new Event(EVENT_ROOT_CONTENT_DISMISS, {
        bubbles: true,
        cancelable: true,
      })
      currentElement.value?.dispatchEvent(rootContentDismissEvent)
    }

    return () =>
      h(
        DismissableLayer as Component,
        mergeProps(
          {
            id: contentId,
            ref: forwardRef,
            'aria-labelledby': triggerId,
            'data-motion': motionAttribute.value,
            'data-state': getOpenState(menuContext.modelValue.value === itemContext.value),
            'data-orientation': menuContext.orientation,
          },
          props,
          {
            onKeydown: handleKeydown,
            onEscapeKeyDown: handleEscapeKeyDown,
            onPointerDownOutside: handlePointerDownOutside,
            onFocusOutside: handleFocusOutside,
            onDismiss: handleDismiss,
          },
        ),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const NavigationMenuContent = defineComponent({
  name: 'NavigationMenuContent',
  inheritAttrs: false,
  props: { forceMount: { type: Boolean, required: false }, ...implProps },
  emits: contentEmits,
  setup(props, { attrs, emit, slots }) {
    const forwarded = useForwardPropsEmits(
      reactiveOmit(props, 'forceMount'),
      emit as (name: string) => void,
    )
    const { forwardRef } = useForwardExpose()
    const menuContext = injectNavigationMenuContext()
    const itemContext = injectNavigationMenuItemContext()
    const open = computed(() => itemContext.value === menuContext.modelValue.value)
    const isLastActiveValue = computed(() => {
      if (menuContext.viewport.value) {
        if (!menuContext.modelValue.value && menuContext.previousValue.value)
          return menuContext.previousValue.value === itemContext.value
      }
      return false
    })

    return () =>
      h(
        Teleport,
        {
          to: isClient && menuContext.viewport.value ? menuContext.viewport.value : 'body',
          disabled: isClient && menuContext.viewport.value ? !menuContext.viewport.value : true,
        },
        [
          h(
            Presence,
            {
              present: props.forceMount || open.value || isLastActiveValue.value,
              'force-mount': !menuContext.unmountOnHide.value,
            },
            {
              default: withCtx(({ present }: { present: boolean }) => [
                h(
                  NavigationMenuContentImpl as Component,
                  mergeProps(
                    {
                      ref: forwardRef,
                      'data-state': getOpenState(open.value),
                      style: {
                        pointerEvents: !open.value && menuContext.isRootMenu ? 'none' : undefined,
                      },
                    },
                    { ...attrs, ...forwarded.value },
                    {
                      hidden: !present,
                      onPointerenter: () => menuContext.onContentEnter(itemContext.value),
                      onPointerleave: (event: PointerEvent) =>
                        whenMouse(() => menuContext.onContentLeave())(event),
                      onPointerDownOutside: (event: Event) => emit('pointerDownOutside', event),
                      onFocusOutside: (event: Event) => emit('focusOutside', event),
                      onInteractOutside: (event: Event) => emit('interactOutside', event),
                    },
                  ),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              ]),
            },
          ),
        ],
      )
  },
})

export const NavigationMenuViewport = defineComponent({
  name: 'NavigationMenuViewport',
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, required: false },
    align: {
      type: String as PropType<'start' | 'center' | 'end'>,
      required: false,
      default: 'center',
    },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { attrs, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const menuContext = injectNavigationMenuContext()
    const { activeTrigger, rootNavigationMenu, modelValue } = menuContext
    const size = ref<{ width: number; height: number }>()
    const position = ref<{ left: number; top: number }>()
    const open = computed(() => !!menuContext.modelValue.value)

    watch(currentElement, () => {
      menuContext.onViewportChange(currentElement.value)
    })

    const content = ref<HTMLElement>()
    watch(
      [modelValue, open],
      () => {
        nextTick(() => {
          if (!currentElement.value) return
          requestAnimationFrame(() => {
            const element = currentElement.value?.querySelector<HTMLElement>('[data-state=open]')
            content.value = element ?? undefined
          })
        })
      },
      { immediate: true },
    )

    function updatePosition() {
      if (content.value && activeTrigger.value && rootNavigationMenu.value)
        position.value = getViewportPosition(
          rootNavigationMenu.value,
          activeTrigger.value,
          content.value,
          props.align,
        )
    }

    useResizeObserver(content, () => {
      if (content.value) {
        size.value = { width: content.value.offsetWidth, height: content.value.offsetHeight }
        updatePosition()
      }
    })

    useResizeObserver([globalThis.document?.body, rootNavigationMenu], () => {
      updatePosition()
    })

    return () =>
      h(
        Presence,
        {
          present: props.forceMount || open.value,
          'force-mount': !menuContext.unmountOnHide.value,
          onAfterLeave: () => {
            size.value = undefined
            position.value = undefined
          },
        },
        {
          default: withCtx(({ present }: { present: boolean }) => [
            h(
              Primitive,
              mergeProps(attrs, {
                ref: forwardRef,
                as: props.as,
                'as-child': props.asChild,
                'data-state': getOpenState(open.value),
                'data-orientation': menuContext.orientation,
                style: {
                  pointerEvents: !open.value && menuContext.isRootMenu ? 'none' : undefined,
                  ['--reka-navigation-menu-viewport-width']: size.value
                    ? `${size.value?.width}px`
                    : undefined,
                  ['--reka-navigation-menu-viewport-height']: size.value
                    ? `${size.value?.height}px`
                    : undefined,
                  ['--reka-navigation-menu-viewport-left']: position.value
                    ? `${position.value?.left}px`
                    : undefined,
                  ['--reka-navigation-menu-viewport-top']: position.value
                    ? `${position.value?.top}px`
                    : undefined,
                },
                hidden: !present,
                onPointerenter: () => menuContext.onContentEnter(menuContext.modelValue.value),
                onPointerleave: (event: PointerEvent) =>
                  whenMouse(() => menuContext.onContentLeave())(event),
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export type NavigationMenuContentEmits = {
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: PointerDownOutsideEvent]
  focusOutside: [event: FocusOutsideEvent]
  interactOutside: [event: PointerDownOutsideEvent | FocusOutsideEvent]
}

export type NavigationMenuLinkEmits = {
  select: [payload: CustomEvent<{ originalEvent: Event }>]
}
