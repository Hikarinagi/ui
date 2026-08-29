const warned = new Set<string>()

export function devWarn(scope: string, message: string, key?: string) {
  if (!import.meta.env.DEV) return
  const id = `${scope}:${key ?? message}`
  if (warned.has(id)) return
  warned.add(id)
  console.warn(`[Hina UI] ${scope}: ${message}`)
}

export function resetDevWarnings() {
  warned.clear()
}
