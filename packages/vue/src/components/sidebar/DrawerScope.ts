import { defineComponent, h, ref } from 'vue'
import { provideSidebar, type SidebarState } from './context'

export default defineComponent({
  name: 'HnSidebarDrawerScope',
  setup(_, { slots }) {
    provideSidebar({
      state: ref<SidebarState>('expanded'),
      toggle: () => {},
      openMobile: () => {},
    })
    return () => h('div', { class: 'contents' }, slots.default?.())
  },
})
