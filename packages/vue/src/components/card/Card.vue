<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { card } from './card.variants'

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
