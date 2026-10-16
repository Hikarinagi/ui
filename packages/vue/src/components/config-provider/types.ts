import type { ScrollBodyOption } from '../../primitives/utils/config'

export type { ScrollBodyOption }

export interface ConfigProviderProps {
  dir?: 'ltr' | 'rtl'
  locale?: string
  scrollBody?: boolean | ScrollBodyOption
  nonce?: string
  teleportTo?: string | HTMLElement
}
