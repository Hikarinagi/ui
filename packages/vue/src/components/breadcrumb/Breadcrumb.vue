<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnBreadcrumb' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
</script>

<template>
  <nav :aria-label="props.label ?? t.breadcrumb.navLabel" :class="cn(props.class)">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <slot />
    </ol>
  </nav>
</template>
