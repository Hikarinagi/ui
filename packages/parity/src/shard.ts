const components = new Set<string>(import.meta.env.HINA_PARITY_COMPONENTS)

export function inShard<T>(entries: [string, T][]) {
  return entries.filter(([path]) =>
    components.has(path.slice(path.lastIndexOf('/') + 1).replace(/\.live\.tsx$/, '')),
  )
}
