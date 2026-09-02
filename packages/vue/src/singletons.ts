export const REQUIRED_SINGLETONS = ['vue', 'reka-ui', '@hina-ui/vue'] as const

export type RequiredSingleton = (typeof REQUIRED_SINGLETONS)[number]
