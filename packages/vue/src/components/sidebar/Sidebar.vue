<script setup lang="ts">
  import { computed } from 'vue'
  import { Motion } from 'motion-v'
  import { cn } from '../../lib/cn'
  import { TRANSITION } from '../../motion'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { useSidebar } from './context'

  defineOptions({ name: 'HnSidebar' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
  const sidebar = useSidebar()
  const state = computed(() => sidebar?.state.value ?? 'expanded')

  const width = computed(() => {
    if (state.value === 'rail') return 56
    if (state.value === 'hidden') return 0
    return 256
  })

  const transition = computed(() =>
    typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
      ? { duration: 0 }
      : TRANSITION.layout,
  )
</script>

<template>
  <Motion
    as="aside"
    :initial="false"
    :animate="{ width }"
    :transition="transition"
    :data-state="state"
    :class="
      cn(
        'border-line flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-e',
        '[transition:border-color_var(--hn-duration-base)_var(--hn-ease-move)]',
        state === 'hidden' && 'border-e-transparent',
        props.class,
      )
    "
  >
    <div v-if="$slots.header" class="shrink-0 px-3 py-3">
      <slot name="header" :state="state" />
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <nav :aria-label="props.label ?? t.sidebar.navLabel" class="flex flex-col gap-1 px-2.5 py-2">
        <slot />
      </nav>
    </ScrollArea>
    <div v-if="$slots.footer" class="border-line shrink-0 border-t px-3 py-3">
      <slot name="footer" :state="state" />
    </div>
  </Motion>
</template>
