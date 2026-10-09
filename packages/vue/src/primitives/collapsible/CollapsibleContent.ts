import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  ref,
  renderSlot,
  watch,
  withCtx,
  type PropType,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  isCollapsibleContentRendered,
  measureCollapsibleContent,
  openState,
  type CollapsibleMotion,
} from '../../../../shared/src/primitives/collapsible'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectCollapsibleRootContext } from './context'

export interface CollapsibleContentProps {
  forceMount?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type CollapsibleContentEmits = {
  contentFound: []
}

export const CollapsibleContent = defineComponent({
  name: 'CollapsibleContent',
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['contentFound'],
  setup(props, { emit, attrs, slots }) {
    const rootContext = injectCollapsibleRootContext()
    rootContext.contentId ||= useId(undefined, 'reka-collapsible-content')
    const presentRef = ref<{ present: boolean }>()
    const { forwardRef, currentElement } = useForwardExpose()
    const width = ref(0)
    const height = ref(0)
    const isOpen = computed(() => rootContext.open.value)
    const isMountAnimationPrevented = ref(isOpen.value)
    let motion: CollapsibleMotion | undefined

    watch(
      () => [isOpen.value, presentRef.value?.present],
      async () => {
        await nextTick()
        const node = currentElement.value
        if (!node) return
        const measured = measureCollapsibleContent(node, motion, isMountAnimationPrevented.value)
        motion = measured.motion
        height.value = measured.height
        width.value = measured.width
      },
      { immediate: true },
    )

    const skipAnimation = computed(() => isMountAnimationPrevented.value && rootContext.open.value)

    onMounted(() => {
      requestAnimationFrame(() => {
        isMountAnimationPrevented.value = false
      })
    })

    useEventListener(currentElement, 'beforematch', () => {
      requestAnimationFrame(() => {
        rootContext.onOpenToggle()
        emit('contentFound')
      })
    })

    return () =>
      h(
        Presence,
        { ref: presentRef, present: props.forceMount || rootContext.open.value, forceMount: true },
        {
          default: withCtx(({ present }: { present: boolean }) => [
            h(
              Primitive,
              mergeProps(attrs, {
                id: rootContext.contentId,
                ref: forwardRef,
                'as-child': props.asChild,
                as: props.as,
                hidden: !present
                  ? rootContext.unmountOnHide.value
                    ? ''
                    : 'until-found'
                  : undefined,
                'data-state': skipAnimation.value ? undefined : openState(rootContext.open.value),
                'data-disabled': rootContext.disabled?.value ? '' : undefined,
                style: {
                  '--reka-collapsible-content-height': `${height.value}px`,
                  '--reka-collapsible-content-width': `${width.value}px`,
                },
              }),
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
