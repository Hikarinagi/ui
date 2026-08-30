<script setup lang="ts">
  import { TabsContent } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnTabsContent' })

  const props = defineProps<{
    value: string
    class?: string
  }>()
</script>

<template>
  <TabsContent :value="props.value" :class="cn('hn-focus-ring outline-none', props.class)">
    <slot />
  </TabsContent>
</template>
