import { refAutoReset, unrefElement, useResizeObserver } from '@vueuse/core'
import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  onMounted,
  ref,
  renderSlot,
  Teleport,
  watchEffect,
  withCtx,
  withKeys,
  type Component,
  type ComponentPublicInstance,
  type PropType,
  type Ref,
} from 'vue'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  EVENT_ROOT_CONTENT_DISMISS,
  focusFirst,
  getOpenState,
  getTabbableCandidates,
  LINK_SELECT,
  makeContentId,
  makeTriggerId,
  removeFromTabOrder,
} from '../../../../shared/src/primitives/navigation-menu'
import { useCollection } from '../collection'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { VisuallyHidden } from '../visually-hidden'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import {
  injectNavigationMenuContext,
  injectNavigationMenuItemContext,
  provideNavigationMenuItemContext,
} from './context'

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

export const NavigationMenuList = defineComponent({
  name: 'NavigationMenuList',
  inheritAttrs: false,
  props: primitive('ul'),
  setup(props, { attrs, slots }) {
    const menuContext = injectNavigationMenuContext()
    const { forwardRef, currentElement } = useForwardExpose()
    onMounted(() => {
      menuContext.onIndicatorTrackChange(currentElement.value)
    })
    return () =>
      h(
        Primitive,
        { ref: forwardRef, style: { position: 'relative' } },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(attrs, {
                'as-child': props.asChild,
                as: props.as,
                'data-orientation': menuContext.orientation,
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const NavigationMenuItem = defineComponent({
  name: 'NavigationMenuItem',
  props: { value: { type: String, required: false }, ...primitive('li') },
  setup(props, { slots }) {
    useForwardExpose()
    const { getItems } = useCollection({ key: 'NavigationMenu' })
    const context = injectNavigationMenuContext()
    const value = useId(props.value)
    const triggerRef = ref<HTMLElement>()
    const focusProxyRef = ref<HTMLElement>()
    const contentId = makeContentId(context.baseId, value)
    let restoreContentTabOrderRef: () => unknown = () => ({})
    const wasEscapeCloseRef = ref(false)

    async function handleContentEntry(side: 'start' | 'end' = 'start') {
      const element = document.getElementById(contentId)
      if (element) {
        restoreContentTabOrderRef()
        const candidates = getTabbableCandidates(element)
        if (candidates.length) focusFirst(side === 'start' ? candidates : candidates.reverse())
      }
    }

    function handleContentExit() {
      const element = document.getElementById(contentId)
      if (element) {
        const candidates = getTabbableCandidates(element)
        if (candidates.length) restoreContentTabOrderRef = removeFromTabOrder(candidates)
      }
    }

    provideNavigationMenuItemContext({
      value,
      contentId,
      triggerRef,
      focusProxyRef,
      wasEscapeCloseRef,
      onEntryKeyDown: handleContentEntry,
      onFocusProxyEnter: handleContentEntry,
      onContentFocusOutside: handleContentExit,
      onRootContentClose: handleContentExit,
    })

    function handleClose() {
      context.onItemDismiss()
      triggerRef.value?.focus()
    }

    function handleKeydown(event: KeyboardEvent) {
      const currentFocus = getActiveElement() as HTMLElement | null
      if (event.keyCode === 32 || event.key === 'Enter') {
        if (context.modelValue.value === value) {
          handleClose()
          event.preventDefault()
          return
        }
        ;(event.target as HTMLElement).click()
        event.preventDefault()
        return
      }
      const itemsArray = getItems()
        .filter(item => item.ref.parentElement?.hasAttribute('data-menu-item'))
        .map(item => item.ref)
      if (!currentFocus || !itemsArray.includes(currentFocus)) return
      const newSelectedElement = arrowNavigation(event, currentFocus, undefined, {
        itemsArray,
        loop: false,
      })
      if (newSelectedElement) newSelectedElement?.focus()
      event.preventDefault()
      event.stopPropagation()
    }

    return () =>
      h(
        Primitive,
        {
          'as-child': props.asChild,
          as: props.as,
          'data-menu-item': '',
          onKeydown: withKeys(handleKeydown as (event: Event) => void, [
            'up',
            'down',
            'left',
            'right',
            'home',
            'end',
            'space',
          ]),
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const NavigationMenuTrigger = defineComponent({
  name: 'NavigationMenuTrigger',
  inheritAttrs: false,
  props: { disabled: { type: Boolean, required: false }, ...primitive('button') },
  setup(props, { attrs, slots }) {
    const menuContext = injectNavigationMenuContext()
    const itemContext = injectNavigationMenuItemContext()
    const { CollectionItem } = useCollection({ key: 'NavigationMenu' })
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const triggerId = ref('')
    const contentId = ref('')
    const hasPointerMoveOpenedRef = refAutoReset(false, 300)
    const wasClickCloseRef = ref(false)
    const open = computed(() => itemContext.value === menuContext.modelValue.value)

    onMounted(() => {
      itemContext.triggerRef = triggerElement as Ref<HTMLElement | undefined>
      triggerId.value = makeTriggerId(menuContext.baseId, itemContext.value)
      contentId.value = makeContentId(menuContext.baseId, itemContext.value)
    })

    function handlePointerEnter() {
      if (menuContext.disableHoverTrigger.value) return
      wasClickCloseRef.value = false
      itemContext.wasEscapeCloseRef.value = false
    }

    function handlePointerMove(event: PointerEvent) {
      if (menuContext.disableHoverTrigger.value) return
      if (event.pointerType === 'mouse') {
        if (
          props.disabled ||
          wasClickCloseRef.value ||
          itemContext.wasEscapeCloseRef.value ||
          hasPointerMoveOpenedRef.value
        )
          return
        menuContext.onTriggerEnter(itemContext.value)
        hasPointerMoveOpenedRef.value = true
      }
    }

    function handlePointerLeave(event: PointerEvent) {
      if (menuContext.disableHoverTrigger.value) return
      if (event.pointerType === 'mouse') {
        if (props.disabled) return
        menuContext.onTriggerLeave()
        hasPointerMoveOpenedRef.value = false
      }
    }

    function handleClick(event: MouseEvent | PointerEvent) {
      if (
        (!('pointerType' in event) || event.pointerType === 'mouse') &&
        menuContext.disableClickTrigger.value
      )
        return
      if (hasPointerMoveOpenedRef.value) return
      if (open.value) menuContext.onItemSelect('')
      else menuContext.onItemSelect(itemContext.value)
      wasClickCloseRef.value = open.value
    }

    function handleKeydown(event: KeyboardEvent) {
      const verticalEntryKey = menuContext.dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const entryKey = { horizontal: 'ArrowDown', vertical: verticalEntryKey }[
        menuContext.orientation
      ]
      if (open.value && event.key === entryKey) {
        itemContext.onEntryKeyDown()
        event.preventDefault()
        event.stopPropagation()
      }
    }

    function setFocusProxyRef(node: Element | ComponentPublicInstance | null) {
      if (!node) return undefined
      itemContext.focusProxyRef.value = unrefElement(node as HTMLElement) as HTMLElement
      return undefined
    }

    function handleVisuallyHiddenFocus(event: FocusEvent) {
      const content = document.getElementById(itemContext.contentId)
      const prevFocusedElement = event.relatedTarget as HTMLElement | null
      const wasTriggerFocused = prevFocusedElement === triggerElement.value
      const wasFocusFromContent = content?.contains(prevFocusedElement)
      if (wasTriggerFocused || !wasFocusFromContent)
        itemContext.onFocusProxyEnter(wasTriggerFocused ? 'start' : 'end')
    }

    return () =>
      h(Fragment, null, [
        h(CollectionItem, null, {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(
                {
                  id: triggerId.value,
                  ref: forwardRef,
                  disabled: props.disabled,
                  'data-disabled': props.disabled ? '' : undefined,
                  'data-state': getOpenState(open.value),
                  'data-navigation-menu-trigger': '',
                  'aria-expanded': open.value,
                  'aria-controls': contentId.value,
                  'as-child': props.asChild,
                  as: props.as,
                },
                attrs,
                {
                  onPointerenter: handlePointerEnter,
                  onPointermove: handlePointerMove,
                  onPointerleave: handlePointerLeave,
                  onClick: handleClick,
                  onKeydown: handleKeydown,
                },
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        }),
        open.value
          ? h(Fragment, { key: 0 }, [
              h(VisuallyHidden as Component, {
                ref: setFocusProxyRef,
                'aria-hidden': 'true',
                tabindex: 0,
                onFocus: handleVisuallyHiddenFocus,
              }),
              menuContext.viewport
                ? h('span', { key: 0, 'aria-owns': contentId.value })
                : createCommentVNode('v-if', true),
            ])
          : createCommentVNode('v-if', true),
      ])
  },
})

export const NavigationMenuLink = defineComponent({
  name: 'NavigationMenuLink',
  props: { active: { type: Boolean, required: false }, ...primitive('a') },
  emits: ['select'],
  setup(props, { emit, slots }) {
    const { CollectionItem } = useCollection({ key: 'NavigationMenu' })
    useForwardExpose()

    async function handleClick(event: MouseEvent) {
      const linkSelectEvent = new CustomEvent(LINK_SELECT, {
        bubbles: true,
        cancelable: true,
        detail: { originalEvent: event },
      })
      emit('select', linkSelectEvent)
      if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
        const rootContentDismissEvent = new CustomEvent(EVENT_ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true,
        })
        event.target?.dispatchEvent(rootContentDismissEvent)
      }
    }

    return () =>
      h(CollectionItem, null, {
        default: withCtx(() => [
          h(
            Primitive,
            {
              as: props.as,
              'data-active': props.active ? '' : undefined,
              'aria-current': props.active ? 'page' : undefined,
              'as-child': props.asChild,
              onClick: handleClick,
            },
            { default: withCtx(() => [renderSlot(slots, 'default')]) },
          ),
        ]),
      })
  },
})

export const NavigationMenuIndicator = defineComponent({
  name: 'NavigationMenuIndicator',
  inheritAttrs: false,
  props: { forceMount: { type: Boolean, required: false }, ...primitive() },
  setup(props, { attrs, slots }) {
    const { forwardRef } = useForwardExpose()
    const menuContext = injectNavigationMenuContext()
    const indicatorStyle = ref<{ size: number; position: number }>()
    const isHorizontal = computed(() => menuContext.orientation === 'horizontal')
    const isVisible = computed(() => !!menuContext.modelValue.value)
    const { activeTrigger } = menuContext

    function handlePositionChange() {
      if (!activeTrigger.value) return
      indicatorStyle.value = {
        size: isHorizontal.value
          ? activeTrigger.value.offsetWidth
          : activeTrigger.value.offsetHeight,
        position: isHorizontal.value
          ? activeTrigger.value.offsetLeft
          : activeTrigger.value.offsetTop,
      }
    }

    watchEffect(() => {
      if (!menuContext.modelValue.value) return
      handlePositionChange()
    })

    useResizeObserver(activeTrigger, handlePositionChange)
    useResizeObserver(menuContext.indicatorTrack, handlePositionChange)

    return () =>
      menuContext.indicatorTrack.value
        ? h(Teleport, { key: 0, to: menuContext.indicatorTrack.value }, [
            h(
              Presence,
              { present: props.forceMount || isVisible.value },
              {
                default: withCtx(() => [
                  h(
                    Primitive,
                    mergeProps(
                      {
                        ref: forwardRef,
                        'aria-hidden': 'true',
                        'data-state': isVisible.value ? 'visible' : 'hidden',
                        'data-orientation': menuContext.orientation,
                        'as-child': props.asChild,
                        as: props.as,
                        style: {
                          ...(indicatorStyle.value
                            ? {
                                '--reka-navigation-menu-indicator-size': `${indicatorStyle.value.size}px`,
                                '--reka-navigation-menu-indicator-position': `${indicatorStyle.value.position}px`,
                              }
                            : {}),
                        },
                      },
                      attrs,
                    ),
                    { default: withCtx(() => [renderSlot(slots, 'default')]) },
                  ),
                ]),
              },
            ),
          ])
        : createCommentVNode('v-if', true)
  },
})
