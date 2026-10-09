import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { ARROW_KEYS, PAGE_KEYS } from '../../../../shared/src/primitives/slider'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectSliderRootContext } from './context'

export const SliderImpl = defineComponent({
  name: 'SliderImpl',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
  },
  emits: ['slideStart', 'slideMove', 'slideEnd', 'homeKeyDown', 'endKeyDown', 'stepKeyDown'],
  setup(props, { emit, slots }) {
    const rootContext = injectSliderRootContext()

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Home') {
        emit('homeKeyDown', event)
        event.preventDefault()
      } else if (event.key === 'End') {
        emit('endKeyDown', event)
        event.preventDefault()
      } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
        emit('stepKeyDown', event)
        event.preventDefault()
      }
    }

    function onPointerdown(event: PointerEvent) {
      const target = event.target as HTMLElement
      target.setPointerCapture(event.pointerId)
      event.preventDefault()
      if (rootContext.thumbElements.value.includes(target)) target.focus()
      else emit('slideStart', event)
    }

    function onPointermove(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (target.hasPointerCapture(event.pointerId)) emit('slideMove', event)
    }

    function onPointerup(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId)
        emit('slideEnd', event)
      }
    }

    return () =>
      h(
        Primitive,
        mergeProps({ 'data-slider-impl': '' }, props, {
          onKeydown,
          onPointerdown,
          onPointermove,
          onPointerup,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
