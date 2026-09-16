import { Fragment, createVNode, type SetupContext, type VNodeChild } from 'vue'

export default function DataTableSlot(
  props: { render?: (context: never) => unknown; context?: unknown },
  { slots }: SetupContext,
) {
  return createVNode(
    Fragment,
    null,
    (props.render ? props.render(props.context as never) : slots.default?.()) as VNodeChild,
  )
}
