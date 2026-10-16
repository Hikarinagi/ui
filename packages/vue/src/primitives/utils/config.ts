import type { Ref } from 'vue'
import { createContext } from './createContext'

export interface ScrollBodyOption {
  padding?: boolean | number | string
  margin?: boolean | number | string
}

export interface ConfigProviderContextValue {
  dir?: Ref<'ltr' | 'rtl'>
  locale?: Ref<string>
  scrollBody?: Ref<boolean | ScrollBodyOption>
  nonce?: Ref<string | undefined>
  teleportTo?: Ref<string | HTMLElement | undefined>
  useId?: () => string
}

export const [injectConfigProviderContext, provideConfigProviderContext] =
  createContext<ConfigProviderContextValue>('ConfigProvider')
