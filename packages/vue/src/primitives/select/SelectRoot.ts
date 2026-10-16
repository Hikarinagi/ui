import {
  computed,
  createCommentVNode,
  defineComponent,
  Fragment,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import {
  createTypeahead,
  valueComparator,
  type Comparator,
} from '../../../../shared/src/primitives/listbox'
import {
  isNullish,
  OPEN_KEYS,
  shouldShowPlaceholder,
  toggleSelectValue,
} from '../../../../shared/src/primitives/select'
import { useCollection } from '../collection'
import { PopperAnchor, PopperRoot } from '../popper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { VisuallyHidden } from '../visually-hidden'
import { useDirection, type Direction } from '../utils/useDirection'
import { useFormControl } from '../utils/useFormControl'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'
import {
  injectSelectGroupContext,
  injectSelectRootContext,
  provideSelectGroupContext,
  provideSelectRootContext,
  type SelectOptionRecord,
} from './context'

export const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

const BubbleSelect = defineComponent({
  name: 'BubbleSelect',
  props: {
    autocomplete: { type: String, required: false },
    autofocus: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    form: { type: String, required: false },
    multiple: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    size: { type: Number, required: false },
    value: { type: null, required: false },
  },
  setup(props, { slots }) {
    const selectElement = ref<HTMLSelectElement>()
    const rootContext = injectSelectRootContext()

    watch(
      () => props.value,
      (cur, prev) => {
        const selectProto = window.HTMLSelectElement.prototype
        const descriptor = Object.getOwnPropertyDescriptor(selectProto, 'value')!
        const setValue = descriptor.set
        if (cur !== prev && setValue && selectElement.value) {
          const event = new Event('change', { bubbles: true })
          setValue.call(selectElement.value, cur)
          selectElement.value.dispatchEvent(event)
        }
      },
    )

    function handleInput(event: Event) {
      rootContext.onValueChange((event.target as HTMLSelectElement).value)
    }

    return () =>
      h(
        VisuallyHidden as Component,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h('select', mergeProps({ ref: selectElement }, props, { onInput: handleInput }), [
              renderSlot(slots, 'default'),
            ]),
          ]),
        },
      )
  },
})

export const SelectRoot = defineComponent({
  name: 'SelectRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: false, default: undefined },
    defaultOpen: { type: Boolean, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false, default: undefined },
    nullableValue: { type: String, required: false, default: '' },
    by: { type: [String, Function] as PropType<Comparator>, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    multiple: { type: Boolean, required: false },
    autocomplete: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'update:open'],
  setup(props, { emit, slots }) {
    const { required, disabled, multiple, dir: propDir } = toRefs(props)
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : undefined),
      passive: props.modelValue === undefined,
      deep: true,
    }) as Ref<unknown>
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const triggerElement = ref<HTMLElement>()
    const valueElement = ref<HTMLElement>()
    const triggerPointerDownPosRef = ref<{ x: number; y: number } | null>({ x: 0, y: 0 })
    const isEmptyModelValue = computed(() => {
      if (multiple.value && Array.isArray(modelValue.value)) return modelValue.value?.length === 0
      return isNullish(modelValue.value)
    })

    useCollection({ isProvider: true })
    const dir = useDirection(propDir)
    const isFormControl = useFormControl(triggerElement)
    const optionsSet = ref(new Set<SelectOptionRecord>()) as Ref<Set<SelectOptionRecord>>
    const nativeSelectKey = computed(() =>
      Array.from(optionsSet.value)
        .map(option => option.value)
        .join(';'),
    )

    function handleValueChange(value: unknown) {
      if (multiple.value) modelValue.value = toggleSelectValue(modelValue.value, value, props.by)
      else modelValue.value = value
    }

    function getOption(value: unknown) {
      return Array.from(optionsSet.value).find(option =>
        valueComparator(value, option.value, props.by),
      )
    }

    provideSelectRootContext({
      triggerElement,
      onTriggerChange: node => {
        triggerElement.value = node
      },
      valueElement,
      onValueElementChange: node => {
        valueElement.value = node
      },
      contentId: '',
      modelValue,
      onValueChange: handleValueChange,
      by: props.by,
      open,
      multiple,
      required,
      onOpenChange: value => {
        open.value = value
      },
      dir,
      triggerPointerDownPosRef,
      disabled,
      isEmptyModelValue,
      optionsSet,
      onOptionAdd: option => {
        const existingOption = getOption(option.value)
        if (existingOption) optionsSet.value.delete(existingOption)
        optionsSet.value.add(option)
      },
      onOptionRemove: option => {
        const existingOption = getOption(option.value)
        if (existingOption) optionsSet.value.delete(existingOption)
      },
    })

    return () =>
      h(PopperRoot, null, {
        default: withCtx(() => [
          renderSlot(slots, 'default', { modelValue: modelValue.value, open: open.value }),
          isFormControl.value && props.name
            ? h(
                BubbleSelect,
                {
                  key: nativeSelectKey.value,
                  'aria-hidden': 'true',
                  tabindex: '-1',
                  multiple: multiple.value,
                  required: required.value,
                  name: props.name,
                  autocomplete: props.autocomplete,
                  disabled: disabled.value,
                  value: modelValue.value,
                },
                {
                  default: withCtx(() => [
                    isNullish(modelValue.value)
                      ? h('option', { key: 0, value: props.nullableValue })
                      : createCommentVNode('v-if', true),
                    h(
                      Fragment,
                      null,
                      Array.from(optionsSet.value).map(option =>
                        h(
                          'option',
                          mergeProps(
                            { key: (option.value ?? '') as string },
                            option as unknown as Record<string, unknown>,
                          ),
                        ),
                      ),
                    ),
                  ]),
                },
              )
            : createCommentVNode('v-if', true),
        ]),
      })
  },
})

export const SelectTrigger = defineComponent({
  name: 'SelectTrigger',
  props: {
    disabled: { type: Boolean, required: false },
    reference: { type: null, required: false },
    ...primitive('button'),
  },
  setup(props, { slots }) {
    const rootContext = injectSelectRootContext()
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const isDisabled = computed(() => rootContext.disabled?.value || props.disabled)
    rootContext.contentId ||= useId(undefined, 'reka-select-content')

    onMounted(() => {
      rootContext.onTriggerChange(triggerElement.value)
    })

    const { getItems } = useCollection()
    const typeahead = createTypeahead()
    onUnmounted(() => typeahead.dispose())

    function handleOpen() {
      if (!isDisabled.value) {
        rootContext.onOpenChange(true)
        typeahead.reset()
      }
    }

    function handlePointerOpen(event: PointerEvent) {
      handleOpen()
      rootContext.triggerPointerDownPosRef.value = {
        x: Math.round(event.pageX),
        y: Math.round(event.pageY),
      }
    }

    function isPlainLeftClick(event: PointerEvent | MouseEvent) {
      return event.button === 0 && event.ctrlKey === false
    }

    let openedFromPointerDown = false

    function onTriggerPointerDown(event: PointerEvent) {
      if (event.pointerType === 'touch') return event.preventDefault()
      const target = event.target as HTMLElement
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
      if (isPlainLeftClick(event)) {
        handlePointerOpen(event)
        openedFromPointerDown = true
      }
    }

    function onTriggerMouseDown(event: MouseEvent) {
      if (isPlainLeftClick(event)) event.preventDefault()
    }

    function onTriggerClick(event: MouseEvent) {
      if (!openedFromPointerDown) (event.currentTarget as HTMLElement | null)?.focus()
      openedFromPointerDown = false
    }

    const onPointerup = withModifiers(
      ((event: PointerEvent) => {
        if (event.pointerType === 'touch') handlePointerOpen(event)
      }) as (event: Event) => void,
      ['prevent'],
    )

    function onKeydown(event: KeyboardEvent) {
      const isTypingAhead = typeahead.search !== ''
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
      if (!isModifierKey && event.key.length === 1) {
        if (isTypingAhead && event.key === ' ') return
      }
      typeahead.handle(event.key, getItems())
      if (OPEN_KEYS.includes(event.key)) {
        handleOpen()
        event.preventDefault()
      }
    }

    return () =>
      h(
        PopperAnchor as Component,
        { 'as-child': '', reference: props.reference },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                role: 'combobox',
                type: props.as === 'button' ? 'button' : undefined,
                'aria-controls': rootContext.open.value ? rootContext.contentId : undefined,
                'aria-expanded': rootContext.open.value || false,
                'aria-required': rootContext.required?.value,
                'aria-autocomplete': 'none',
                disabled: isDisabled.value,
                dir: rootContext?.dir.value,
                'data-state': rootContext?.open.value ? 'open' : 'closed',
                'data-disabled': isDisabled.value ? '' : undefined,
                'data-placeholder': shouldShowPlaceholder(rootContext.modelValue?.value)
                  ? ''
                  : undefined,
                'as-child': props.asChild,
                as: props.as,
                onClick: onTriggerClick,
                onPointerdown: onTriggerPointerDown,
                onMousedown: onTriggerMouseDown,
                onPointerup,
                onKeydown,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const SelectPortal = defineComponent({
  name: 'SelectPortal',
  props: {
    to: { type: null as unknown as PropType<string | HTMLElement>, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  setup(props, { slots }) {
    return () =>
      h(Teleport as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const SelectGroup = defineComponent({
  name: 'SelectGroup',
  props: primitive(),
  setup(props, { slots }) {
    const id = useId(undefined, 'reka-select-group')
    provideSelectGroupContext({ id })
    return () =>
      h(Primitive, mergeProps({ role: 'group' }, props, { 'aria-labelledby': id }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const SelectLabel = defineComponent({
  name: 'SelectLabel',
  props: { for: { type: String, required: false }, ...primitive('div') },
  setup(props, { slots }) {
    const groupContext = injectSelectGroupContext({ id: '' })
    return () =>
      h(Primitive, mergeProps(props, { id: groupContext.id }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
