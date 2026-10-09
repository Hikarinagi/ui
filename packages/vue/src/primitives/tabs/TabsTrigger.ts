import {
  computed,
  defineComponent,
  h,
  renderSlot,
  withCtx,
  withKeys,
  withModifiers,
  type PropType,
} from 'vue'
import {
  activatesOnFocus,
  makeContentId,
  makeTriggerId,
  tabsState,
  type TabsValue,
} from '../../../../shared/src/primitives/tabs'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectTabsRootContext } from './context'

export interface TabsTriggerProps {
  value: TabsValue
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TabsTrigger = defineComponent({
  name: 'TabsTrigger',
  props: {
    value: { type: [String, Number] as PropType<TabsValue>, required: true },
    disabled: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectTabsRootContext()
    const triggerId = computed(() => makeTriggerId(rootContext.baseId, props.value))
    const contentId = computed(() =>
      rootContext.contentIds.value.has(props.value)
        ? makeContentId(rootContext.baseId, props.value)
        : undefined,
    )
    const isSelected = computed(() => props.value === rootContext.modelValue.value)

    const onMousedown = withModifiers(
      ((event: MouseEvent) => {
        if (!props.disabled && event.ctrlKey === false) rootContext.changeModelValue(props.value)
        else event.preventDefault()
      }) as (event: Event) => void,
      ['left'],
    )
    const onKeydown = withKeys(() => rootContext.changeModelValue(props.value), ['enter', 'space'])
    const onFocus = () => {
      if (activatesOnFocus(rootContext.activationMode, isSelected.value, props.disabled))
        rootContext.changeModelValue(props.value)
    }

    return () =>
      h(
        RovingFocusItem,
        { 'as-child': '', focusable: !props.disabled, active: isSelected.value },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                id: triggerId.value,
                ref: forwardRef,
                role: 'tab',
                type: props.as === 'button' ? 'button' : undefined,
                as: props.as,
                'as-child': props.asChild,
                'aria-selected': isSelected.value ? 'true' : 'false',
                'aria-controls': contentId.value,
                'data-state': tabsState(isSelected.value),
                disabled: props.disabled,
                'data-disabled': props.disabled ? '' : undefined,
                'data-orientation': rootContext.orientation.value,
                onMousedown,
                onKeydown,
                onFocus,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
