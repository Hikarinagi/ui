<script setup lang="ts">
  import { SplitterGroup } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnSplitter' })

  const props = withDefaults(
    defineProps<{
      direction?: 'horizontal' | 'vertical'
      autoSaveId?: string
      class?: string
    }>(),
    { direction: 'horizontal' },
  )
</script>

<template>
  <div :class="cn(props.class)">
    <SplitterGroup :direction="props.direction" :auto-save-id="props.autoSaveId">
      <slot />
    </SplitterGroup>
  </div>
</template>
