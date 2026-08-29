<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnLink' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        tone?: 'accent' | 'neutral'
        underline?: boolean
        class?: string
      }
    >(),
    { as: 'a', tone: 'accent' },
  )

  const toneVar = {
    accent: '[--hn-link-color:var(--hn-accent-text)]',
    neutral: '[--hn-link-color:var(--hn-fg-default)]',
  } as const
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :data-underline="props.underline ? '' : undefined"
    :class="cn('hn-link cursor-pointer', toneVar[props.tone], props.class)"
  >
    <slot />
  </Primitive>
</template>
