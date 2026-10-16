import {
  defineComponent,
  h,
  mergeProps,
  ref,
  renderSlot,
  toRefs,
  watchEffect,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import { SUB_CLOSE_KEYS } from '../../../../shared/src/primitives/menu'
import { PopperRoot } from '../popper'
import { Presence } from '../presence'
import type { PrimitiveProps } from '../primitive'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useHideOthers } from '../utils/useHideOthers'
import { useId } from '../utils/useId'
import { useIsUsingKeyboard } from '../utils/useIsUsingKeyboard'
import { useVModel } from '../utils/useVModel'
import {
  injectMenuContentContext,
  injectMenuContext,
  injectMenuRootContext,
  injectMenuSubContext,
  provideMenuContext,
  provideMenuRootContext,
  provideMenuSubContext,
} from './context'
import { MenuContentImpl, menuContentEmits, menuContentImplProps } from './MenuContentImpl'

export const MenuRoot = defineComponent({
  name: 'MenuRoot',
  props: {
    open: { type: Boolean, required: false, default: false },
    dir: { type: String as PropType<Direction>, required: false },
    modal: { type: Boolean, required: false, default: true },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const { modal, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const open = useVModel(props, 'open', emit) as Ref<boolean>
    const content = ref<HTMLElement>()
    const isUsingKeyboardRef = useIsUsingKeyboard()

    provideMenuContext({
      open,
      onOpenChange: value => {
        open.value = value
      },
      content,
      onContentChange: element => {
        content.value = element
      },
    })

    provideMenuRootContext({
      onClose: () => {
        open.value = false
      },
      isUsingKeyboardRef,
      dir,
      modal,
    })

    return () => h(PopperRoot, null, { default: withCtx(() => [renderSlot(slots, 'default')]) })
  },
})

export const MenuSub = defineComponent({
  name: 'MenuSub',
  props: { open: { type: Boolean, required: false, default: undefined } },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: false,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const parentMenuContext = injectMenuContext()
    const trigger = ref<HTMLElement>()
    const content = ref<HTMLElement>()

    watchEffect(onCleanup => {
      if (parentMenuContext?.open.value === false) open.value = false
      onCleanup(() => (open.value = false))
    })

    provideMenuContext({
      open,
      onOpenChange: value => {
        open.value = value
      },
      content,
      onContentChange: element => {
        content.value = element
      },
    })

    provideMenuSubContext({
      triggerId: '',
      contentId: '',
      trigger,
      onTriggerChange: element => {
        trigger.value = element
      },
    })

    return () => h(PopperRoot, null, { default: withCtx(() => [renderSlot(slots, 'default')]) })
  },
})

const rootContentProps = propsWithoutDefaults(menuContentImplProps)
const {
  disableOutsidePointerEvents: _a,
  disableOutsideScroll: _b,
  trapFocus: _c,
  ...typeProps
} = rootContentProps

const MenuRootContentModal = defineComponent({
  name: 'MenuRootContentModal',
  props: typeProps,
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const menuContext = injectMenuContext()
    const { forwardRef, currentElement } = useForwardExpose()
    useHideOthers(currentElement)
    return () =>
      h(
        MenuContentImpl as Component,
        mergeProps(forwarded.value, {
          ref: forwardRef,
          'trap-focus': menuContext.open.value,
          'disable-outside-pointer-events': menuContext.open.value,
          'disable-outside-scroll': true,
          onDismiss: () => menuContext.onOpenChange(false),
          onFocusOutside: withModifiers(
            ((event: Event) => emit('focusOutside', event)) as (event: Event) => void,
            ['prevent'],
          ),
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

const MenuRootContentNonModal = defineComponent({
  name: 'MenuRootContentNonModal',
  props: typeProps,
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const menuContext = injectMenuContext()
    return () =>
      h(
        MenuContentImpl as Component,
        mergeProps(forwarded.value, {
          'trap-focus': false,
          'disable-outside-pointer-events': false,
          'disable-outside-scroll': false,
          onDismiss: () => menuContext.onOpenChange(false),
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const menuContentProps = { forceMount: { type: Boolean, required: false }, ...typeProps }

export const MenuContent = defineComponent({
  name: 'MenuContent',
  props: menuContentProps,
  emits: menuContentEmits,
  setup(props, { emit, slots, attrs }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    return () =>
      h(
        Presence,
        { present: props.forceMount || menuContext.open.value },
        {
          default: withCtx(() => [
            rootContext.modal.value
              ? h(
                  MenuRootContentModal as Component,
                  mergeProps({ key: 0 }, { ...attrs, ...forwarded.value }),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                )
              : h(
                  MenuRootContentNonModal as Component,
                  mergeProps({ key: 1 }, { ...attrs, ...forwarded.value }),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
          ]),
        },
      )
  },
})

const { side: _side, align: _align, ...subTypeProps } = typeProps

export const menuSubContentProps = {
  forceMount: { type: Boolean, required: false },
  ...subTypeProps,
  prioritizePosition: { type: Boolean, required: false, default: true },
}

export const MenuSubContent = defineComponent({
  name: 'MenuSubContent',
  props: menuSubContentProps,
  emits: menuContentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    const menuSubContext = injectMenuSubContext()
    const parentContentContext = injectMenuContentContext()
    const { forwardRef, currentElement: subContentElement } = useForwardExpose()
    menuSubContext.contentId ||= useId(undefined, 'reka-menu-sub-content')

    const onOpenAutoFocus = withModifiers(() => {
      if (rootContext.isUsingKeyboardRef.value) subContentElement.value?.focus()
    }, ['prevent'])
    const onCloseAutoFocus = withModifiers(() => {}, ['prevent'])
    const onFocusOutside = (event: Event) => {
      if (event.defaultPrevented) return
      const isMovingToParentContent = parentContentContext.filterElement.value?.contains(
        event.target as Node,
      )
      if (event.target !== menuSubContext.trigger.value && !isMovingToParentContent)
        menuContext.onOpenChange(false)
    }
    const onEscapeKeyDown = (event: Event) => {
      rootContext.onClose()
      event.preventDefault()
    }
    const onKeydown = (event: KeyboardEvent) => {
      const isKeyDownInside = (event.currentTarget as HTMLElement)?.contains(
        event.target as HTMLElement,
      )
      const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir.value].includes(event.key)
      if (isKeyDownInside && isCloseKey) {
        menuContext.onOpenChange(false)
        if (parentContentContext.filterElement.value) {
          parentContentContext.filterElement.value.focus()
          parentContentContext.highlightedElement.value = menuSubContext.trigger.value
          menuSubContext.trigger.value?.scrollIntoView({ block: 'nearest' })
        } else menuSubContext.trigger.value?.focus()
        event.preventDefault()
      }
    }

    return () =>
      h(
        Presence,
        { present: props.forceMount || menuContext.open.value },
        {
          default: withCtx(() => [
            h(
              MenuContentImpl as Component,
              mergeProps(forwarded.value, {
                id: menuSubContext.contentId,
                ref: forwardRef,
                'aria-labelledby': menuSubContext.triggerId,
                align: 'start',
                side: rootContext.dir.value === 'rtl' ? 'left' : 'right',
                'disable-outside-pointer-events': false,
                'disable-outside-scroll': false,
                'trap-focus': false,
                onOpenAutoFocus,
                onCloseAutoFocus,
                onFocusOutside,
                onEscapeKeyDown,
                onKeydown,
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export type MenuContentProps = Partial<Record<keyof typeof menuContentProps, unknown>> & {
  as?: PrimitiveProps['as']
}
