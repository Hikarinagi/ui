<script setup lang="ts">
  import { injectTooltipProviderContext } from 'reka-ui'
  import { Passthrough } from '../../lib/passthrough'
  import Button from '../button/Button.vue'
  import Tooltip from '../tooltip/Tooltip.vue'
  import type { ToolbarControlProps } from './types'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(defineProps<ToolbarControlProps>(), {
    as: 'button',
    tooltip: true,
    side: 'top',
    variant: 'ghost',
    tone: 'neutral',
    ripple: true,
  })
  const Wrapper = injectTooltipProviderContext(null) ? Tooltip : Passthrough
</script>

<template>
  <Wrapper
    :disabled="!props.tooltip || !props.label"
    :content="props.label ?? ''"
    :side="props.side"
  >
    <Button
      v-bind="$attrs"
      :as="props.as"
      :as-child="props.asChild"
      :aria-label="props.label"
      :icon-only="!!props.label"
      :size="props.size"
      :variant="props.variant"
      :tone="props.tone"
      :disabled="props.disabled"
      :loading="props.loading"
      :ripple="props.ripple"
      :class="props.class"
    >
      <template v-for="(_, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
    </Button>
  </Wrapper>
</template>
