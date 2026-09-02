<script setup lang="ts">
  import { TabsRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { provideTabsStyle } from './context'

  defineOptions({ name: 'HnTabs' })

  const props = withDefaults(
    defineProps<{
      defaultValue?: string
      variant?: 'underline' | 'soft'
      size?: 'sm' | 'md' | 'lg'
      orientation?: 'horizontal' | 'vertical'
      class?: string
    }>(),
    { variant: 'underline', size: 'md', orientation: 'horizontal' },
  )

  const modelValue = defineModel<string>()

  provideTabsStyle({ variant: props.variant, size: props.size, orientation: props.orientation })
</script>

<template>
  <TabsRoot
    v-model="modelValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
    :class="
      cn('flex', props.orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col', props.class)
    "
  >
    <slot />
  </TabsRoot>
</template>
