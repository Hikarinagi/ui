<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnSkeleton' })

  const props = withDefaults(
    defineProps<{
      loading?: boolean
      as?: string
      class?: string
    }>(),
    { loading: true, as: 'span' },
  )
</script>

<template>
  <slot v-if="!props.loading" />
  <component
    :is="props.as"
    v-else
    aria-hidden="true"
    inert
    tabindex="-1"
    :class="cn('hn-skeleton block', props.class)"
  >
    <slot />
  </component>
</template>
