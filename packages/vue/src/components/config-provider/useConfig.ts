import { injectConfigProviderContext } from '../../primitives/utils/config'

export function useConfig() {
  return injectConfigProviderContext(null)
}
