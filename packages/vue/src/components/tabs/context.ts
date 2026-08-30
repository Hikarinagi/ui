import { inject, provide, type InjectionKey } from 'vue'
import type { TabsVariants } from './tabs.variants'

export interface TabsStyleContext {
  variant: NonNullable<TabsVariants['variant']>
  size: NonNullable<TabsVariants['size']>
  orientation: NonNullable<TabsVariants['orientation']>
}

const TABS_STYLE_KEY: InjectionKey<TabsStyleContext> = Symbol('hn-tabs-style')

export function provideTabsStyle(ctx: TabsStyleContext) {
  provide(TABS_STYLE_KEY, ctx)
}

export function useTabsStyle(): TabsStyleContext {
  return inject(TABS_STYLE_KEY, { variant: 'underline', size: 'md', orientation: 'horizontal' })
}
