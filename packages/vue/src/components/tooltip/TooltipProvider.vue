<script setup lang="ts">
  import { TooltipProvider as RekaTooltipProvider } from 'reka-ui'

  defineOptions({ name: 'HnTooltipProvider' })

  const props = withDefaults(
    defineProps<{
      delayDuration?: number
      skipDelayDuration?: number
    }>(),
    { delayDuration: 150, skipDelayDuration: 300 },
  )
</script>

<template>
  <RekaTooltipProvider
    :delay-duration="props.delayDuration"
    :skip-delay-duration="props.skipDelayDuration"
  >
    <slot />
  </RekaTooltipProvider>
</template>
