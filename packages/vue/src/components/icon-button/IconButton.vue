<script setup lang="ts">
  import { injectTooltipProviderContext, type PrimitiveProps } from 'reka-ui'
  import Button from '../button/Button.vue'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { Passthrough } from '../../lib/passthrough'
  import type { ButtonVariants } from '../button/button.variants'

  defineOptions({ name: 'HnIconButton', inheritAttrs: false })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        label: string
        tooltip?: boolean
        side?: 'top' | 'right' | 'bottom' | 'left'
        variant?: ButtonVariants['variant']
        tone?: ButtonVariants['tone']
        size?: ButtonVariants['size']
        type?: 'button' | 'submit' | 'reset'
        pill?: boolean
        loading?: boolean
        disabled?: boolean
        class?: string
      }
    >(),
    {
      as: 'button',
      tooltip: true,
      side: 'top',
      variant: 'ghost',
      tone: 'neutral',
      type: 'button',
    },
  )

  const provider = injectTooltipProviderContext(null)
  const Wrapper = provider ? Tooltip : Passthrough
</script>

<template>
  <Wrapper :disabled="!props.tooltip" :content="props.label" :side="props.side">
    <Button
      v-bind="$attrs"
      icon-only
      :as="props.as"
      :as-child="props.asChild"
      :variant="props.variant"
      :tone="props.tone"
      :size="props.size"
      :type="props.type"
      :pill="props.pill"
      :loading="props.loading"
      :disabled="props.disabled"
      :aria-label="props.label"
      :class="props.class"
    >
      <slot />
    </Button>
  </Wrapper>
</template>
