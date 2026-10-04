import {
  createTextVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  renderSlot,
  toDisplayString,
  withCtx,
  type PropType,
} from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Separator } from '../separator'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectStepperItemContext, injectStepperRootContext } from './context'

export interface StepperPartProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

function asProp(fallback: string) {
  return {
    type: null as unknown as PropType<PrimitiveProps['as']>,
    required: false,
    default: fallback,
  } as const
}

export const StepperIndicator = defineComponent({
  name: 'StepperIndicator',
  props: { asChild: { type: Boolean, required: false }, as: asProp('span') },
  setup(props, { slots }) {
    const itemContext = injectStepperItemContext()
    useForwardExpose()
    return () =>
      h(Primitive, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [
          renderSlot(slots, 'default', { step: itemContext.step.value }, () => [
            createTextVNode(' Step ' + toDisplayString(itemContext.step.value), 1),
          ]),
        ]),
      })
  },
})

export const StepperTitle = defineComponent({
  name: 'StepperTitle',
  props: { asChild: { type: Boolean, required: false }, as: asProp('h4') },
  setup(props, { slots }) {
    const itemContext = injectStepperItemContext()
    useForwardExpose()
    return () =>
      h(Primitive, mergeProps(props, { id: itemContext.titleId }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const StepperDescription = defineComponent({
  name: 'StepperDescription',
  props: { asChild: { type: Boolean, required: false }, as: asProp('p') },
  setup(props, { slots }) {
    useForwardExpose()
    const itemContext = injectStepperItemContext()
    return () =>
      h(Primitive, mergeProps(props, { id: itemContext.descriptionId }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export interface StepperSeparatorProps extends StepperPartProps {
  orientation?: Orientation
  decorative?: boolean
}

export const StepperSeparator = defineComponent({
  name: 'StepperSeparator',
  props: {
    orientation: { type: String as PropType<Orientation>, required: false },
    decorative: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectStepperRootContext()
    const itemContext = injectStepperItemContext()
    useForwardExpose()
    return () =>
      h(
        Separator,
        mergeProps(props, {
          decorative: '',
          orientation: rootContext.orientation.value,
          'data-state': itemContext.state.value,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
