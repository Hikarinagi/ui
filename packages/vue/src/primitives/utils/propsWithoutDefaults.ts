export function propsWithoutDefaults<T extends Record<string, object>>(props: T) {
  return Object.fromEntries(
    Object.entries(props).map(([key, option]) => {
      const { default: _, ...rest } = option as { default?: unknown }
      return [key, rest]
    }),
  ) as { [K in keyof T]: Omit<T[K], 'default'> }
}
