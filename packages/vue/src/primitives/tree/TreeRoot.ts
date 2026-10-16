import {
  computed,
  defineComponent,
  h,
  nextTick,
  onScopeDispose,
  ref,
  renderSlot,
  toRefs,
  withCtx,
  withKeys,
  withModifiers,
  type AllowedComponentProps,
  type ComponentCustomProps,
  type PropType,
  type Ref,
  type VNode,
  type VNodeProps,
} from 'vue'
import {
  createEventHook,
  createTypeahead,
  type ListboxSelectionBehavior,
} from '../../../../shared/src/primitives/listbox'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  defaultTreeChildren,
  flattenTree,
  nextTreeSelection,
  toggleTreeExpanded,
  treeRangeValues,
  treeSelectedKeys,
  TREE_KEY_TO_INTENT,
  type FlattenedItem,
  type TreeValue,
} from '../../../../shared/src/primitives/tree'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusGroup } from '../roving-focus'
import { useDirection, type Direction } from '../utils/useDirection'
import { useVModel } from '../utils/useVModel'
import { provideTreeRootContext, type TreeRootContext } from './context'

type TreeModel<U, M extends boolean> = M extends true ? U[] : U

export interface TreeRootProps<T = TreeValue, U = TreeValue, M extends boolean = false> {
  modelValue?: TreeModel<U, M>
  defaultValue?: TreeModel<U, M>
  items?: T[]
  expanded?: string[]
  defaultExpanded?: string[]
  getKey: (value: T) => string
  getChildren?: (value: T) => T[] | undefined
  selectionBehavior?: ListboxSelectionBehavior
  multiple?: M | boolean
  dir?: Direction
  disabled?: boolean
  propagateSelect?: boolean
  bubbleSelect?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type TreeRootEmits<T = TreeValue, M extends boolean = false> = {
  'update:modelValue': [value: TreeModel<T, M>]
  'update:expanded': [value: string[]]
}

export interface TreeRootSlots<T, U, M extends boolean> {
  default?: (props: {
    flattenItems: FlattenedItem<T>[]
    modelValue: TreeModel<U, M>
    expanded: string[]
  }) => unknown
}

type TreeRootPublicProps<T, U, M extends boolean> = TreeRootProps<T, U, M> & {
  'onUpdate:modelValue'?: (value: TreeModel<U, M>) => void
  'onUpdate:expanded'?: (value: string[]) => void
}

interface TreeRootSetup<T, U, M extends boolean> {
  props: TreeRootPublicProps<T, U, M>
  slots: TreeRootSlots<T, U, M>
  attrs: Record<string, unknown>
  emit: unknown
  expose: (exposed: Record<string, never>) => void
}

const TreeRootImpl = defineComponent({
  name: 'TreeRoot',
  props: {
    modelValue: { type: null, required: false },
    defaultValue: { type: null, required: false },
    items: { type: Array as PropType<TreeValue[]>, required: false },
    expanded: { type: Array as PropType<string[]>, required: false },
    defaultExpanded: { type: Array as PropType<string[]>, required: false },
    getKey: { type: Function as PropType<(value: TreeValue) => string>, required: true },
    getChildren: {
      type: Function as PropType<(value: TreeValue) => TreeValue[] | undefined>,
      required: false,
      default: defaultTreeChildren,
    },
    selectionBehavior: {
      type: String as PropType<ListboxSelectionBehavior>,
      required: false,
      default: 'toggle',
    },
    multiple: { type: Boolean, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    disabled: { type: Boolean, required: false },
    propagateSelect: { type: Boolean, required: false },
    bubbleSelect: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'ul',
    },
  },
  emits: ['update:modelValue', 'update:expanded'],
  setup(props, { emit, slots }) {
    const { items, multiple, disabled, propagateSelect, dir: propDir, bubbleSelect } = toRefs(props)
    const typeahead = createTypeahead()
    onScopeDispose(() => typeahead.dispose())
    const dir = useDirection(propDir)
    const rovingFocusGroupRef = ref<{
      getItems: () => { ref: HTMLElement; value?: unknown }[]
    }>()

    const isVirtual = ref(false)
    const virtualKeydownHook = createEventHook<KeyboardEvent>()

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : undefined),
      passive: true,
    }) as Ref<unknown>

    const expanded = useVModel(props, 'expanded', emit, {
      defaultValue: props.defaultExpanded ?? [],
      passive: props.expanded === undefined,
    }) as Ref<string[]>

    const firstValue = ref<unknown>()

    const selectedKeys = computed(() =>
      treeSelectedKeys(modelValue.value, multiple.value, props.getKey),
    )

    const expandedItems = computed(() =>
      flattenTree(
        props.items ?? [],
        { getKey: props.getKey, getChildren: props.getChildren },
        expanded.value,
      ),
    )

    function handleMultipleReplace(
      intent: Parameters<TreeRootContext['handleMultipleReplace']>[0],
      currentElement: Element | null,
      getItems: () => { ref: HTMLElement; value?: unknown }[],
      options: unknown[],
    ) {
      const value = treeRangeValues(intent, currentElement, getItems(), options, {
        firstValue: firstValue.value,
        multiple: props.multiple,
        model: modelValue.value,
      })
      if (value !== undefined) modelValue.value = value
    }

    function handleKeydown(event: KeyboardEvent) {
      if (isVirtual.value) virtualKeydownHook.trigger(event)
      else typeahead.handle(event.key, rovingFocusGroupRef.value?.getItems() ?? [])
    }

    function handleKeydownNavigation(event: KeyboardEvent) {
      if (isVirtual.value) return
      const intent = TREE_KEY_TO_INTENT[event.key]
      void nextTick(() => {
        handleMultipleReplace(
          intent,
          getActiveElement(),
          rovingFocusGroupRef.value!.getItems,
          expandedItems.value.map(item => item.value),
        )
      })
    }

    provideTreeRootContext({
      modelValue: modelValue as Ref<TreeValue | TreeValue[]>,
      selectedKeys,
      onSelect: value => {
        const next = nextTreeSelection(modelValue.value, value, {
          getKey: props.getKey,
          getChildren: props.getChildren,
          multiple: props.multiple,
          selectionBehavior: props.selectionBehavior,
          propagateSelect: props.propagateSelect,
          bubbleSelect: props.bubbleSelect,
          flattened: expandedItems.value,
        })
        if (next.anchor) firstValue.value = value
        modelValue.value = next.value
      },
      expanded,
      onToggle(value) {
        const children = value ? props.getChildren(value) : undefined
        if (!children) return
        expanded.value = toggleTreeExpanded(expanded.value, props.getKey(value) ?? value)
      },
      getKey: props.getKey,
      getChildren: props.getChildren,
      items,
      expandedItems,
      disabled,
      multiple,
      dir,
      propagateSelect,
      bubbleSelect,
      isVirtual,
      virtualKeydownHook,
      handleMultipleReplace,
    })

    const onKeydown = [
      handleKeydown,
      withKeys(withModifiers(handleKeydownNavigation as (event: Event) => void, ['shift']), [
        'up',
        'down',
      ]),
    ]

    return () =>
      h(
        RovingFocusGroup,
        { ref: rovingFocusGroupRef, 'as-child': '', orientation: 'vertical', dir: dir.value },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                role: 'tree',
                as: props.as,
                'as-child': props.asChild,
                'aria-multiselectable': multiple.value ? true : undefined,
                onKeydown,
              },
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default', {
                    flattenItems: expandedItems.value,
                    modelValue: modelValue.value,
                    expanded: expanded.value,
                  }),
                ]),
              },
            ),
          ]),
        },
      )
  },
})

export const TreeRoot = TreeRootImpl as unknown as <
  T extends TreeValue = TreeValue,
  U extends TreeValue = TreeValue,
  M extends boolean = false,
>(
  props: TreeRootPublicProps<T, U, M> & VNodeProps & AllowedComponentProps & ComponentCustomProps,
  ctx?: Pick<TreeRootSetup<T, U, M>, 'attrs' | 'slots' | 'emit'>,
  expose?: TreeRootSetup<T, U, M>['expose'],
  setup?: Promise<TreeRootSetup<T, U, M>>,
) => VNode & { __ctx?: TreeRootSetup<T, U, M> }
