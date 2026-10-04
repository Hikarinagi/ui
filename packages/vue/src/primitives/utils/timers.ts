export const windowTimers = {
  setTimeout: (callback: () => void, delay: number) => window.setTimeout(callback, delay),
  clearTimeout: (handle: unknown) => window.clearTimeout(handle as number | undefined),
}

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
