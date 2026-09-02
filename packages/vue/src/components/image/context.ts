import { inject, provide, type InjectionKey } from 'vue'
import type { LightboxItem } from '../lightbox/types'

export interface ImageGroupContext {
  register: (id: string, item: () => LightboxItem) => void
  unregister: (id: string) => void
  open: (id: string) => void
}

const KEY: InjectionKey<ImageGroupContext> = Symbol('hn-image-group')

export function provideImageGroup(context: ImageGroupContext) {
  provide(KEY, context)
}

export function useImageGroup(): ImageGroupContext | null {
  return inject(KEY, null)
}
