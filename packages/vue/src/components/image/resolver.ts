import { inject, provide, type InjectionKey } from 'vue'

export type ImageResolver = (src: string) => string

const KEY: InjectionKey<ImageResolver> = Symbol('hn-image-resolver')

export function provideImageResolver(resolver: ImageResolver) {
  provide(KEY, resolver)
}

export function useImageResolver(): ImageResolver {
  return inject(KEY, (src: string) => src)
}
