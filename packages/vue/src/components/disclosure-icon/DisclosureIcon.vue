<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronDown, ChevronRight } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { disclosureIcon, type DisclosureIconVariants } from './disclosure-icon.variants'

  defineOptions({ name: 'HnDisclosureIcon' })

  const props = withDefaults(
    defineProps<{
      direction?: DisclosureIconVariants['direction']
      open?: boolean
      class?: string
    }>(),
    { direction: 'down', open: undefined },
  )

  const classes = computed(() =>
    cn(
      'inline-flex',
      disclosureIcon({
        direction: props.direction,
        state: props.open === undefined ? 'auto' : props.open ? 'open' : 'closed',
      }),
      props.class,
    ),
  )
</script>

<template>
  <span aria-hidden="true" :class="classes">
    <slot>
      <component :is="props.direction === 'end' ? ChevronRight : ChevronDown" />
    </slot>
  </span>
</template>
