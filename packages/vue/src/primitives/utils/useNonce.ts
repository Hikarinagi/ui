import { computed, ref, type Ref } from 'vue'
import { injectConfigProviderContext } from './config'

export function useNonce(nonce?: Ref<string | undefined>) {
  const context = injectConfigProviderContext({ nonce: ref<string>() })
  return computed(() => nonce?.value || context.nonce?.value)
}
