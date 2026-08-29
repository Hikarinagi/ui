export const REQUIRED_SINGLETONS = ['vue', 'reka-ui', '@hikarinagi/ui'] as const

export type RequiredSingleton = (typeof REQUIRED_SINGLETONS)[number]
