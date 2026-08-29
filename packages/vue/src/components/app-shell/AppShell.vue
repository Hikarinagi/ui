<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import ScrollArea from '../scroll-area/ScrollArea.vue'

  defineOptions({ name: 'HnAppShell' })

  const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('bg-canvas text-fg flex h-screen flex-col overflow-hidden', props.class)">
    <header v-if="$slots.header" class="border-line bg-canvas shrink-0 border-b">
      <div class="flex h-14 items-center gap-3 px-4 sm:px-6">
        <slot name="header" />
      </div>
    </header>
    <div class="flex min-h-0 flex-1">
      <div v-if="$slots.sidebar" class="hidden h-full shrink-0 lg:block">
        <slot name="sidebar" />
      </div>
      <main class="min-h-0 min-w-0 flex-1">
        <ScrollArea class="h-full">
          <slot />
        </ScrollArea>
      </main>
    </div>
  </div>
</template>
