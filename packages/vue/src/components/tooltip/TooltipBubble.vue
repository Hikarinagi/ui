<script setup lang="ts">
  import { TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import type { TooltipProps } from './types'

  defineOptions({ name: 'HnTooltipBubble' })

  const props = withDefaults(defineProps<TooltipProps>(), {
    side: 'top',
    align: 'center',
    sideOffset: 8,
    open: undefined,
  })
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="props.side"
      :align="props.align"
      :side-offset="props.sideOffset"
      :aria-label="props.content"
      :update-position-strategy="props.open === undefined ? 'optimized' : 'always'"
      :class="
        cn(
          'hn-anim-pop [--hn-pop-in:var(--hn-duration-fast)] bg-neutral-solid text-neutral-solid-on z-(--hn-z-overlay)',
          'max-w-xs rounded-md px-2.5 py-1 text-xs shadow-md',
          props.class,
        )
      "
    >
      <slot>{{ props.content }}</slot>
      <TooltipArrow :width="10" :height="5" class="fill-neutral-solid" />
    </TooltipContent>
  </TooltipPortal>
</template>
