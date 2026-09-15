import { defineComponent, h, ref, type PropType } from 'vue'
import { provideSidebar, type SidebarState } from './context'

export default defineComponent({
  name: 'HnSidebarDrawerScope',
  props: {
    close: { type: Function as PropType<() => void>, required: true },
  },
  setup(props, { slots }) {
    provideSidebar({
      state: ref<SidebarState>('expanded'),
      toggle: () => props.close(),
      openMobile: () => {},
      inDrawer: true,
    })
    return () =>
      h(
        'div',
        { class: 'flex min-h-0 flex-1 flex-col overflow-hidden px-(--hn-panel-p)' },
        slots.default?.(),
      )
  },
})
