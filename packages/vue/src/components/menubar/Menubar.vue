<script setup lang="ts">
  import { MenubarRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { menubarRoot } from './menubar.variants'

  defineOptions({ name: 'HnMenubar' })

  const props = withDefaults(
    defineProps<{
      label?: string
      loop?: boolean
      class?: string
    }>(),
    { loop: true },
  )

  const value = defineModel<string>()
</script>

<template>
  <MenubarRoot
    v-model="value"
    :loop="props.loop"
    :aria-label="props.label"
    :class="cn(menubarRoot(), props.class)"
  >
    <slot />
  </MenubarRoot>
</template>
