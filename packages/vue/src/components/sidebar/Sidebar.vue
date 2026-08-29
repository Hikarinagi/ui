<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'

  defineOptions({ name: 'HnSidebar' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
</script>

<template>
  <aside
    :class="cn('border-line flex h-full min-h-0 w-64 shrink-0 flex-col border-e', props.class)"
  >
    <div v-if="$slots.header" class="shrink-0 px-3 py-3">
      <slot name="header" />
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <nav :aria-label="props.label ?? t.sidebar.navLabel" class="flex flex-col gap-1 px-2 py-2">
        <slot />
      </nav>
    </ScrollArea>
    <div v-if="$slots.footer" class="border-line shrink-0 border-t px-3 py-3">
      <slot name="footer" />
    </div>
  </aside>
</template>
