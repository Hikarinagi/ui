export const REQUIRED_SINGLETONS = ['react', 'react-dom', '@hina-ui/react'] as const

export type RequiredSingleton = (typeof REQUIRED_SINGLETONS)[number]
