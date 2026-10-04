import { inject, provide, type InjectionKey } from 'vue'

export function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
) {
  const description =
    typeof providerComponentName === 'string' && !contextName
      ? `${providerComponentName}Context`
      : contextName
  const key: InjectionKey<ContextValue | null> = Symbol(description)

  const injectContext = <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ): T extends null ? ContextValue | null : ContextValue => {
    const context = inject(key, fallback)
    if (context) return context as never
    if (context === null) return context as never
    throw new Error(
      `Injection \`${key.toString()}\` not found. Component must be used within ${
        Array.isArray(providerComponentName)
          ? `one of the following components: ${providerComponentName.join(', ')}`
          : `\`${providerComponentName}\``
      }`,
    )
  }

  const provideContext = (value: ContextValue) => {
    provide(key, value)
    return value
  }

  return [injectContext, provideContext] as const
}
