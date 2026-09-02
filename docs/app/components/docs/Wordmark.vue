<script setup lang="ts">
  import { cn } from '@hina-ui/vue'
  import wordmark from '~/assets/hina-wordmark.svg?raw'

  defineOptions({ name: 'DocsWordmark' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <span
    role="img"
    aria-label="Hina UI"
    :class="cn('text-fg inline-flex items-baseline gap-1', props.class)"
  >
    <span class="h-5 [&>svg]:h-full [&>svg]:w-auto" v-html="wordmark" />
    <span class="-translate-y-[0.045em] text-lg leading-none font-semibold tracking-tight">UI</span>
  </span>
</template>
