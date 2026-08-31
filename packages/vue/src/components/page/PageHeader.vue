<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'

  defineOptions({ name: 'HnPageHeader' })

  const props = defineProps<{
    eyebrow?: string
    title?: string
    description?: string
    class?: string
  }>()
</script>

<template>
  <header :class="cn('flex flex-col gap-2', props.class)">
    <div class="flex flex-col items-start gap-3 md:flex-row">
      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <Text v-if="props.eyebrow" as="span" size="sm" weight="medium" tone="accent">
          {{ props.eyebrow }}
        </Text>
        <Heading v-if="props.title" :level="1">{{ props.title }}</Heading>
        <Text v-if="props.description" tone="muted">{{ props.description }}</Text>
      </div>
      <div
        v-if="$slots.actions"
        class="flex w-full flex-wrap items-center gap-2 md:w-auto md:shrink-0"
      >
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </header>
</template>
