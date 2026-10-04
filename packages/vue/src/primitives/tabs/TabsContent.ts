import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  ref,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { isCollapsibleContentRendered } from '../../../../shared/src/primitives/collapsible'
import {
  makeContentId,
  makeTriggerId,
  tabsState,
  type TabsValue,
} from '../../../../shared/src/primitives/tabs'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectTabsRootContext } from './context'

export interface TabsContentProps {
  value: TabsValue
  forceMount?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TabsContent = defineComponent({
  name: 'TabsContent',
  props: {
    value: { type: [String, Number] as PropType<TabsValue>, required: true },
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectTabsRootContext()
    const triggerId = computed(() => makeTriggerId(rootContext.baseId, props.value))
    const contentId = computed(() => makeContentId(rootContext.baseId, props.value))
    const isSelected = computed(() => props.value === rootContext.modelValue.value)
    const isMountAnimationPrevented = ref(isSelected.value)

    onMounted(() => {
      rootContext.registerContent(props.value)
      requestAnimationFrame(() => {
        isMountAnimationPrevented.value = false
      })
    })
    onBeforeUnmount(() => {
      rootContext.unregisterContent(props.value)
    })

    return () =>
      h(
        Presence,
        { present: props.forceMount || isSelected.value, forceMount: true },
        {
          default: withCtx(({ present }: { present: boolean }) => [
            h(
              Primitive,
              {
                id: contentId.value,
                ref: forwardRef,
                'as-child': props.asChild,
                as: props.as,
                role: 'tabpanel',
                'data-state': tabsState(isSelected.value),
                'data-orientation': rootContext.orientation.value,
                'aria-labelledby': triggerId.value,
                hidden: !present,
                tabindex: '0',
                style: normalizeStyle({
                  animationDuration: isMountAnimationPrevented.value ? '0s' : undefined,
                }),
              },
              {
                default: withCtx(() => [
                  isCollapsibleContentRendered(present, rootContext.unmountOnHide.value)
                    ? renderSlot(slots, 'default', { key: 0 })
                    : createCommentVNode('v-if', true),
                ]),
              },
            ),
          ]),
        },
      )
  },
})
