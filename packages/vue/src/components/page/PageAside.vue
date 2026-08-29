<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnPageAside' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()
</script>

<template>
  <aside :aria-label="props.label" :class="cn('hidden w-56 shrink-0 xl:block', props.class)">
    <div class="sticky top-8 flex flex-col gap-2">
      <slot />
    </div>
  </aside>
</template>
