<script setup lang="ts">
  import { AspectRatio as RekaAspectRatio } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnAspectRatio' })

  const props = withDefaults(
    defineProps<{
      ratio?: number
      class?: string
    }>(),
    { ratio: 16 / 9 },
  )
</script>

<template>
  <div
    :class="
      cn(
        '[&_img]:size-full [&_img]:object-cover [&_video]:size-full [&_video]:object-cover',
        props.class,
      )
    "
  >
    <RekaAspectRatio :ratio="props.ratio">
      <slot />
    </RekaAspectRatio>
  </div>
</template>
