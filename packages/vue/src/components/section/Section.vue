<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import Heading from '../heading/Heading.vue'

  defineOptions({ name: 'HnSection' })

  const props = defineProps<{
    title?: string
    id?: string
    class?: string
  }>()
</script>

<template>
  <section :id="props.id" :class="cn('flex scroll-mt-6 flex-col gap-4', props.class)">
    <Heading v-if="props.title" :level="2">{{ props.title }}</Heading>
    <slot />
  </section>
</template>
