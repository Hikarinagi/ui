import { defineComponent, ref, renderSlot } from 'vue'
import type { ReferenceElement } from '@floating-ui/vue'
import { providePopperRootContext } from './context'

export const PopperRoot = defineComponent({
  name: 'PopperRoot',
  inheritAttrs: false,
  setup(_, { slots }) {
    const anchor = ref<ReferenceElement>()
    providePopperRootContext({
      anchor,
      onAnchorChange: element => (anchor.value = element),
    })
    return () => renderSlot(slots, 'default')
  },
})
