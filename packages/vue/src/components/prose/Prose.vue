<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'

  defineOptions({ name: 'HnProse' })

  const props = withDefaults(defineProps<PrimitiveProps & { class?: string }>(), { as: 'div' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :class="cn('hn-prose', props.class)">
    <slot />
  </Primitive>
</template>
