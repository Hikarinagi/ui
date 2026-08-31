<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnPrevNext' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
</script>

<template>
  <nav
    :aria-label="props.label ?? t.pagination.navLabel"
    :class="cn('grid gap-4 sm:grid-cols-2', props.class)"
  >
    <slot />
  </nav>
</template>
