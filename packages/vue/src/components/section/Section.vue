<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'
  import { cn } from '../../lib/cn'
  import Heading from '../heading/Heading.vue'

  defineOptions({ name: 'HnSection' })

  const props = defineProps<{
    title?: string
    id?: string
    class?: string
  }>()

  const attrs = useAttrs()
  const headingId = useId()
  const labelledBy = computed(() =>
    props.title && !attrs['aria-label'] && !attrs['aria-labelledby'] ? headingId : undefined,
  )
</script>

<template>
  <section
    :id="props.id"
    :aria-labelledby="labelledBy"
    :class="cn('flex scroll-mt-6 flex-col gap-4', props.class)"
  >
    <Heading v-if="props.title" :id="headingId" :level="2">{{ props.title }}</Heading>
    <slot />
  </section>
</template>
