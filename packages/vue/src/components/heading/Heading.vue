<script setup lang="ts">
  import { computed } from 'vue'
  import { Primitive } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { heading, type HeadingVariants } from './heading.variants'

  defineOptions({ name: 'HnHeading' })

  const props = withDefaults(
    defineProps<{
      level?: 1 | 2 | 3 | 4 | 5 | 6
      size?: HeadingVariants['size']
      weight?: HeadingVariants['weight']
      truncate?: boolean
      class?: string
    }>(),
    { level: 2 },
  )

  const sizeByLevel = {
    1: '2xl',
    2: 'xl',
    3: 'lg',
    4: 'md',
    5: 'base',
    6: 'sm',
  } as const

  const tag = computed(() => `h${props.level}`)
  const size = computed(() => props.size ?? sizeByLevel[props.level])
</script>

<template>
  <Primitive
    :as="tag"
    :class="
      cn(
        heading({
          size: size,
          weight: props.weight,
          truncate: props.truncate,
        }),
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
