<script setup lang="ts">
  import { computed } from 'vue'
  import { X } from '@lucide/vue'
  import IconButton from '../icon-button/IconButton.vue'
  import { useUiLocale } from '../../locale'
  import { cn } from '../../lib/cn'
  import type { ButtonVariants } from '../button/button.variants'

  defineOptions({ name: 'HnCloseButton', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      label?: string
      size?: 'xs' | ButtonVariants['size']
      disabled?: boolean
      tooltip?: boolean
      class?: string
    }>(),
    { size: 'sm', tooltip: false },
  )

  const t = useUiLocale()

  const buttonSize = computed(() => (props.size === 'xs' ? 'sm' : props.size))
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :label="props.label ?? t.common.close"
    :tooltip="props.tooltip"
    :size="buttonSize"
    pill
    :disabled="props.disabled"
    variant="ghost"
    tone="neutral"
    :class="cn(props.size === 'xs' && 'size-5 [&_svg]:size-3', props.class)"
  >
    <X />
  </IconButton>
</template>
