import { computed, ref, type Ref } from 'vue'
import { injectConfigProviderContext } from './config'

export function useLocale(locale?: Ref<string | undefined>) {
  const context = injectConfigProviderContext({ locale: ref('en') })
  return computed(() => locale?.value || context.locale?.value || 'en')
}
