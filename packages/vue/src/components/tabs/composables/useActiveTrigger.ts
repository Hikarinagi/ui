import { shallowRef, watchPostEffect, type ComponentPublicInstance, type ShallowRef } from 'vue'
import { injectTabsRootContext } from 'reka-ui'

export function useActiveTrigger(listRef: ShallowRef<ComponentPublicInstance | null>) {
  const root = injectTabsRootContext()
  const active = shallowRef<HTMLElement | null>(null)

  watchPostEffect(() => {
    void root.modelValue.value
    const el = listRef.value?.$el as HTMLElement | undefined
    active.value = el?.querySelector<HTMLElement>('[role="tab"][data-state="active"]') ?? null
  })

  return active
}
