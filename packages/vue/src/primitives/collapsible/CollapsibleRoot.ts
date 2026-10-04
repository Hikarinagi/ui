import { defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { provideCollapsibleRootContext } from './context'

export interface CollapsibleRootProps {
  defaultOpen?: boolean
  open?: boolean
  disabled?: boolean
  unmountOnHide?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type CollapsibleRootEmits = {
  'update:open': [value: boolean]
}

export const CollapsibleRoot = defineComponent({
  name: 'CollapsibleRoot',
  props: {
    defaultOpen: { type: Boolean, required: false, default: false },
    open: { type: Boolean, required: false, default: undefined },
    disabled: { type: Boolean, required: false },
    unmountOnHide: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['update:open'],
  setup(props, { emit, expose, slots }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    })
    const { disabled, unmountOnHide } = toRefs(props)
    provideCollapsibleRootContext({
      contentId: '',
      disabled,
      open,
      unmountOnHide,
      onOpenToggle: () => {
        if (disabled.value) return
        open.value = !open.value
      },
    })
    expose({ open })
    useForwardExpose()

    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          'data-state': openState(open.value),
          'data-disabled': disabled.value ? '' : undefined,
        },
        { default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]) },
      )
  },
})
