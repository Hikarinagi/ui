import {
  defineComponent,
  guardReactiveProps,
  h,
  normalizeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { Teleport } from '../teleport'

export interface DialogPortalProps {
  to?: string | HTMLElement
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
}

export const DialogPortal = defineComponent({
  name: 'DialogPortal',
  props: {
    to: { type: null as unknown as PropType<string | HTMLElement>, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  setup(props, { slots }) {
    return () =>
      h(Teleport, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
