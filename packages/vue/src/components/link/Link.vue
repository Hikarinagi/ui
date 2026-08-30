<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { link, type LinkVariants } from './link.variants'

  defineOptions({ name: 'HnLink' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        tone?: LinkVariants['tone']
        underline?: boolean
        class?: string
      }
    >(),
    { as: 'a', tone: 'accent' },
  )
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :data-underline="props.underline ? '' : undefined"
    :class="cn(link({ tone: props.tone }), props.class)"
  >
    <slot />
  </Primitive>
</template>
