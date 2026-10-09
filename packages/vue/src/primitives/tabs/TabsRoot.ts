import {
  defineComponent,
  h,
  ref,
  renderSlot,
  shallowRef,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { TabsActivationMode, TabsValue } from '../../../../shared/src/primitives/tabs'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { useVModel } from '../utils/useVModel'
import { provideTabsRootContext } from './context'

export interface TabsRootProps {
  defaultValue?: TabsValue
  orientation?: Orientation
  dir?: Direction
  activationMode?: TabsActivationMode
  modelValue?: TabsValue
  unmountOnHide?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type TabsRootEmits = {
  'update:modelValue': [value: TabsValue]
}

export const TabsRoot = defineComponent({
  name: 'TabsRoot',
  props: {
    defaultValue: { type: null as unknown as PropType<TabsValue>, required: false },
    orientation: { type: String as PropType<Orientation>, required: false, default: 'horizontal' },
    dir: { type: String as PropType<Direction>, required: false },
    activationMode: {
      type: String as PropType<TabsActivationMode>,
      required: false,
      default: 'automatic',
    },
    modelValue: { type: null as unknown as PropType<TabsValue>, required: false },
    unmountOnHide: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { orientation, unmountOnHide, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    useForwardExpose()
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === undefined,
    })
    const tabsList = ref<HTMLElement>()
    const contentIds = shallowRef(new Set<TabsValue>())

    provideTabsRootContext({
      modelValue,
      changeModelValue: value => {
        modelValue.value = value
      },
      orientation,
      dir,
      unmountOnHide,
      activationMode: props.activationMode,
      baseId: useId(undefined, 'reka-tabs'),
      tabsList,
      contentIds,
      registerContent: value => {
        contentIds.value = new Set([...contentIds.value, value])
      },
      unregisterContent: value => {
        const next = new Set(contentIds.value)
        next.delete(value)
        contentIds.value = next
      },
    })

    return () =>
      h(
        Primitive,
        {
          dir: dir.value,
          'data-orientation': orientation.value,
          'as-child': props.asChild,
          as: props.as,
        },
        {
          default: withCtx(() => [renderSlot(slots, 'default', { modelValue: modelValue.value })]),
        },
      )
  },
})
