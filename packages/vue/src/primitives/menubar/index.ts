import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  withKeys,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import { wrapArray } from '../../../../shared/src/primitives/roving-focus'
import { useCollection } from '../collection'
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
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import { createContext } from '../utils/createContext'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'

export interface MenubarRootContext {
  modelValue: Ref<string>
  dir: Ref<Direction>
  loop: Ref<boolean>
  onMenuOpen: (value: string) => void
  onMenuClose: () => void
  onMenuToggle: (value: string) => void
}

export interface MenubarMenuContext {
  value: string
  triggerElement: Ref<HTMLElement | undefined>
  triggerId: string
  contentId: string
  wasKeyboardTriggerOpenRef: Ref<boolean>
}

export const [injectMenubarRootContext, provideMenubarRootContext] =
  createContext<MenubarRootContext>('MenubarRoot')

export const [injectMenubarMenuContext, provideMenubarMenuContext] =
  createContext<MenubarMenuContext>('MenubarMenu')

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
  '--reka-menubar-content-transform-origin': 'var(--reka-popper-transform-origin)',
  '--reka-menubar-content-available-width': 'var(--reka-popper-available-width)',
  '--reka-menubar-content-available-height': 'var(--reka-popper-available-height)',
  '--reka-menubar-trigger-width': 'var(--reka-popper-anchor-width)',
  '--reka-menubar-trigger-height': 'var(--reka-popper-anchor-height)',
}

function enabledValues(items: { ref: HTMLElement }[]) {
  return items.filter(item => item.ref.dataset.disabled !== '').map(item => item.ref.dataset.value)
}

export const MenubarRoot = defineComponent({
  name: 'MenubarRoot',
  props: {
    modelValue: { type: String, required: false },
    defaultValue: { type: String, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    loop: { type: Boolean, required: false, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { forwardRef } = useForwardExpose()
    const { CollectionSlot } = useCollection({ key: 'Menubar', isProvider: true })
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: props.modelValue === undefined,
    }) as Ref<string>
    const currentTabStopId = ref<string | null>(null)
    const { dir: propDir, loop } = toRefs(props)
    const dir = useDirection(propDir)

    provideMenubarRootContext({
      modelValue,
      dir,
      loop,
      onMenuOpen: value => {
        modelValue.value = value
        currentTabStopId.value = value
      },
      onMenuClose: () => {
        modelValue.value = ''
      },
      onMenuToggle: value => {
        modelValue.value = modelValue.value ? '' : value
        currentTabStopId.value = value
      },
    })

    return () =>
      h(CollectionSlot, null, {
        default: withCtx(() => [
          h(
            RovingFocusGroup as Component,
            {
              'current-tab-stop-id': currentTabStopId.value,
              'onUpdate:currentTabStopId': (value: string | null) =>
                (currentTabStopId.value = value),
              orientation: 'horizontal',
              loop: loop.value,
              dir: dir.value,
              'as-child': '',
            },
            {
              default: withCtx(() => [
                h(
                  Primitive,
                  { ref: forwardRef, role: 'menubar' },
                  {
                    default: withCtx(() => [
                      renderSlot(slots, 'default', { modelValue: modelValue.value }),
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

export const MenubarMenu = defineComponent({
  name: 'MenubarMenu',
  props: { value: { type: String, required: false } },
  setup(props, { slots }) {
    const value = useId(props.value)
    const rootContext = injectMenubarRootContext()
    useForwardExpose()
    const triggerElement = ref<HTMLElement>()
    const wasKeyboardTriggerOpenRef = ref(false)
    const open = computed(() => rootContext.modelValue.value === value)

    watch(open, () => {
      if (!open.value) wasKeyboardTriggerOpenRef.value = false
    })

    provideMenubarMenuContext({
      value,
      triggerElement,
      triggerId: value,
      contentId: '',
      wasKeyboardTriggerOpenRef,
    })

    return () =>
      h(
        MenuRoot as Component,
        {
          open: open.value,
          modal: false,
          dir: rootContext.dir.value,
          'onUpdate:open': (next: boolean) => {
            if (!next) rootContext.onMenuClose()
          },
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const MenubarTrigger = defineComponent({
  name: 'MenubarTrigger',
  props: { disabled: { type: Boolean, required: false }, ...primitive('button') },
  setup(props, { slots }) {
    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const { CollectionItem } = useCollection({ key: 'Menubar' })
    const isFocused = ref(false)
    const open = computed(() => rootContext.modelValue.value === menuContext.value)

    onMounted(() => {
      menuContext.triggerElement = triggerElement as Ref<HTMLElement | undefined>
    })

    const onPointerdown = (event: PointerEvent) => {
      if (!props.disabled && event.button === 0 && event.ctrlKey === false) {
        rootContext.onMenuOpen(menuContext.value)
        if (!open.value) event.preventDefault()
      }
    }
    const onPointerenter = () => {
      const menubarOpen = Boolean(rootContext.modelValue.value)
      if (menubarOpen && !open.value) {
        rootContext.onMenuOpen(menuContext.value)
        triggerElement.value?.focus()
      }
    }
    const onKeydown = withKeys(
      ((event: KeyboardEvent) => {
        if (props.disabled) return
        if (['Enter', ' '].includes(event.key)) rootContext.onMenuToggle(menuContext.value)
        if (event.key === 'ArrowDown') rootContext.onMenuOpen(menuContext.value)
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          menuContext.wasKeyboardTriggerOpenRef.value = true
          event.preventDefault()
        }
      }) as (event: Event) => void,
      ['enter', 'space', 'arrow-down'],
    )

    return () =>
      h(
        RovingFocusItem as Component,
        { 'as-child': '', focusable: !props.disabled, 'tab-stop-id': menuContext.value },
        {
          default: withCtx(() => [
            h(CollectionItem, null, {
              default: withCtx(() => [
                h(
                  MenuAnchor as Component,
                  { 'as-child': '' },
                  {
                    default: withCtx(() => [
                      h(
                        Primitive,
                        {
                          id: menuContext.triggerId,
                          ref: forwardRef,
                          as: props.as,
                          'as-child': props.asChild,
                          type: props.as === 'button' ? 'button' : undefined,
                          role: 'menuitem',
                          'aria-haspopup': 'menu',
                          'aria-expanded': open.value,
                          'aria-controls': open.value ? menuContext.contentId : undefined,
                          'data-highlighted': isFocused.value ? '' : undefined,
                          'data-state': open.value ? 'open' : 'closed',
                          'data-disabled': props.disabled ? '' : undefined,
                          disabled: props.disabled,
                          'data-value': menuContext.value,
                          onPointerdown,
                          onPointerenter,
                          onKeydown,
                          onFocus: () => (isFocused.value = true),
                          onBlur: () => (isFocused.value = false),
                        },
                        { default: withCtx(() => [renderSlot(slots, 'default')]) },
                      ),
                    ]),
                  },
                ),
              ]),
            }),
          ]),
        },
      )
  },
})

const { align: _align, ...rootContentProps } = propsWithoutDefaults(menuContentProps)

export const MenubarContent = defineComponent({
  name: 'MenubarContent',
  props: {
    ...rootContentProps,
    align: { ...menuContentProps.align, default: 'start' },
  },
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()
    menuContext.contentId ||= useId(undefined, 'reka-menubar-content')
    const { getItems } = useCollection({ key: 'Menubar' })
    const hasInteractedOutsideRef = ref(false)

    function handleArrowNavigation(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const targetIsSubTrigger = target.hasAttribute('data-reka-menubar-subtrigger')
      const prevMenuKey = rootContext.dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      const isPrevKey = prevMenuKey === event.key
      const isNextKey = !isPrevKey
      if (isNextKey && targetIsSubTrigger) return
      let candidateValues = enabledValues(getItems())
      if (isPrevKey) candidateValues.reverse()
      const currentIndex = candidateValues.indexOf(menuContext.value)
      candidateValues = rootContext.loop.value
        ? wrapArray(candidateValues, currentIndex + 1)
        : candidateValues.slice(currentIndex + 1)
      const [nextValue] = candidateValues
      if (nextValue) rootContext.onMenuOpen(nextValue)
    }

    return () =>
      h(
        MenuContent as Component,
        mergeProps(forwarded.value, {
          id: menuContext.contentId,
          'data-reka-menubar-content': '',
          'aria-labelledby': menuContext.triggerId,
          style: contentStyle,
          onCloseAutoFocus: (event: Event) => {
            const menubarOpen = Boolean(rootContext.modelValue.value)
            if (!menubarOpen && !hasInteractedOutsideRef.value)
              menuContext.triggerElement.value?.focus()
            hasInteractedOutsideRef.value = false
            event.preventDefault()
          },
          onFocusOutside: (event: Event) => {
            const target = event.target as Node
            const isMenubarTrigger = getItems()
              .filter(item => item.ref.dataset.disabled !== '')
              .some(item => item.ref.contains(target))
            if (isMenubarTrigger) event.preventDefault()
          },
          onInteractOutside: () => {
            hasInteractedOutsideRef.value = true
          },
          onEntryFocus: (event: Event) => {
            if (!menuContext.wasKeyboardTriggerOpenRef.value) event.preventDefault()
          },
          onKeydown: withKeys(handleArrowNavigation as (event: Event) => void, [
            'arrow-right',
            'arrow-left',
          ]),
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const MenubarSub = defineComponent({
  name: 'MenubarSub',
  props: {
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen ?? false,
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

export const MenubarSubContent = defineComponent({
  name: 'MenubarSubContent',
  props: propsWithoutDefaults(menuSubContentProps),
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    useForwardExpose()
    const { getItems } = useCollection({ key: 'Menubar' })
    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()

    function handleArrowNavigation(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.hasAttribute('data-reka-menubar-subtrigger')) return
      let candidateValues = enabledValues(getItems())
      const currentIndex = candidateValues.indexOf(menuContext.value)
      candidateValues = rootContext.loop.value
        ? wrapArray(candidateValues, currentIndex + 1)
        : candidateValues.slice(currentIndex + 1)
      const [nextValue] = candidateValues
      if (nextValue) rootContext.onMenuOpen(nextValue)
    }

    return () =>
      h(
        MenuSubContent as Component,
        mergeProps(forwarded.value, {
          'data-reka-menubar-content': '',
          style: contentStyle,
          onKeydown: withKeys(handleArrowNavigation as (event: Event) => void, ['arrow-right']),
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

const itemProps = {
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  ...primitive(),
}

export const MenubarSubTrigger = defineComponent({
  name: 'MenubarSubTrigger',
  props: itemProps,
  setup(props, { slots }) {
    useForwardExpose()
    return () =>
      h(MenuSubTrigger as Component, mergeProps(props, { 'data-reka-menubar-subtrigger': '' }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const MenubarItem = wrapMenuPart('MenubarItem', MenuItem as Component, itemProps, {
  emits: ['select'],
  mode: 'emits',
})
export const MenubarCheckboxItem = wrapMenuPart(
  'MenubarCheckboxItem',
  MenuCheckboxItem as Component,
  { modelValue: { type: [Boolean, String], required: false }, ...itemProps },
  { emits: ['select', 'update:modelValue'], mode: 'emits' },
)
export const MenubarRadioGroup = wrapMenuPart(
  'MenubarRadioGroup',
  MenuRadioGroup as Component,
  { modelValue: { type: null, required: false }, ...primitive() },
  { emits: ['update:modelValue'], mode: 'emits' },
)
export const MenubarRadioItem = wrapMenuPart(
  'MenubarRadioItem',
  MenuRadioItem as Component,
  { value: { type: null, required: true }, ...itemProps },
  { emits: ['select'], mode: 'forwarded' },
)
export const MenubarItemIndicator = wrapMenuPart(
  'MenubarItemIndicator',
  MenuItemIndicator as Component,
  { forceMount: { type: Boolean, required: false }, ...primitive() },
)
export const MenubarGroup = wrapMenuPart('MenubarGroup', MenuGroup as Component, primitive())
export const MenubarLabel = wrapMenuPart('MenubarLabel', MenuLabel as Component, primitive())
export const MenubarSeparator = wrapMenuPart(
  'MenubarSeparator',
  MenuSeparator as Component,
  primitive(),
)
export const MenubarPortal = wrapMenuPart(
  'MenubarPortal',
  MenuPortal as Component,
  {
    to: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  { expose: false },
)
export const MenubarArrow = wrapMenuPart('MenubarArrow', MenuArrow as Component, {
  width: { type: Number, required: false, default: 10 },
  height: { type: Number, required: false, default: 5 },
  rounded: { type: Boolean, required: false },
  ...primitive('svg'),
})
