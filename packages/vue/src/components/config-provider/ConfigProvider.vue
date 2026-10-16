<script setup lang="ts">
  import { toRefs } from 'vue'
  import { provideConfigProviderContext } from '../../primitives/utils/config'
  import type { ConfigProviderProps } from './types'

  defineOptions({ name: 'HnConfigProvider', inheritAttrs: false })

  const props = withDefaults(defineProps<ConfigProviderProps>(), {
    dir: 'ltr',
    locale: 'en',
    scrollBody: true,
    nonce: undefined,
    teleportTo: undefined,
  })

  defineSlots<{ default?(): unknown }>()

  const { dir, locale, scrollBody, nonce, teleportTo } = toRefs(props)
  provideConfigProviderContext({ dir, locale, scrollBody, nonce, teleportTo })
</script>

<template>
  <slot />
</template>
