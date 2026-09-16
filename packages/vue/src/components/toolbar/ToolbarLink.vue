<script setup lang="ts">
  import { computed } from 'vue'
  import { ToolbarButton as RekaToolbarButton } from 'reka-ui'
  import ToolbarControl from './ToolbarControl.vue'
  import { useToolbar } from './context'
  import type { ToolbarControlProps } from './types'

  defineOptions({ name: 'HnToolbarLink', inheritAttrs: false })
  const props = withDefaults(
    defineProps<
      ToolbarControlProps & {
        href?: string
        target?: string
        rel?: string
      }
    >(),
    { as: 'a', tooltip: true, ripple: true },
  )
  const toolbar = useToolbar()
  const disabled = computed(() => toolbar.disabled.value || props.disabled || props.loading)

  function activate(event: KeyboardEvent) {
    if (!disabled.value) (event.currentTarget as HTMLElement).click()
  }
</script>

<template>
  <RekaToolbarButton as-child :as="props.as" :disabled="disabled">
    <ToolbarControl
      v-bind="{ ...$attrs, ...props }"
      :disabled="disabled"
      :size="props.size ?? toolbar.size.value"
      @keydown.space.prevent="activate"
    >
      <template v-for="(_, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
    </ToolbarControl>
  </RekaToolbarButton>
</template>
