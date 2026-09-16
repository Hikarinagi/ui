<script setup lang="ts">
  import { NavigationMenuItem as RekaNavigationMenuItem } from 'reka-ui'

  defineOptions({ name: 'HnNavigationMenuItem' })
  const props = defineProps<{ value?: string }>()
  defineSlots<{ default(): unknown }>()
</script>

<template>
  <RekaNavigationMenuItem :value="props.value">
    <slot />
  </RekaNavigationMenuItem>
</template>
