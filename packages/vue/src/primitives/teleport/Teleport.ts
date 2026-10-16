import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  renderSlot,
  Teleport as VueTeleport,
  type PropType,
} from 'vue'
import { useMounted } from '@vueuse/core'
import { injectConfigProviderContext } from '../utils/config'

export interface TeleportProps {
  to?: string | HTMLElement
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
}

export const Teleport = defineComponent({
  name: 'TeleportPrimitive',
  props: {
    to: { type: null as unknown as PropType<string | HTMLElement>, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  setup(props, { slots }) {
    const configContext = injectConfigProviderContext({})
    const target = computed(() => props.to ?? configContext.teleportTo?.value ?? 'body')
    const isMounted = useMounted()
    return () =>
      isMounted.value || props.forceMount
        ? h(
            VueTeleport,
            { key: 0, to: target.value, disabled: props.disabled, defer: props.defer },
            [renderSlot(slots, 'default')],
          )
        : createCommentVNode('v-if', true)
  },
})
