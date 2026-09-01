import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { AvatarVariants } from './avatar.variants'

export interface AvatarGroupContext {
  size: AvatarVariants['size']
}

const KEY: InjectionKey<ComputedRef<AvatarGroupContext>> = Symbol('hn-avatar-group')

export function provideAvatarGroup(context: ComputedRef<AvatarGroupContext>) {
  provide(KEY, context)
}

export function useAvatarGroup() {
  return inject(KEY, null)
}
