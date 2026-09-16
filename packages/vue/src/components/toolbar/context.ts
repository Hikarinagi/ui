import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { ToolbarOrientation, ToolbarSize } from './types'

interface ToolbarContext {
  orientation: Readonly<Ref<ToolbarOrientation>>
  size: Readonly<Ref<ToolbarSize>>
  disabled: Readonly<Ref<boolean>>
}

const toolbarKey: InjectionKey<ToolbarContext> = Symbol('hn-toolbar')
const groupKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('hn-toolbar-group')

export function provideToolbar(context: ToolbarContext) {
  provide(toolbarKey, context)
}

export function useToolbar() {
  const context = inject(toolbarKey)
  if (!context) throw new Error('[Hina UI] Toolbar controls must be inside Toolbar.')
  return context
}

export function provideToolbarGroup(disabled: Readonly<Ref<boolean>>) {
  provide(groupKey, disabled)
}

export function useToolbarGroup() {
  return inject(groupKey, null)
}
