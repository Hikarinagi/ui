<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useSidebar } from './context'
  import { sidebarLabel } from './sidebar.variants'

  defineOptions({ name: 'HnSidebarLabel' })

  const props = withDefaults(defineProps<{ as?: string; class?: string }>(), { as: 'span' })
  const sidebar = useSidebar()
  const collapsed = computed(() => sidebar?.state.value === 'rail')
</script>

<template>
  <component
    :is="props.as"
    :data-collapsed="collapsed ? '' : undefined"
    :aria-hidden="collapsed ? 'true' : undefined"
    :inert="collapsed"
    :class="cn(sidebarLabel(), props.class)"
  >
    <slot />
  </component>
</template>
