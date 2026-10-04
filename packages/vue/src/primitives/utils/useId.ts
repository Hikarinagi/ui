import { useId as useVueId } from 'vue'
import { injectConfigProviderContext } from './config'

export function useId(deterministicId?: string | null, prefix = 'reka') {
  if (deterministicId) return deterministicId
  const config = injectConfigProviderContext({ useId: undefined })
  const id = config.useId ? config.useId() : useVueId()
  return prefix ? `${prefix}-${id}` : id
}
