<script setup lang="ts">
  import { PanelLeft } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import { useUiLocale } from '../../locale'
  import { useSidebar } from './context'

  defineOptions({ name: 'HnSidebarTrigger' })

  const props = defineProps<{ class?: string }>()

  const t = useUiLocale()
  const sidebar = useSidebar()
</script>

<template>
  <Button
    v-if="sidebar"
    icon-only
    variant="ghost"
    tone="neutral"
    :aria-label="t.sidebar.toggleLabel"
    :class="props.class"
    @click="sidebar.toggle()"
  >
    <PanelLeft />
  </Button>
</template>
