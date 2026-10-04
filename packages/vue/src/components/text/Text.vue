<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { text, type TextVariants } from './text.variants'
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'

  defineOptions({ name: 'HnText' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        size?: TextVariants['size']
        tone?: TextVariants['tone']
        weight?: TextVariants['weight']
        truncate?: boolean
        class?: string
      }
    >(),
    { as: 'p' },
  )
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="
      cn(
        text({
          size: props.size,
          tone: props.tone,
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
