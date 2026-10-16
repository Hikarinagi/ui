import {
  computed,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type AllowedComponentProps,
  type ComponentCustomProps,
  type PropType,
  type VNode,
  type VNodeProps,
} from 'vue'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  dispatchTreeItemEvent,
  treeChildTarget,
  treeIndeterminate,
  treeParentTarget,
  TREE_SELECT,
  TREE_TOGGLE,
  type TreeItemSelectEvent,
  type TreeItemToggleEvent,
  type TreeValue,
} from '../../../../shared/src/primitives/tree'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import { injectTreeRootContext } from './context'

export interface TreeItemProps<T = TreeValue> {
  value: T
  level: number
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type TreeItemEmits<T = TreeValue> = {
  select: [event: TreeItemSelectEvent<T>]
  toggle: [event: TreeItemToggleEvent<T>]
}

export interface TreeItemSlots {
  default?: (props: {
    isExpanded: boolean
    isSelected: boolean
    isIndeterminate: boolean | undefined
    isDisabled: boolean
    handleSelect: () => void
    handleToggle: () => void
  }) => unknown
}

type TreeItemPublicProps<T> = TreeItemProps<T> & {
  onSelect?: (event: TreeItemSelectEvent<T>) => void
  onToggle?: (event: TreeItemToggleEvent<T>) => void
}

interface TreeItemSetup<T> {
  props: TreeItemPublicProps<T>
  slots: TreeItemSlots
  attrs: Record<string, unknown>
  emit: unknown
  expose: (exposed: Record<string, never>) => void
}

const TreeItemImpl = defineComponent({
  name: 'TreeItem',
  inheritAttrs: false,
  props: {
    value: { type: null as unknown as PropType<TreeValue>, required: true },
    level: { type: Number, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'li',
    },
  },
  emits: ['select', 'toggle'],
  setup(props, { emit, expose, slots, attrs }) {
    const rootContext = injectTreeRootContext()
    const { getItems } = useCollection()

    const hasChildren = computed(() => !!rootContext.getChildren(props.value))
    const isExpanded = computed(() =>
      rootContext.expanded.value.includes(rootContext.getKey(props.value)),
    )
    const isSelected = computed(() =>
      rootContext.selectedKeys.value.includes(rootContext.getKey(props.value)),
    )
    const isIndeterminate = computed(() =>
      treeIndeterminate({
        value: props.value,
        model: rootContext.modelValue.value,
        isSelected: isSelected.value,
        hasChildren: hasChildren.value,
        bubbleSelect: rootContext.bubbleSelect.value,
        propagateSelect: rootContext.propagateSelect.value,
        getKey: rootContext.getKey,
        getChildren: rootContext.getChildren,
      }),
    )
    const isDisabled = computed(() => rootContext.disabled.value || props.disabled)

    function collection() {
      return getItems().map(item => item.ref)
    }

    function handleKeydownRight(event: KeyboardEvent) {
      if (isDisabled.value) return
      if (!hasChildren.value) return
      if (isExpanded.value) treeChildTarget(collection(), getActiveElement(), props.level)?.focus()
      else handleToggleCustomEvent(event)
    }

    function handleKeydownLeft(event: KeyboardEvent) {
      if (isDisabled.value) return
      if (isExpanded.value) handleToggleCustomEvent(event)
      else treeParentTarget(collection(), getActiveElement(), props.level)?.focus()
    }

    function handleSelect(event: TreeItemSelectEvent<TreeValue>) {
      if (isDisabled.value) return
      emit('select', event)
      if (event?.defaultPrevented) return
      rootContext.onSelect(props.value)
    }

    function handleToggle(event: TreeItemToggleEvent<TreeValue>) {
      if (isDisabled.value) return
      emit('toggle', event)
      if (event?.defaultPrevented) return
      rootContext.onToggle(props.value)
    }

    function detail(event: Event) {
      return {
        originalEvent: event,
        value: props.value,
        isExpanded: isExpanded.value,
        isSelected: isSelected.value,
      }
    }

    function handleSelectCustomEvent(event?: Event) {
      if (!event) return
      dispatchTreeItemEvent(TREE_SELECT, handleSelect, detail(event))
    }

    function handleToggleCustomEvent(event?: Event) {
      if (!event) return
      dispatchTreeItemEvent(TREE_TOGGLE, handleToggle, detail(event))
    }

    expose({
      isExpanded,
      isSelected,
      isIndeterminate,
      isDisabled,
      handleToggle: () => rootContext.onToggle(props.value),
      handleSelect: () => rootContext.onSelect(props.value),
    })

    const onKeydownRight = withKeys(
      withModifiers(
        ((event: KeyboardEvent) =>
          rootContext.dir.value === 'ltr'
            ? handleKeydownRight(event)
            : handleKeydownLeft(event)) as (event: Event) => void,
        ['prevent'],
      ),
      ['right'],
    )
    const onKeydownLeft = withKeys(
      withModifiers(
        ((event: KeyboardEvent) =>
          rootContext.dir.value === 'ltr'
            ? handleKeydownLeft(event)
            : handleKeydownRight(event)) as (event: Event) => void,
        ['prevent'],
      ),
      ['left'],
    )
    const onClick = withModifiers(
      (event: Event) => {
        handleSelectCustomEvent(event)
        handleToggleCustomEvent(event)
      },
      ['stop'],
    )

    return () =>
      h(
        RovingFocusItem,
        {
          'as-child': '',
          value: props.value,
          'allow-shift-key': '',
          focusable: !isDisabled.value,
        },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(attrs, {
                role: 'treeitem',
                as: props.as,
                'as-child': props.asChild,
                'aria-selected': isSelected.value,
                'aria-expanded': hasChildren.value ? isExpanded.value : undefined,
                'aria-level': props.level,
                'aria-disabled': isDisabled.value ? true : undefined,
                'data-indent': props.level,
                'data-selected': isSelected.value ? '' : undefined,
                'data-expanded': isExpanded.value ? '' : undefined,
                'data-disabled': isDisabled.value ? '' : undefined,
                onKeydown: [
                  withKeys(withModifiers(handleSelectCustomEvent, ['self', 'prevent']), [
                    'enter',
                    'space',
                  ]),
                  onKeydownRight,
                  onKeydownLeft,
                ],
                onClick,
              }),
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default', {
                    isExpanded: isExpanded.value,
                    isSelected: isSelected.value,
                    isIndeterminate: isIndeterminate.value,
                    isDisabled: isDisabled.value,
                    handleSelect: () => rootContext.onSelect(props.value),
                    handleToggle: () => rootContext.onToggle(props.value),
                  }),
                ]),
              },
            ),
          ]),
        },
      )
  },
})

export const TreeItem = TreeItemImpl as unknown as <T extends TreeValue = TreeValue>(
  props: TreeItemPublicProps<T> & VNodeProps & AllowedComponentProps & ComponentCustomProps,
  ctx?: Pick<TreeItemSetup<T>, 'attrs' | 'slots' | 'emit'>,
  expose?: TreeItemSetup<T>['expose'],
  setup?: Promise<TreeItemSetup<T>>,
) => VNode & { __ctx?: TreeItemSetup<T> }
