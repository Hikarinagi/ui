import { computed, defineComponent, h, renderSlot, withCtx, withKeys, type PropType } from 'vue'
import { isAccordionItemOpen, navigateAccordion } from '../../../../shared/src/primitives/accordion'
import { COLLECTION_ITEM } from '../../../../shared/src/primitives/collection'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { CollapsibleRoot } from '../collapsible'
import type { PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectAccordionRootContext, provideAccordionItemContext } from './context'

export interface AccordionItemProps {
  disabled?: boolean
  value: string
  unmountOnHide?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const AccordionItem = defineComponent({
  name: 'AccordionItem',
  props: {
    disabled: { type: Boolean, required: false },
    value: { type: String, required: true },
    unmountOnHide: { type: Boolean, required: false, default: undefined },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { expose, slots }) {
    const rootContext = injectAccordionRootContext()
    const open = computed(() =>
      isAccordionItemOpen(rootContext.isSingle.value, rootContext.modelValue.value, props.value),
    )
    const disabled = computed(() => rootContext.disabled.value || props.disabled)
    const dataDisabled = computed(() => (disabled.value ? ('' as const) : undefined))
    const dataState = computed(() => openState(open.value))
    expose({ open, dataDisabled })
    const { currentRef, currentElement } = useForwardExpose()

    provideAccordionItemContext({
      open,
      dataState,
      disabled,
      dataDisabled,
      triggerId: '',
      currentRef,
      currentElement,
      value: computed(() => props.value),
    })

    function handleArrowKey(event: KeyboardEvent) {
      navigateAccordion(event, rootContext.parentElement.value, {
        orientation: rootContext.orientation,
        dir: rootContext.direction.value,
        attributeName: `[${COLLECTION_ITEM}]`,
      })
    }

    const onKeydown = withKeys(handleArrowKey as (event: Event) => void, [
      'up',
      'down',
      'left',
      'right',
      'home',
      'end',
    ])

    return () =>
      h(
        CollapsibleRoot,
        {
          'data-orientation': rootContext.orientation,
          'data-disabled': dataDisabled.value,
          'data-state': dataState.value,
          disabled: disabled.value,
          open: open.value,
          as: props.as,
          'as-child': props.asChild,
          'unmount-on-hide': props.unmountOnHide ?? rootContext.unmountOnHide.value,
          onKeydown,
        },
        { default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]) },
      )
  },
})
