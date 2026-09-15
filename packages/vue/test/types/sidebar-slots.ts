import { expectTypeOf } from 'vitest'
import { Sidebar, type SidebarState } from '../../src'

type Slots = InstanceType<typeof Sidebar>['$slots']
expectTypeOf<Parameters<NonNullable<Slots['icon']>>[0]>().toEqualTypeOf<{ state: SidebarState }>()
expectTypeOf<Parameters<NonNullable<Slots['wordmark']>>[0]>().toEqualTypeOf<{
  state: SidebarState
}>()
expectTypeOf<Parameters<NonNullable<Slots['header']>>[0]>().toEqualTypeOf<{ state: SidebarState }>()
expectTypeOf<Parameters<NonNullable<Slots['footer']>>[0]>().toEqualTypeOf<{ state: SidebarState }>()
