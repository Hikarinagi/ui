import { expectTypeOf } from 'vitest'
import type { ComputedRef } from 'vue'
import { useAvatarGroup, type AvatarGroupContext, type AvatarVariants } from '../../src'

expectTypeOf<
  ReturnType<typeof useAvatarGroup>
>().toEqualTypeOf<ComputedRef<AvatarGroupContext> | null>()
expectTypeOf<AvatarGroupContext['size']>().toEqualTypeOf<AvatarVariants['size']>()
