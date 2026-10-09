import { inject, provide, type InjectionKey, type Ref } from 'vue'

export type SidebarState = 'expanded' | 'rail' | 'hidden'

export interface SidebarContext {
  state: Readonly<Ref<SidebarState>>
  toggle: () => void
  openMobile: () => void
  inDrawer?: boolean
  onTransitionRun?: (event: TransitionEvent) => void
}

const SIDEBAR_KEY = Symbol('hn-sidebar') as InjectionKey<SidebarContext>
const SIDEBAR_SCOPE_KEY = Symbol('hn-sidebar-scope') as InjectionKey<boolean>

export function provideSidebar(context: SidebarContext) {
  provide(SIDEBAR_KEY, context)
}

export function useSidebar() {
  return inject(SIDEBAR_KEY, null)
}

export function provideSidebarScope() {
  provide(SIDEBAR_SCOPE_KEY, true)
}

export function useInSidebar() {
  return inject(SIDEBAR_SCOPE_KEY, false)
}
