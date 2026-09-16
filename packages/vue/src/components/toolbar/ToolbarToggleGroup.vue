<script setup lang="ts" generic="T extends string | string[] = string | string[]">
  import { computed } from 'vue'
  import { ToolbarToggleGroup as RekaToolbarToggleGroup, type AcceptableValue } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useToolbar, provideToolbarGroup } from './context'
  import { toolbarGroup } from './toolbar.variants'

  defineOptions({ name: 'HnToolbarToggleGroup' })
  const props = withDefaults(
    defineProps<{
      type?: 'single' | 'multiple'
      defaultValue?: T
      label?: string
      disabled?: boolean
      class?: string
    }>(),
    { type: 'single' },
  )
  const model = defineModel<T>()
  const toolbar = useToolbar()
  const disabled = computed(() => toolbar.disabled.value || !!props.disabled)
  provideToolbarGroup(disabled)

  function update(value: AcceptableValue | AcceptableValue[]) {
    model.value = value as T
  }
</script>

<template>
  <RekaToolbarToggleGroup
    :model-value="model"
    :default-value="props.defaultValue"
    :type="props.type"
    :disabled="disabled"
    :orientation="toolbar.orientation.value"
    :aria-label="props.label"
    :class="cn(toolbarGroup({ orientation: toolbar.orientation.value }), props.class)"
    @update:model-value="update"
  >
    <slot />
  </RekaToolbarToggleGroup>
</template>
