<script setup lang="ts">
  import { TooltipRoot, TooltipTrigger } from 'reka-ui'
  import TooltipBubble from './TooltipBubble.vue'
  import type { TooltipProps } from './types'

  defineOptions({ name: 'HnTooltip' })

  const props = withDefaults(defineProps<TooltipProps>(), {
    open: undefined,
    disabled: false,
  })
</script>

<template>
  <TooltipRoot :open="props.open" :disabled="props.disabled" ignore-non-keyboard-focus>
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipBubble v-bind="props">
      <slot name="content">{{ props.content }}</slot>
    </TooltipBubble>
  </TooltipRoot>
</template>
