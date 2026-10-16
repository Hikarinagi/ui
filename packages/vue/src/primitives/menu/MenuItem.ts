import {
  computed,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  nextTick,
  normalizeProps,
  onUnmounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type Component,
  type ComponentPublicInstance,
  type PropType,
  type Ref,
} from 'vue'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  getCheckedState,
  getOpenState,
  isIndeterminate,
  isMouseEvent,
  ITEM_SELECT,
  SELECTION_KEYS,
  SUB_OPEN_KEYS,
  submenuGraceIntent,
  type CheckedState,
  type GraceSide,
} from '../../../../shared/src/primitives/menu'
import { useCollection } from '../collection'
import { PopperAnchor, PopperArrow } from '../popper'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardProps } from '../utils/useForwardProps'
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'
import {
  injectMenuContentContext,
  injectMenuContext,
  injectMenuGroupContext,
  injectMenuItemIndicatorContext,
  injectMenuRadioGroupContext,
  injectMenuRootContext,
  injectMenuSubContext,
  provideMenuGroupContext,
  provideMenuItemIndicatorContext,
  provideMenuRadioGroupContext,
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

const itemProps = {
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  ...primitive(),
} as const

function passThrough(name: string, target: Component, props: Record<string, object>) {
  return defineComponent({
    name,
    props,
    setup(rawProps, { slots }) {
      return () =>
        h(target, normalizeProps(guardReactiveProps(rawProps)), {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        })
    },
  })
}

export const MenuItemImpl = defineComponent({
  name: 'MenuItemImpl',
  inheritAttrs: false,
  props: itemProps,
  setup(props, { slots, attrs }) {
    const contentContext = injectMenuContentContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const { CollectionItem } = useCollection()
    const isFocused = ref(false)
    const isHighlighted = computed(
      () =>
        isFocused.value ||
        (currentElement.value != null &&
          contentContext.highlightedElement.value === currentElement.value),
    )

    async function handlePointerMove(event: PointerEvent) {
      if (event.defaultPrevented || !isMouseEvent(event)) return
      if (props.disabled) contentContext.onItemLeave(event)
      else if (!contentContext.onItemEnter(event)) {
        const item = event.currentTarget as HTMLElement
        contentContext.highlightedElement.value = item
        const isInputFocused = ['INPUT', 'TEXTAREA'].includes(getActiveElement()?.tagName || '')
        if (!isInputFocused) item.focus({ preventScroll: true })
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented) return
      if (!isMouseEvent(event)) return
      if (contentContext.highlightedElement.value !== currentElement.value) return
      const isMovingToSubmenu = contentContext.onItemLeave(event)
      if (!isMovingToSubmenu && contentContext.highlightedElement.value === currentElement.value)
        contentContext.highlightedElement.value = undefined
    }

    const onFocus = async (event: FocusEvent) => {
      await nextTick()
      if (event.defaultPrevented || props.disabled) return
      isFocused.value = true
      contentContext.highlightedElement.value = event.currentTarget as HTMLElement
    }
    const onBlur = async (event: FocusEvent) => {
      await nextTick()
      if (event.defaultPrevented) return
      isFocused.value = false
    }

    return () =>
      h(
        CollectionItem,
        { value: { textValue: props.textValue } },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps({ ref: forwardRef, role: 'menuitem', tabindex: '-1' }, attrs, {
                as: props.as,
                'as-child': props.asChild,
                'aria-disabled': props.disabled || undefined,
                'data-disabled': props.disabled ? '' : undefined,
                'data-highlighted': isHighlighted.value ? '' : undefined,
                onPointermove: handlePointerMove,
                onPointerleave: handlePointerLeave,
                onFocus,
                onBlur,
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const MenuItem = defineComponent({
  name: 'MenuItem',
  props: itemProps,
  emits: ['select'],
  setup(props, { emit, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectMenuRootContext()
    const contentContext = injectMenuContentContext()
    const isPointerDown = ref(false)

    async function handleSelect() {
      const menuItem = currentElement.value
      if (!props.disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true })
        emit('select', itemSelectEvent)
        await nextTick()
        if (itemSelectEvent.defaultPrevented) isPointerDown.value = false
        else rootContext.onClose()
      }
    }

    return () =>
      h(
        MenuItemImpl as Component,
        mergeProps(props, {
          ref: forwardRef,
          onClick: handleSelect,
          onPointerdown: () => {
            isPointerDown.value = true
          },
          onPointerup: async (event: PointerEvent) => {
            await nextTick()
            if (event.defaultPrevented) return
            if (!isPointerDown.value) (event.currentTarget as HTMLElement)?.click()
          },
          onKeydown: async (event: KeyboardEvent) => {
            const isTypingAhead = contentContext.searchRef.value !== ''
            if (props.disabled || (isTypingAhead && event.key === ' ')) return
            if (SELECTION_KEYS.includes(event.key)) {
              ;(event.currentTarget as HTMLElement)?.click()
              event.preventDefault()
            }
          },
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const MenuCheckboxItem = defineComponent({
  name: 'MenuCheckboxItem',
  props: {
    modelValue: {
      type: [Boolean, String] as PropType<CheckedState>,
      required: false,
      default: false,
    },
    ...itemProps,
  },
  emits: ['select', 'update:modelValue'],
  setup(props, { emit, slots }) {
    const forwarded = useForwardProps(
      computed(() => {
        const { modelValue: _, ...rest } = props
        return rest
      }),
    )
    const modelValue = useVModel(props, 'modelValue', emit) as Ref<CheckedState>
    provideMenuItemIndicatorContext({ modelValue })
    return () =>
      h(
        MenuItem as Component,
        mergeProps({ role: 'menuitemcheckbox' }, forwarded.value, {
          'aria-checked': isIndeterminate(modelValue.value) ? 'mixed' : modelValue.value,
          'data-state': getCheckedState(modelValue.value),
          onSelect: async (event: Event) => {
            emit('select', event)
            if (isIndeterminate(modelValue.value)) modelValue.value = true
            else modelValue.value = !modelValue.value
          },
        }),
        {
          default: withCtx(() => [renderSlot(slots, 'default', { modelValue: modelValue.value })]),
        },
      )
  },
})

export const MenuGroup = defineComponent({
  name: 'MenuGroup',
  props: primitive(),
  setup(props, { slots }) {
    const id = useId(undefined, 'reka-menu-group')
    provideMenuGroupContext({ id })
    return () =>
      h(Primitive, mergeProps({ role: 'group' }, props, { 'aria-labelledby': id }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const MenuRadioGroup = defineComponent({
  name: 'MenuRadioGroup',
  props: { modelValue: { type: null, required: false, default: '' }, ...primitive() },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const forwarded = useForwardProps(
      computed(() => {
        const { modelValue: _, ...rest } = props
        return rest
      }),
    )
    const modelValue = useVModel(props, 'modelValue', emit) as Ref<unknown>
    provideMenuRadioGroupContext({
      modelValue,
      onValueChange: payload => {
        modelValue.value = payload
      },
    })
    return () =>
      h(MenuGroup as Component, normalizeProps(guardReactiveProps(forwarded.value)), {
        default: withCtx(() => [renderSlot(slots, 'default', { modelValue: modelValue.value })]),
      })
  },
})

export const MenuRadioItem = defineComponent({
  name: 'MenuRadioItem',
  props: { value: { type: null, required: true }, ...itemProps },
  emits: ['select'],
  setup(props, { emit, slots }) {
    const forwarded = useForwardProps(
      computed(() => {
        const { value: _, ...rest } = props
        return rest
      }),
    )
    const { value } = toRefs(props)
    const radioGroupContext = injectMenuRadioGroupContext()
    const modelValue = computed(() => radioGroupContext.modelValue.value === value?.value)
    provideMenuItemIndicatorContext({ modelValue })
    return () =>
      h(
        MenuItem as Component,
        mergeProps({ role: 'menuitemradio' }, forwarded.value, {
          'aria-checked': modelValue.value,
          'data-state': getCheckedState(modelValue.value),
          onSelect: async (event: Event) => {
            emit('select', event)
            radioGroupContext.onValueChange(value.value)
          },
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const MenuItemIndicator = defineComponent({
  name: 'MenuItemIndicator',
  props: { forceMount: { type: Boolean, required: false }, ...primitive('span') },
  setup(props, { slots }) {
    const indicatorContext = injectMenuItemIndicatorContext({ modelValue: ref(false) })
    return () =>
      h(
        Presence,
        {
          present:
            props.forceMount ||
            isIndeterminate(indicatorContext.modelValue.value) ||
            indicatorContext.modelValue.value === true,
        },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                as: props.as,
                'as-child': props.asChild,
                'data-state': getCheckedState(indicatorContext.modelValue.value),
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const MenuLabel = defineComponent({
  name: 'MenuLabel',
  props: primitive('div'),
  setup(props, { slots }) {
    const groupContext = injectMenuGroupContext({ id: '' })
    return () =>
      h(Primitive, mergeProps(props, { id: groupContext.id || undefined }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const MenuSeparator = defineComponent({
  name: 'MenuSeparator',
  props: primitive(),
  setup(props, { slots }) {
    return () =>
      h(Primitive, mergeProps(props, { role: 'separator', 'aria-orientation': 'horizontal' }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const MenuAnchor = passThrough('MenuAnchor', PopperAnchor as Component, {
  reference: { type: null, required: false },
  ...primitive(),
})

export const MenuArrow = passThrough('MenuArrow', PopperArrow as Component, {
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  rounded: { type: Boolean, required: false },
  ...primitive(),
})

export const MenuPortal = passThrough('MenuPortal', Teleport as Component, {
  to: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  defer: { type: Boolean, required: false },
  forceMount: { type: Boolean, required: false },
})

export const MenuSubTrigger = defineComponent({
  name: 'MenuSubTrigger',
  props: itemProps,
  setup(props, { slots }) {
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    const subContext = injectMenuSubContext()
    const contentContext = injectMenuContentContext()

    watch(menuContext.open, open => {
      if (open)
        contentContext.activeSubmenuContext.value = {
          onOpenChange: menuContext.onOpenChange,
          trigger: subContext.trigger,
        }
      else if (
        contentContext.activeSubmenuContext.value?.trigger.value === subContext.trigger.value
      )
        contentContext.activeSubmenuContext.value = undefined
    })

    const openTimer = ref<number | null>(null)
    subContext.triggerId ||= useId(undefined, 'reka-menu-sub-trigger')

    function clearOpenTimer() {
      if (openTimer.value) window.clearTimeout(openTimer.value)
      openTimer.value = null
    }
    onUnmounted(() => clearOpenTimer())

    function handlePointerMove(event: PointerEvent) {
      if (!isMouseEvent(event)) return
      if (contentContext.onItemEnter(event)) return
      if (!props.disabled && !menuContext.open.value && !openTimer.value) {
        contentContext.onPointerGraceIntentChange(null)
        openTimer.value = window.setTimeout(() => {
          menuContext.onOpenChange(true)
          clearOpenTimer()
        }, 100)
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      if (!isMouseEvent(event)) return
      clearOpenTimer()
      const contentRect = menuContext.content.value?.getBoundingClientRect()
      if (contentRect?.width) {
        const side = menuContext.content.value?.dataset.side as GraceSide
        contentContext.onPointerGraceIntentChange(submenuGraceIntent(event, contentRect, side))
        window.clearTimeout(contentContext.pointerGraceTimerRef.value)
        contentContext.pointerGraceTimerRef.value = window.setTimeout(
          () => contentContext.onPointerGraceIntentChange(null),
          300,
        )
      } else {
        if (contentContext.onTriggerLeave(event)) return
        contentContext.onPointerGraceIntentChange(null)
      }
    }

    async function handleKeyDown(event: KeyboardEvent) {
      const isTypingAhead = contentContext.searchRef.value !== ''
      if (props.disabled || (isTypingAhead && event.key === ' ')) return
      if (SUB_OPEN_KEYS[rootContext.dir.value].includes(event.key)) {
        menuContext.onOpenChange(true)
        await nextTick()
        menuContext.content.value?.focus()
        event.preventDefault()
      }
    }

    return () =>
      h(
        MenuAnchor as Component,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h(
              MenuItemImpl as Component,
              mergeProps(props, {
                id: subContext.triggerId,
                ref: (vnode: Element | ComponentPublicInstance | null) => {
                  if (!vnode) return undefined
                  subContext?.onTriggerChange((vnode as ComponentPublicInstance)?.$el)
                  return undefined
                },
                'aria-haspopup': 'menu',
                'aria-expanded': menuContext.open.value,
                'aria-controls': subContext.contentId,
                'data-state': getOpenState(menuContext.open.value),
                onClick: async (event: MouseEvent) => {
                  if (props.disabled || event.defaultPrevented) return
                  ;(event.currentTarget as HTMLElement)?.focus()
                  if (!menuContext.open.value) menuContext.onOpenChange(true)
                },
                onPointermove: handlePointerMove,
                onPointerleave: handlePointerLeave,
                onKeydown: handleKeyDown,
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
