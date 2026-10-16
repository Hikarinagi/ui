import {
  computed,
  createVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  nextTick,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import {
  MenuAnchor,
  MenuArrow,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIndicator,
  MenuLabel,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  menuSubContentProps,
  MenuSubTrigger,
} from '../menu'
import { wrapMenuPart } from '../menu/wrap'
import { Primitive, type PrimitiveProps } from '../primitive'
import { createContext } from '../utils/createContext'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useVModel } from '../utils/useVModel'

export interface ContextMenuRootContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  modal: Ref<boolean>
  dir: Ref<Direction>
  triggerElement: Ref<HTMLElement | undefined>
  pressOpenDelay: Ref<number>
}

export const [injectContextMenuRootContext, provideContextMenuRootContext] =
  createContext<ContextMenuRootContext>('ContextMenuRoot')

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

const contentEmits = [
  'escapeKeyDown',
  'pointerDownOutside',
  'focusOutside',
  'interactOutside',
  'closeAutoFocus',
]

function contentStyle() {
  return {
    '--reka-context-menu-content-transform-origin': 'var(--reka-popper-transform-origin)',
    '--reka-context-menu-content-available-width': 'var(--reka-popper-available-width)',
    '--reka-context-menu-content-available-height': 'var(--reka-popper-available-height)',
    '--reka-context-menu-trigger-width': 'var(--reka-popper-anchor-width)',
    '--reka-context-menu-trigger-height': 'var(--reka-popper-anchor-height)',
  }
}

function isTouchOrPen(event: PointerEvent) {
  return event.pointerType !== 'mouse'
}

export const ContextMenuRoot = defineComponent({
  name: 'ContextMenuRoot',
  inheritAttrs: false,
  props: {
    pressOpenDelay: { type: Number, required: false, default: 700 },
    dir: { type: String as PropType<Direction>, required: false },
    modal: { type: Boolean, required: false, default: true },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const { dir: propDir, modal, pressOpenDelay } = toRefs(props)
    useForwardExpose()
    const dir = useDirection(propDir)
    const open = ref(false)
    const triggerElement = ref<HTMLElement>()
    provideContextMenuRootContext({
      open,
      onOpenChange: value => {
        open.value = value
      },
      dir,
      modal,
      triggerElement,
      pressOpenDelay,
    })
    watch(open, value => emit('update:open', value))
    return () =>
      h(
        MenuRoot as Component,
        {
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
          dir: dir.value,
          modal: modal.value,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ContextMenuTrigger = defineComponent({
  name: 'ContextMenuTrigger',
  inheritAttrs: false,
  props: { disabled: { type: Boolean, required: false, default: false }, ...primitive('span') },
  setup(props, { slots, attrs }) {
    const { disabled } = toRefs(props)
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectContextMenuRootContext()
    const point = ref({ x: 0, y: 0 })
    const virtualEl = computed(() => ({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        left: point.value.x,
        right: point.value.x,
        top: point.value.y,
        bottom: point.value.y,
        ...point.value,
      }),
    }))
    const longPressTimer = ref(0)

    function clearLongPress() {
      window.clearTimeout(longPressTimer.value)
    }
    function handleOpen(event: MouseEvent | PointerEvent) {
      point.value = { x: event.clientX, y: event.clientY }
      rootContext.onOpenChange(true)
    }
    async function handleContextMenu(event: PointerEvent) {
      if (disabled.value) return
      await nextTick()
      if (!event.defaultPrevented) {
        clearLongPress()
        handleOpen(event)
        event.preventDefault()
      }
    }
    async function handlePointerDown(event: PointerEvent) {
      if (disabled.value) return
      await nextTick()
      if (isTouchOrPen(event) && !event.defaultPrevented) {
        clearLongPress()
        longPressTimer.value = window.setTimeout(
          handleOpen,
          rootContext.pressOpenDelay.value,
          event,
        )
      }
    }
    async function handlePointerEvent(event: PointerEvent) {
      if (disabled.value) return
      await nextTick()
      if (isTouchOrPen(event) && !event.defaultPrevented) clearLongPress()
    }

    onMounted(() => {
      if (currentElement.value) rootContext.triggerElement.value = currentElement.value
    })

    return () =>
      h(Fragment, null, [
        createVNode(
          MenuAnchor as Component,
          { as: 'template', reference: virtualEl.value },
          null,
          8,
          ['reference'],
        ),
        h(
          Primitive,
          mergeProps(
            {
              ref: forwardRef,
              as: props.as,
              'as-child': props.asChild,
              'data-state': rootContext.open.value ? 'open' : 'closed',
              'data-disabled': disabled.value ? '' : undefined,
              style: { WebkitTouchCallout: 'none', pointerEvents: 'auto' },
            },
            attrs,
            {
              onContextmenu: handleContextMenu,
              onPointerdown: handlePointerDown,
              onPointermove: handlePointerEvent,
              onPointercancel: handlePointerEvent,
              onPointerup: handlePointerEvent,
            },
          ),
          { default: withCtx(() => [renderSlot(slots, 'default')]) },
        ),
      ])
  },
})

export const ContextMenuContent = defineComponent({
  name: 'ContextMenuContent',
  props: {
    forceMount: { type: Boolean, required: false },
    loop: { type: Boolean, required: false },
    memoDependencies: { type: Array, required: false },
    sideFlip: { type: Boolean, required: false },
    alignOffset: { type: Number, required: false, default: 0 },
    alignFlip: { type: Boolean, required: false },
    avoidCollisions: { type: Boolean, required: false, default: true },
    collisionBoundary: { type: null, required: false, default: () => [] },
    collisionPadding: {
      type: [Number, Object] as PropType<number | Partial<Record<string, number>>>,
      required: false,
      default: 0,
    },
    hideShiftedArrow: { type: Boolean, required: false },
    sticky: { type: String, required: false, default: 'partial' },
    hideWhenDetached: { type: Boolean, required: false, default: false },
    positionStrategy: { type: String, required: false },
    disableUpdateOnLayoutShift: { type: Boolean, required: false },
    prioritizePosition: { type: Boolean, required: false },
    reference: { type: null, required: false },
    ...primitive(),
  },
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    const rootContext = injectContextMenuRootContext()
    const hasInteractedOutside = ref(false)
    return () =>
      h(
        MenuContent as Component,
        mergeProps(forwarded.value, {
          side: 'right',
          'side-offset': 2,
          align: 'start',
          'update-position-strategy': 'always',
          style: contentStyle(),
          onCloseAutoFocus: (event: Event) => {
            if (!event.defaultPrevented && hasInteractedOutside.value) event.preventDefault()
            hasInteractedOutside.value = false
          },
          onInteractOutside: (event: CustomEvent<{ originalEvent: PointerEvent }>) => {
            const originalEvent = event.detail.originalEvent
            if (originalEvent.button === 2 && event.target === rootContext.triggerElement.value)
              event.preventDefault()
            if (!event.defaultPrevented && !rootContext.modal.value)
              hasInteractedOutside.value = true
          },
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ContextMenuSub = defineComponent({
  name: 'ContextMenuSub',
  props: {
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    return () =>
      h(
        MenuSub as Component,
        { open: open.value, 'onUpdate:open': (value: boolean) => (open.value = value) },
        { default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]) },
      )
  },
})

export const ContextMenuSubContent = defineComponent({
  name: 'ContextMenuSubContent',
  props: propsWithoutDefaults(menuSubContentProps),
  emits: [...contentEmits, 'entryFocus', 'openAutoFocus'],
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    return () =>
      h(MenuSubContent as Component, mergeProps(forwarded.value, { style: contentStyle() }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

const itemProps = {
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  ...primitive(),
}

export const ContextMenuItem = wrapMenuPart('ContextMenuItem', MenuItem as Component, itemProps, {
  emits: ['select'],
  mode: 'emits',
})
export const ContextMenuCheckboxItem = wrapMenuPart(
  'ContextMenuCheckboxItem',
  MenuCheckboxItem as Component,
  { modelValue: { type: [Boolean, String], required: false }, ...itemProps },
  { emits: ['select', 'update:modelValue'], mode: 'emits' },
)
export const ContextMenuRadioGroup = wrapMenuPart(
  'ContextMenuRadioGroup',
  MenuRadioGroup as Component,
  { modelValue: { type: null, required: false }, ...primitive() },
  { emits: ['update:modelValue'], mode: 'emits' },
)
export const ContextMenuRadioItem = wrapMenuPart(
  'ContextMenuRadioItem',
  MenuRadioItem as Component,
  { value: { type: null, required: true }, ...itemProps },
  { emits: ['select'], mode: 'emits' },
)
export const ContextMenuItemIndicator = wrapMenuPart(
  'ContextMenuItemIndicator',
  MenuItemIndicator as Component,
  { forceMount: { type: Boolean, required: false }, ...primitive() },
)
export const ContextMenuGroup = wrapMenuPart(
  'ContextMenuGroup',
  MenuGroup as Component,
  primitive(),
)
export const ContextMenuLabel = wrapMenuPart(
  'ContextMenuLabel',
  MenuLabel as Component,
  primitive(),
)
export const ContextMenuSeparator = wrapMenuPart(
  'ContextMenuSeparator',
  MenuSeparator as Component,
  primitive(),
)
export const ContextMenuPortal = wrapMenuPart(
  'ContextMenuPortal',
  MenuPortal as Component,
  {
    to: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  { expose: false },
)
export const ContextMenuArrow = wrapMenuPart('ContextMenuArrow', MenuArrow as Component, {
  width: { type: Number, required: false, default: 10 },
  height: { type: Number, required: false, default: 5 },
  rounded: { type: Boolean, required: false },
  ...primitive('svg'),
})
export const ContextMenuSubTrigger = wrapMenuPart(
  'ContextMenuSubTrigger',
  MenuSubTrigger as Component,
  itemProps,
)
