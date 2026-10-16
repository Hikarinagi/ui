import {
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  withCtx,
  withKeys,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import {
  MenuAnchor,
  MenuArrow,
  MenuCheckboxItem,
  MenuContent,
  menuContentEmits,
  menuContentProps,
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
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'

export interface DropdownMenuRootContext {
  open: Readonly<Ref<boolean>>
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  triggerId: string
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  modal: Ref<boolean>
  dir: Ref<Direction>
}

export const [injectDropdownMenuRootContext, provideDropdownMenuRootContext] =
  createContext<DropdownMenuRootContext>('DropdownMenuRoot')

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

const contentStyle = {
  '--reka-dropdown-menu-content-transform-origin': 'var(--reka-popper-transform-origin)',
  '--reka-dropdown-menu-content-available-width': 'var(--reka-popper-available-width)',
  '--reka-dropdown-menu-content-available-height': 'var(--reka-popper-available-height)',
  '--reka-dropdown-menu-trigger-width': 'var(--reka-popper-anchor-width)',
  '--reka-dropdown-menu-trigger-height': 'var(--reka-popper-anchor-height)',
}

export const DropdownMenuRoot = defineComponent({
  name: 'DropdownMenuRoot',
  props: {
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false, default: undefined },
    dir: { type: String as PropType<Direction>, required: false },
    modal: { type: Boolean, required: false, default: true },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const triggerElement = ref<HTMLElement>()
    const { modal, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    provideDropdownMenuRootContext({
      open,
      onOpenChange: value => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      triggerId: '',
      triggerElement,
      contentId: '',
      modal,
      dir,
    })
    return () =>
      h(
        MenuRoot as Component,
        {
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
          dir: dir.value,
          modal: modal.value,
        },
        { default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]) },
      )
  },
})

export const DropdownMenuTrigger = defineComponent({
  name: 'DropdownMenuTrigger',
  props: { disabled: { type: Boolean, required: false }, ...primitive('button') },
  setup(props, { slots }) {
    const rootContext = injectDropdownMenuRootContext()
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    onMounted(() => {
      rootContext.triggerElement = triggerElement as Ref<HTMLElement | undefined>
    })
    rootContext.triggerId ||= useId(undefined, 'reka-dropdown-menu-trigger')

    const onClick = async (event: MouseEvent) => {
      if (!props.disabled && event.button === 0 && event.ctrlKey === false) {
        rootContext?.onOpenToggle()
        await nextTick()
        if (rootContext.open.value) event.preventDefault()
      }
    }
    const onKeydown = withKeys(
      ((event: KeyboardEvent) => {
        if (props.disabled) return
        if (['Enter', ' '].includes(event.key)) rootContext.onOpenToggle()
        if (event.key === 'ArrowDown') rootContext.onOpenChange(true)
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) event.preventDefault()
      }) as (event: Event) => void,
      ['enter', 'space', 'arrow-down'],
    )

    return () =>
      h(
        MenuAnchor as Component,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                id: rootContext.triggerId,
                ref: forwardRef,
                type: props.as === 'button' ? 'button' : undefined,
                'as-child': props.asChild,
                as: props.as,
                'aria-haspopup': 'menu',
                'aria-expanded': rootContext.open.value,
                'aria-controls': rootContext.open.value ? rootContext.contentId : undefined,
                'data-disabled': props.disabled ? '' : undefined,
                disabled: props.disabled,
                'data-state': rootContext.open.value ? 'open' : 'closed',
                onClick,
                onKeydown,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const DropdownMenuContent = defineComponent({
  name: 'DropdownMenuContent',
  props: propsWithoutDefaults(menuContentProps),
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    const rootContext = injectDropdownMenuRootContext()
    const hasInteractedOutside = ref(false)

    function handleCloseAutoFocus(event: Event) {
      if (event.defaultPrevented) return
      if (!hasInteractedOutside.value)
        setTimeout(() => {
          rootContext.triggerElement.value?.focus()
        }, 0)
      hasInteractedOutside.value = false
      event.preventDefault()
    }

    rootContext.contentId ||= useId(undefined, 'reka-dropdown-menu-content')

    const onInteractOutside = (event: CustomEvent<{ originalEvent: PointerEvent }>) => {
      if (event.defaultPrevented) return
      const originalEvent = event.detail.originalEvent
      const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
      const isRightClick = originalEvent.button === 2 || ctrlLeftClick
      if (!rootContext.modal.value || isRightClick) hasInteractedOutside.value = true
      if (rootContext.triggerElement.value?.contains(event.target as HTMLElement))
        event.preventDefault()
    }

    return () =>
      h(
        MenuContent as Component,
        mergeProps(forwarded.value, {
          id: rootContext.contentId,
          'aria-labelledby': rootContext?.triggerId,
          style: contentStyle,
          onCloseAutoFocus: handleCloseAutoFocus,
          onInteractOutside,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const DropdownMenuSub = defineComponent({
  name: 'DropdownMenuSub',
  props: {
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const open = useVModel(props, 'open', emit, {
      passive: props.open === undefined,
      defaultValue: props.defaultOpen ?? false,
    }) as Ref<boolean>
    useForwardExpose()
    return () =>
      h(
        MenuSub as Component,
        { open: open.value, 'onUpdate:open': (value: boolean) => (open.value = value) },
        { default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]) },
      )
  },
})

export const DropdownMenuSubContent = defineComponent({
  name: 'DropdownMenuSubContent',
  props: propsWithoutDefaults(menuSubContentProps),
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    return () =>
      h(MenuSubContent as Component, mergeProps(forwarded.value, { style: contentStyle }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

const itemProps = {
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  ...primitive(),
}

export const DropdownMenuItem = wrapMenuPart('DropdownMenuItem', MenuItem as Component, itemProps, {
  emits: ['select'],
  mode: 'emits',
})
export const DropdownMenuCheckboxItem = wrapMenuPart(
  'DropdownMenuCheckboxItem',
  MenuCheckboxItem as Component,
  { modelValue: { type: [Boolean, String], required: false }, ...itemProps },
  { emits: ['select', 'update:modelValue'], mode: 'emits' },
)
export const DropdownMenuRadioGroup = wrapMenuPart(
  'DropdownMenuRadioGroup',
  MenuRadioGroup as Component,
  { modelValue: { type: null, required: false }, ...primitive() },
  { emits: ['update:modelValue'], mode: 'emits' },
)
export const DropdownMenuRadioItem = wrapMenuPart(
  'DropdownMenuRadioItem',
  MenuRadioItem as Component,
  { value: { type: null, required: true }, ...itemProps },
  { emits: ['select'], mode: 'forwarded' },
)
export const DropdownMenuItemIndicator = wrapMenuPart(
  'DropdownMenuItemIndicator',
  MenuItemIndicator as Component,
  { forceMount: { type: Boolean, required: false }, ...primitive() },
)
export const DropdownMenuGroup = wrapMenuPart(
  'DropdownMenuGroup',
  MenuGroup as Component,
  primitive(),
)
export const DropdownMenuLabel = wrapMenuPart(
  'DropdownMenuLabel',
  MenuLabel as Component,
  primitive(),
)
export const DropdownMenuSeparator = wrapMenuPart(
  'DropdownMenuSeparator',
  MenuSeparator as Component,
  primitive(),
)
export const DropdownMenuPortal = wrapMenuPart(
  'DropdownMenuPortal',
  MenuPortal as Component,
  {
    to: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  { expose: false },
)
export const DropdownMenuArrow = wrapMenuPart('DropdownMenuArrow', MenuArrow as Component, {
  width: { type: Number, required: false, default: 10 },
  height: { type: Number, required: false, default: 5 },
  rounded: { type: Boolean, required: false },
  ...primitive('svg'),
})
export const DropdownMenuSubTrigger = wrapMenuPart(
  'DropdownMenuSubTrigger',
  MenuSubTrigger as Component,
  itemProps,
)

export type DropdownMenuContentEmits = {
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: CustomEvent<{ originalEvent: PointerEvent }>]
  focusOutside: [event: CustomEvent<{ originalEvent: FocusEvent }>]
  interactOutside: [event: CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>]
  closeAutoFocus: [event: Event]
}
