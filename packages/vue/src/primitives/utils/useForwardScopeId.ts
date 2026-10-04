import { getCurrentInstance } from 'vue'

export function useForwardScopeId(): Record<string, string> {
  const scopeId = getCurrentInstance()?.vnode.scopeId
  return scopeId ? { [scopeId]: '' } : {}
}
