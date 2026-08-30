<script setup lang="ts">
  import { X } from '@lucide/vue'
  import IconButton from '../icon-button/IconButton.vue'
  import { useUiLocale } from '../../locale'
  import type { ButtonVariants } from '../button/button.variants'

  defineOptions({ name: 'HnCloseButton', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      label?: string
      size?: ButtonVariants['size']
      disabled?: boolean
      tooltip?: boolean
      class?: string
    }>(),
    { size: 'sm', tooltip: false },
  )

  const t = useUiLocale()
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :label="props.label ?? t.common.close"
    :tooltip="props.tooltip"
    :size="props.size"
    pill
    :disabled="props.disabled"
    variant="ghost"
    tone="neutral"
    :class="props.class"
  >
    <X />
  </IconButton>
</template>
