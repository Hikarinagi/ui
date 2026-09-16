<script setup lang="ts">
  import { computed } from 'vue'
  import { ToolbarToggleItem as RekaToolbarToggleItem } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import ToolbarControl from './ToolbarControl.vue'
  import { useToolbar, useToolbarGroup } from './context'
  import type { ToolbarControlProps } from './types'

  defineOptions({ name: 'HnToolbarToggleItem', inheritAttrs: false })
  const props = withDefaults(defineProps<ToolbarControlProps & { value: string }>(), {
    tooltip: true,
    ripple: true,
  })
  const toolbar = useToolbar()
  const groupDisabled = useToolbarGroup()
  const disabled = computed(
    () => toolbar.disabled.value || groupDisabled?.value || props.disabled || props.loading,
  )
</script>

<template>
  <RekaToolbarToggleItem as-child :value="props.value" :disabled="disabled">
    <ToolbarControl
      v-bind="{ ...$attrs, ...props }"
      :disabled="disabled"
      :size="props.size ?? toolbar.size.value"
      :class="cn('aria-pressed:text-accent-text', props.class)"
    >
      <template v-for="(_, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
    </ToolbarControl>
  </RekaToolbarToggleItem>
</template>
