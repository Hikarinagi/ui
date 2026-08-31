import { inject, provide, type InjectionKey, type Ref } from 'vue'

export type SidebarState = 'expanded' | 'rail' | 'hidden'

export interface SidebarContext {
  state: Readonly<Ref<SidebarState>>
  toggle: () => void
  openMobile: () => void
  inDrawer?: boolean
}

const SIDEBAR_KEY = Symbol('hn-sidebar') as InjectionKey<SidebarContext>

export function provideSidebar(context: SidebarContext) {
  provide(SIDEBAR_KEY, context)
}

export function useSidebar() {
  return inject(SIDEBAR_KEY, null)
}
