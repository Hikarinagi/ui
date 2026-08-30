<script setup lang="ts">
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnButtonGroup' })

  const props = defineProps<{
    label?: string
    divider?: boolean
    class?: string
  }>()
</script>

<template>
  <div
    role="group"
    :aria-label="props.label"
    :class="
      cn(
        'isolate inline-flex align-middle',
        '[&>*]:[--hn-press-scale:1]',
        '[&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none',
        '[&>*:not(:last-child)]:rounded-e-none',
        '[&>*:focus-visible]:z-10',
        props.divider &&
          '[&>*:not(:first-child)]:before:absolute [&>*:not(:first-child)]:before:start-0 [&>*:not(:first-child)]:before:inset-y-1/4 [&>*:not(:first-child)]:before:w-px [&>*:not(:first-child)]:before:bg-current [&>*:not(:first-child)]:before:opacity-25',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
