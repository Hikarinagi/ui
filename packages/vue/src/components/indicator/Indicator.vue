<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import { cn } from '../../lib/cn'
  import { indicator, type IndicatorVariants } from './indicator.variants'

  defineOptions({ name: 'HnIndicator' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        tone?: IndicatorVariants['tone']
        size?: IndicatorVariants['size']
        pulse?: boolean
        label?: string
        class?: string
      }
    >(),
    { as: 'span' },
  )
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :aria-hidden="props.label ? undefined : 'true'"
    :class="cn(indicator({ tone: props.tone, size: props.size }), props.class)"
  >
    <span
      v-if="props.pulse"
      aria-hidden="true"
      class="hn-ping absolute inset-0 rounded-full bg-inherit"
    />
    <VisuallyHidden v-if="props.label">{{ props.label }}</VisuallyHidden>
  </Primitive>
</template>
