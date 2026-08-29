<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnProse' })

  const props = withDefaults(defineProps<PrimitiveProps & { class?: string }>(), { as: 'div' })
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :class="cn('hn-prose', props.class)">
    <slot />
  </Primitive>
</template>
