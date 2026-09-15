<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { useSidebar } from './context'
  import { sidebarRoot, sidebarRegion } from './sidebar.variants'

  defineOptions({ name: 'HnSidebar' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
  const sidebar = useSidebar()
  const state = computed(() => sidebar?.state.value ?? 'expanded')
  const inDrawer = computed(() => sidebar?.inDrawer ?? false)
</script>

<template>
  <aside
    :data-state="state"
    :inert="state === 'hidden'"
    :class="cn(sidebarRoot({ inDrawer }), props.class)"
  >
    <div v-if="$slots.header" :class="sidebarRegion({ inDrawer })">
      <slot name="header" :state="state" />
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <nav
        :aria-label="props.label ?? t.sidebar.navLabel"
        :class="cn('flex flex-col gap-1 py-2', !inDrawer && 'px-2.5')"
      >
        <slot />
      </nav>
    </ScrollArea>
    <div v-if="$slots.footer" :class="sidebarRegion({ inDrawer, footer: true })">
      <slot name="footer" :state="state" />
    </div>
  </aside>
</template>
