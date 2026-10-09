<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { card } from './card.variants'
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'

  defineOptions({ name: 'HnCard' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        padded?: boolean
        class?: string
      }
    >(),
    { as: 'div', padded: true },
  )
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(card({ padded: props.padded }), props.class)"
  >
    <slot />
  </Primitive>
</template>
