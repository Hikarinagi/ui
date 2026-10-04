import { computed, ref, type Ref } from 'vue'
import { injectConfigProviderContext } from './config'

export type Direction = 'ltr' | 'rtl'

export function useDirection(dir?: Ref<Direction | undefined>) {
  const context = injectConfigProviderContext({ dir: ref<Direction>('ltr') })
  return computed(() => dir?.value || context.dir?.value || 'ltr')
}
