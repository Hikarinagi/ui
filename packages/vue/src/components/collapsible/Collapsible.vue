<script setup lang="ts">
  import { CollapsibleRoot, useForwardPropsEmits, type CollapsibleRootEmits } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnCollapsible' })

  const props = defineProps<{
    open?: boolean
    defaultOpen?: boolean
    disabled?: boolean
    class?: string
  }>()
  const emits = defineEmits<CollapsibleRootEmits>()

  const forwarded = useForwardPropsEmits(
    () => ({ open: props.open, defaultOpen: props.defaultOpen, disabled: props.disabled }),
    emits,
  )
</script>

<template>
  <CollapsibleRoot v-bind="forwarded" :class="cn(props.class)">
    <slot />
  </CollapsibleRoot>
</template>
