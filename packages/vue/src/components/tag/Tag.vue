<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { tag, type TagVariants } from './tag.variants'

  defineOptions({ name: 'HnTag' })

  const props = defineProps<{
    variant?: TagVariants['variant']
    tone?: TagVariants['tone']
    size?: TagVariants['size']
    pill?: boolean
    class?: string
  }>()
</script>

<template>
  <span
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
  </span>
</template>
