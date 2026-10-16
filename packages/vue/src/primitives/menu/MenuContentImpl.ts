import {
  defineComponent,
  h,
  onUnmounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type Component,
  type Ref,
} from 'vue'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import { createTypeahead } from '../../../../shared/src/primitives/listbox'
import {
  FIRST_LAST_KEYS,
  getOpenState,
  isMouseEvent,
  isPointerInGraceArea,
  LAST_KEYS,
  type GraceIntent,
  type GraceSide,
} from '../../../../shared/src/primitives/menu'
import { focusFirstCandidate } from '../../../../shared/src/primitives/roving-focus'
import { PopperContent, popperContentProps } from '../popper'
import { RovingFocusGroup } from '../roving-focus'
import { DismissableLayer, FocusScope, useBodyScrollLock, useFocusGuards } from '../utils/layers'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectMenuContext, injectMenuRootContext, provideMenuContentContext } from './context'

const ITEM_ATTRIBUTE = '[data-reka-collection-item]:not([data-disabled])'

export const menuContentEmits = [
  'escapeKeyDown',
  'pointerDownOutside',
  'focusOutside',
  'interactOutside',
  'entryFocus',
  'openAutoFocus',
  'closeAutoFocus',
]

export const menuContentImplProps = {
  loop: { type: Boolean, required: false },
  disableOutsidePointerEvents: { type: Boolean, required: false },
  disableOutsideScroll: { type: Boolean, required: false },
  trapFocus: { type: Boolean, required: false },
  ...popperContentProps,
} as const

export const MenuContentImpl = defineComponent({
  name: 'MenuContentImpl',
  props: menuContentImplProps,
  emits: [...menuContentEmits, 'dismiss'],
  setup(props, { emit, slots }) {
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    const { trapFocus, disableOutsidePointerEvents, loop } = toRefs(props)

    useFocusGuards()
    useBodyScrollLock(disableOutsidePointerEvents.value)

    const searchRef = ref('')
    const timerRef = ref(0)
    const pointerGraceTimerRef = ref(0)
    const pointerGraceIntentRef = ref<GraceIntent | null>(null)
    const pointerDirRef = ref<GraceSide>('right')
    const lastPointerXRef = ref(0)
    const currentItemId = ref<string | null>(null)
    const rovingFocusGroupRef = ref<{
      getItems: () => { ref: HTMLElement; value?: unknown }[]
    }>()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const typeahead = createTypeahead()
    onUnmounted(() => typeahead.dispose())
    const highlightedElement = ref<HTMLElement>()

    function navigationOptions(focus: boolean) {
      return {
        loop: loop.value,
        arrowKeyOptions: 'vertical' as const,
        dir: rootContext?.dir.value,
        focus,
        attributeName: ITEM_ATTRIBUTE,
      }
    }

    function onKeydownNavigation(event: KeyboardEvent) {
      const element = arrowNavigation(
        event,
        (highlightedElement.value || getActiveElement()) as HTMLElement,
        contentElement.value,
        navigationOptions(false),
      )
      if (element) {
        highlightedElement.value = element
        element.scrollIntoView({ block: 'nearest' })
      }
    }

    function onKeydownEnter() {
      highlightedElement.value?.click()
    }

    const filterElement = ref<HTMLElement>()
    const activeSubmenuContext = ref<{
      onOpenChange: (open: boolean) => void
      trigger: Ref<HTMLElement | undefined>
    }>()

    watch(highlightedElement, element => {
      if (
        activeSubmenuContext.value &&
        (element === undefined || element !== activeSubmenuContext.value.trigger.value)
      ) {
        if (element === undefined) return
        activeSubmenuContext.value.onOpenChange(false)
        activeSubmenuContext.value = undefined
      }
    })

    watch(contentElement, element => menuContext!.onContentChange(element))

    onUnmounted(() => window.clearTimeout(timerRef.value))

    function isPointerMovingToSubmenu(event: PointerEvent) {
      const isMovingTowards = pointerDirRef.value === pointerGraceIntentRef.value?.side
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.value?.area)
    }

    function handleMountAutoFocus(event: Event) {
      emit('openAutoFocus', event)
      if (event.defaultPrevented) return
      event.preventDefault()
      contentElement.value?.focus({ preventScroll: true })
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement
      const isKeyDownInside = target.closest('[data-reka-menu-content]') === event.currentTarget
      const isKeyDownInTextField = ['input', 'textarea'].includes(target.tagName.toLowerCase())
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
      const isCharacterKey = event.key.length === 1

      const element = arrowNavigation(
        event,
        getActiveElement() as HTMLElement,
        contentElement.value,
        navigationOptions(true),
      )
      if (element) return element.focus()

      if (event.code === 'Space') return

      const collectionItems = rovingFocusGroupRef.value?.getItems() ?? []

      if (isKeyDownInside) {
        if (event.key === 'Tab' && rootContext.modal.value) event.preventDefault()
        if (!isModifierKey && isCharacterKey && !isKeyDownInTextField)
          typeahead.handle(event.key, collectionItems)
      }

      if (event.target !== contentElement.value) return
      if (!FIRST_LAST_KEYS.includes(event.key)) return
      event.preventDefault()
      const candidateNodes = collectionItems.map(item => item.ref)
      if (LAST_KEYS.includes(event.key)) candidateNodes.reverse()
      focusFirstCandidate(candidateNodes)
    }

    function handleBlur(event: FocusEvent) {
      if (!(event?.currentTarget as HTMLElement | null)?.contains?.(event.target as Node)) {
        window.clearTimeout(timerRef.value)
        searchRef.value = ''
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isMouseEvent(event)) return
      const target = event.target as HTMLElement
      const pointerXHasChanged = lastPointerXRef.value !== event.clientX
      if ((event?.currentTarget as HTMLElement)?.contains(target) && pointerXHasChanged) {
        pointerDirRef.value = event.clientX > lastPointerXRef.value ? 'right' : 'left'
        lastPointerXRef.value = event.clientX
      }
    }

    function handlePointerEnter(event: PointerEvent) {
      if (!isMouseEvent(event)) return
      filterElement.value?.focus()
    }

    provideMenuContentContext({
      onItemEnter: event => isPointerMovingToSubmenu(event),
      onItemLeave: event => {
        if (isPointerMovingToSubmenu(event)) return true
        const isInputFocused = ['INPUT', 'TEXTAREA'].includes(getActiveElement()?.tagName || '')
        if (!isInputFocused) contentElement.value?.focus()
        currentItemId.value = null
        return false
      },
      onTriggerLeave: event => isPointerMovingToSubmenu(event),
      searchRef,
      highlightedElement,
      onKeydownNavigation,
      onKeydownEnter,
      filterElement,
      onFilterElementChange: element => {
        filterElement.value = element
      },
      activeSubmenuContext,
      pointerGraceTimerRef,
      onPointerGraceIntentChange: intent => {
        pointerGraceIntentRef.value = intent
      },
    })

    return () =>
      h(
        FocusScope as Component,
        {
          'as-child': '',
          trapped: trapFocus.value,
          onMountAutoFocus: handleMountAutoFocus,
          onUnmountAutoFocus: (event: Event) => emit('closeAutoFocus', event),
        },
        {
          default: withCtx(() => [
            h(
              DismissableLayer as Component,
              {
                'as-child': '',
                'disable-outside-pointer-events': disableOutsidePointerEvents.value,
                onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
                onPointerDownOutside: (event: Event) => emit('pointerDownOutside', event),
                onFocusOutside: (event: Event) => emit('focusOutside', event),
                onInteractOutside: (event: Event) => emit('interactOutside', event),
                onDismiss: () => emit('dismiss'),
              },
              {
                default: withCtx(() => [
                  h(
                    RovingFocusGroup as Component,
                    {
                      ref: rovingFocusGroupRef,
                      'current-tab-stop-id': currentItemId.value,
                      'onUpdate:currentTabStopId': (value: string | null) =>
                        (currentItemId.value = value),
                      'as-child': '',
                      orientation: 'vertical',
                      dir: rootContext.dir.value,
                      loop: loop.value,
                      onEntryFocus: (event: Event) => {
                        emit('entryFocus', event)
                        if (!rootContext.isUsingKeyboardRef.value) event.preventDefault()
                      },
                    },
                    {
                      default: withCtx(() => [
                        h(
                          PopperContent as Component,
                          {
                            ref: forwardRef,
                            role: 'menu',
                            as: props.as,
                            'as-child': props.asChild,
                            'aria-orientation': 'vertical',
                            'data-reka-menu-content': '',
                            'data-state': getOpenState(menuContext.open.value),
                            dir: rootContext.dir.value,
                            side: props.side,
                            'side-offset': props.sideOffset,
                            align: props.align,
                            'align-offset': props.alignOffset,
                            'avoid-collisions': props.avoidCollisions,
                            'collision-boundary': props.collisionBoundary,
                            'collision-padding': props.collisionPadding,
                            'arrow-padding': props.arrowPadding,
                            'prioritize-position': props.prioritizePosition,
                            'position-strategy': props.positionStrategy,
                            'update-position-strategy': props.updatePositionStrategy,
                            sticky: props.sticky,
                            'hide-when-detached': props.hideWhenDetached,
                            reference: props.reference,
                            onKeydown: handleKeyDown,
                            onBlur: handleBlur,
                            onPointermove: handlePointerMove,
                            onPointerenter: handlePointerEnter,
                          },
                          { default: withCtx(() => [renderSlot(slots, 'default')]) },
                        ),
                      ]),
                    },
                  ),
                ]),
              },
            ),
          ]),
        },
      )
  },
})
