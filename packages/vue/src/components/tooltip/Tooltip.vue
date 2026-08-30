<script setup lang="ts">
  import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnTooltip' })

  const props = withDefaults(
    defineProps<{
      content?: string
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      disabled?: boolean
      class?: string
    }>(),
    { side: 'top', align: 'center', sideOffset: 8, disabled: false },
  )
</script>

<template>
  <TooltipRoot :disabled="props.disabled">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :class="
          cn(
            'hn-anim-pop [--hn-pop-in:var(--hn-duration-fast)] bg-neutral-solid text-neutral-solid-on z-(--hn-z-overlay)',
            'max-w-xs rounded-md px-2.5 py-1 text-xs shadow-md',
            props.class,
          )
        "
      >
        <slot name="content">{{ props.content }}</slot>
        <TooltipArrow :width="10" :height="5" class="fill-neutral-solid" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
