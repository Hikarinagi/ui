import {
  computed,
  defineComponent,
  h,
  mergeProps,
  normalizeStyle,
  ref,
  renderSlot,
  watchEffect,
  watchPostEffect,
  withCtx,
  withMemo,
  type PropType,
  type VNode,
} from 'vue'
import { autoUpdate, useFloating, type ReferenceElement } from '@floating-ui/vue'
import {
  getSideAndAlignFromPlacement,
  POPPER_CONTENT_DEFAULTS,
  popperMiddleware,
  popperPlacement,
  popperWrapperStyle,
  shouldHidePopperArrow,
  type Align,
  type PopperSticky,
  type PopperStrategy,
  type PopperUpdateStrategy,
  type Side,
} from '../../../../shared/src/primitives/popper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useSize } from '../utils/useSize'
import { injectPopperRootContext, providePopperContentContext } from './context'

export interface PopperContentProps {
  memoDependencies?: unknown[]
  side?: Side
  sideOffset?: number
  sideFlip?: boolean
  align?: Align
  alignOffset?: number
  alignFlip?: boolean
  avoidCollisions?: boolean
  collisionBoundary?: Element | null | Array<Element | null>
  collisionPadding?: number | Partial<Record<Side, number>>
  arrowPadding?: number
  hideShiftedArrow?: boolean
  sticky?: PopperSticky
  hideWhenDetached?: boolean
  positionStrategy?: PopperStrategy
  updatePositionStrategy?: PopperUpdateStrategy
  disableUpdateOnLayoutShift?: boolean
  prioritizePosition?: boolean
  reference?: ReferenceElement
  dir?: Direction
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const popperContentProps = {
  memoDependencies: { type: Array as PropType<unknown[]>, required: false },
  side: {
    type: null as unknown as PropType<Side>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.side,
  },
  sideOffset: { type: Number, required: false, default: POPPER_CONTENT_DEFAULTS.sideOffset },
  sideFlip: { type: Boolean, required: false, default: POPPER_CONTENT_DEFAULTS.sideFlip },
  align: {
    type: null as unknown as PropType<Align>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.align,
  },
  alignOffset: { type: Number, required: false, default: POPPER_CONTENT_DEFAULTS.alignOffset },
  alignFlip: { type: Boolean, required: false, default: POPPER_CONTENT_DEFAULTS.alignFlip },
  avoidCollisions: {
    type: Boolean,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.avoidCollisions,
  },
  collisionBoundary: {
    type: null as unknown as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.collisionBoundary,
  },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.collisionPadding,
  },
  arrowPadding: { type: Number, required: false, default: POPPER_CONTENT_DEFAULTS.arrowPadding },
  hideShiftedArrow: {
    type: Boolean,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.hideShiftedArrow,
  },
  sticky: {
    type: String as PropType<PopperSticky>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.sticky,
  },
  hideWhenDetached: {
    type: Boolean,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.hideWhenDetached,
  },
  positionStrategy: {
    type: String as PropType<PopperStrategy>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.positionStrategy,
  },
  updatePositionStrategy: {
    type: String as PropType<PopperUpdateStrategy>,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.updatePositionStrategy,
  },
  disableUpdateOnLayoutShift: { type: Boolean, required: false },
  prioritizePosition: {
    type: Boolean,
    required: false,
    default: POPPER_CONTENT_DEFAULTS.prioritizePosition,
  },
  reference: { type: null as unknown as PropType<ReferenceElement>, required: false },
  dir: { type: String as PropType<Direction>, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
}

export const PopperContent = defineComponent({
  name: 'PopperContent',
  inheritAttrs: false,
  props: popperContentProps,
  emits: ['placed'],
  setup(props, { emit, attrs, slots }) {
    const rootContext = injectPopperRootContext()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const dir = useDirection(computed(() => props.dir))
    const floatingRef = ref<HTMLElement>()
    const arrow = ref<HTMLElement>()
    const { width: arrowWidth, height: arrowHeight } = useSize(arrow)
    const desiredPlacement = computed(() => popperPlacement(props.side, props.align))

    const computedMiddleware = computed(() =>
      popperMiddleware({
        sideOffset: props.sideOffset,
        alignOffset: props.alignOffset,
        sideFlip: props.sideFlip,
        alignFlip: props.alignFlip,
        avoidCollisions: props.avoidCollisions,
        prioritizePosition: props.prioritizePosition,
        sticky: props.sticky,
        collisionPadding: props.collisionPadding,
        collisionBoundary: props.collisionBoundary,
        arrow: arrow.value,
        arrowWidth: arrowWidth.value,
        arrowHeight: arrowHeight.value,
        arrowPadding: props.arrowPadding,
        hideWhenDetached: props.hideWhenDetached,
        dir: dir.value,
        prefix: 'reka',
      }),
    )

    const reference = computed(() => props.reference ?? rootContext.anchor.value)
    const { floatingStyles, placement, isPositioned, middlewareData } = useFloating(
      reference,
      floatingRef,
      {
        strategy: props.positionStrategy,
        placement: desiredPlacement,
        whileElementsMounted: (...args) =>
          autoUpdate(...args, {
            layoutShift: !props.disableUpdateOnLayoutShift,
            animationFrame: props.updatePositionStrategy === 'always',
          }),
        middleware: computedMiddleware,
      },
    )

    const placedSide = computed(() => getSideAndAlignFromPlacement(placement.value)[0])
    const placedAlign = computed(() => getSideAndAlignFromPlacement(placement.value)[1])

    watchPostEffect(() => {
      if (isPositioned.value) emit('placed')
    })

    const shouldHideArrow = computed(() =>
      shouldHidePopperArrow(props.hideShiftedArrow, middlewareData.value),
    )

    const contentZIndex = ref('')
    watchEffect(() => {
      if (contentElement.value)
        contentZIndex.value = window.getComputedStyle(contentElement.value).zIndex
    })

    const arrowX = computed(() => middlewareData.value.arrow?.x ?? 0)
    const arrowY = computed(() => middlewareData.value.arrow?.y ?? 0)

    providePopperContentContext({
      placedSide,
      onArrowChange: element => (arrow.value = element),
      arrowX,
      arrowY,
      shouldHideArrow,
    })

    const cache: VNode[] = []

    function content(key: number, withDir: boolean) {
      return h(
        Primitive,
        mergeProps({ key, ref: forwardRef }, attrs, {
          'as-child': props.asChild,
          as: props.as,
          'data-side': placedSide.value,
          'data-align': placedAlign.value,
          ...(withDir ? { dir: dir.value } : {}),
          style: { animation: !isPositioned.value ? 'none' : undefined },
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
    }

    return () =>
      h(
        'div',
        {
          ref: floatingRef,
          'data-reka-popper-content-wrapper': '',
          dir: dir.value,
          style: normalizeStyle(
            popperWrapperStyle(floatingStyles.value, {
              isPositioned: isPositioned.value,
              zIndex: contentZIndex.value,
              middlewareData: middlewareData.value,
              prefix: 'reka',
            }),
          ),
        },
        [
          props.memoDependencies
            ? withMemo(
                [
                  props.asChild,
                  props.as,
                  placedSide.value,
                  placedAlign.value,
                  isPositioned.value,
                  ...Object.values(attrs),
                  ...props.memoDependencies,
                ],
                () => content(0, false),
                cache,
                0,
              )
            : content(1, true),
        ],
      )
  },
})
