<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { tag, type TagVariants } from './tag.variants'

  defineOptions({ name: 'HnTag' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        variant?: TagVariants['variant']
        tone?: TagVariants['tone']
        size?: TagVariants['size']
        pill?: boolean
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
    :class="
      cn(
        tag({
          variant: props.variant,
          tone: props.tone,
          size: props.size,
          pill: props.pill,
        }),
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
