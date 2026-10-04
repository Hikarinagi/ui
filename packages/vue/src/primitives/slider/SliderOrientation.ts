import {
  computed,
  defineComponent,
  h,
  normalizeStyle,
  renderSlot,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import {
  createSlideGeometry,
  sliderOrientationState,
  sliderStepDirection,
  type SliderOrientation,
} from '../../../../shared/src/primitives/slider'
import type { Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectSliderRootContext, provideSliderOrientationContext } from './context'
import { SliderImpl } from './SliderImpl'

function defineSliderOrientation(orientation: SliderOrientation, name: string) {
  const horizontal = orientation === 'horizontal'
  return defineComponent({
    name,
    props: {
      ...(horizontal ? { dir: { type: String as PropType<Direction>, required: false } } : {}),
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      inverted: { type: Boolean, required: true },
    },
    emits: ['slideEnd', 'slideStart', 'slideMove', 'homeKeyDown', 'endKeyDown', 'stepKeyDown'],
    setup(props, { emit, slots }) {
      const { max, min, inverted } = toRefs(props)
      const dir = computed(() => (props as { dir?: Direction }).dir)
      const { forwardRef, currentElement: sliderElement } = useForwardExpose()
      const rootContext = injectSliderRootContext()
      const geometry = createSlideGeometry(horizontal ? 'x' : 'y')
      const state = computed(() =>
        sliderOrientationState(
          orientation,
          dir.value,
          inverted.value,
          rootContext.thumbAlignment.value,
        ),
      )

      function getValueFromPointerEvent(event: PointerEvent, slideStart = false) {
        const thumb = [...rootContext.thumbElements.value][rootContext.valueIndexToChangeRef.value]!
        return geometry.value(event, slideStart, {
          element: sliderElement.value,
          thumb,
          contain: rootContext.thumbAlignment.value === 'contain',
          output: state.value.increasing ? [min.value, max.value] : [max.value, min.value],
        })
      }

      provideSliderOrientationContext({
        startEdge: computed(() => state.value.startEdge),
        endEdge: computed(() => state.value.endEdge),
        direction: computed(() => state.value.direction),
        size: horizontal ? 'width' : 'height',
      })

      const onSlideStart = (event: PointerEvent) =>
        emit('slideStart', getValueFromPointerEvent(event, true))
      const onSlideMove = (event: PointerEvent) =>
        emit('slideMove', getValueFromPointerEvent(event))
      const onSlideEnd = () => {
        geometry.reset()
        emit('slideEnd')
      }
      const onStepKeyDown = (event: KeyboardEvent) =>
        emit('stepKeyDown', event, sliderStepDirection(state.value.slideDirection, event.key))
      const onEndKeyDown = (event: KeyboardEvent) => emit('endKeyDown', event)
      const onHomeKeyDown = (event: KeyboardEvent) => emit('homeKeyDown', event)

      return () =>
        h(
          SliderImpl,
          {
            ref: forwardRef,
            ...(horizontal ? { dir: dir.value } : {}),
            'data-orientation': orientation,
            style: normalizeStyle({ '--reka-slider-thumb-transform': state.value.thumbTransform }),
            onSlideStart,
            onSlideMove,
            onSlideEnd,
            onStepKeyDown,
            onEndKeyDown,
            onHomeKeyDown,
          },
          { default: withCtx(() => [renderSlot(slots, 'default')]) },
        )
    },
  })
}

export const SliderHorizontal = defineSliderOrientation('horizontal', 'SliderHorizontal')
export const SliderVertical = defineSliderOrientation('vertical', 'SliderVertical')
