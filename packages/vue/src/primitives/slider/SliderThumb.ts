import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onMounted,
  onUnmounted,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { useMounted } from '@vueuse/core'
import {
  convertValueToPercentage,
  getLabel,
  sliderThumbOffset,
} from '../../../../shared/src/primitives/slider'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useSize } from '../utils/useSize'
import { injectSliderOrientationContext, injectSliderRootContext } from './context'

export interface SliderThumbProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

const SliderThumbImpl = defineComponent({
  name: 'SliderThumbImpl',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { attrs, slots }) {
    const rootContext = injectSliderRootContext()
    const orientation = injectSliderOrientationContext()
    const { forwardRef, currentElement: thumbElement } = useForwardExpose()
    const { CollectionItem } = useCollection()
    const value = computed(() => rootContext.modelValue?.value?.[props.index])
    const percent = computed(() =>
      value.value === undefined
        ? 0
        : convertValueToPercentage(
            value.value,
            rootContext.min.value ?? 0,
            rootContext.max.value ?? 100,
          ),
    )
    const label = computed(() => getLabel(props.index, rootContext.modelValue?.value?.length ?? 0))
    const size = useSize(thumbElement)
    const orientationSize = computed(() => size[orientation.size].value)
    const thumbInBoundsOffset = computed(() =>
      sliderThumbOffset(
        rootContext.thumbAlignment.value,
        orientationSize.value,
        percent.value,
        orientation.direction.value,
      ),
    )
    const isMounted = useMounted()

    onMounted(() => {
      rootContext.thumbElements.value.push(thumbElement.value)
    })
    onUnmounted(() => {
      const index = rootContext.thumbElements.value.findIndex(
        element => element === thumbElement.value,
      )
      rootContext.thumbElements.value.splice(index, 1)
    })

    const onFocus = () => {
      rootContext.valueIndexToChangeRef.value = props.index
    }

    return () =>
      h(CollectionItem, null, {
        default: withCtx(() => [
          h(
            Primitive,
            mergeProps(attrs, {
              ref: forwardRef,
              role: 'slider',
              tabindex: rootContext.disabled.value ? undefined : 0,
              'aria-label': attrs['aria-label'] || label.value,
              'data-disabled': rootContext.disabled.value ? '' : undefined,
              'data-orientation': rootContext.orientation.value,
              'aria-valuenow': value.value,
              'aria-valuemin': rootContext.min.value,
              'aria-valuemax': rootContext.max.value,
              'aria-orientation': rootContext.orientation.value,
              'as-child': props.asChild,
              as: props.as,
              style: {
                transform: 'var(--reka-slider-thumb-transform)',
                position: 'absolute',
                [orientation.startEdge.value]:
                  `calc(${percent.value}% + ${thumbInBoundsOffset.value}px)`,
                display: !isMounted.value && value.value === undefined ? 'none' : undefined,
              },
              onFocus,
            }),
            { default: withCtx(() => [renderSlot(slots, 'default')]) },
          ),
        ]),
      })
  },
})

export const SliderThumb = defineComponent({
  name: 'SliderThumb',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
  },
  setup(props, { slots }) {
    const { getItems } = useCollection()
    const { forwardRef, currentElement: thumbElement } = useForwardExpose()
    const index = computed(() =>
      thumbElement.value ? getItems(true).findIndex(item => item.ref === thumbElement.value) : -1,
    )

    return () =>
      h(
        SliderThumbImpl,
        mergeProps({ ref: forwardRef }, props, { index: index.value }) as { index: number },
        {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        },
      )
  },
})
