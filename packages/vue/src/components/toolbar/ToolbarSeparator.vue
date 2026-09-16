<script setup lang="ts">
  import { Separator } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useToolbar } from './context'
  import { toolbarSeparator } from './toolbar.variants'

  defineOptions({ name: 'HnToolbarSeparator' })
  const props = withDefaults(defineProps<{ decorative?: boolean; class?: string }>(), {
    decorative: true,
  })
  const toolbar = useToolbar()
</script>

<template>
  <Separator
    :orientation="toolbar.orientation.value === 'horizontal' ? 'vertical' : 'horizontal'"
    :decorative="props.decorative"
    :class="cn(toolbarSeparator({ orientation: toolbar.orientation.value }), props.class)"
  />
</template>
