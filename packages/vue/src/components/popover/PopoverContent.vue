<script setup lang="ts">
  import {
    PopoverContent,
    type PopoverContentProps,
    type PopoverContentEmits,
  } from '../../primitives/popover'
  import { useForwardPropsEmits } from '../../primitives/utils/useForwardPropsEmits'
  import { usePopoverCloseFocus } from './composables/usePopoverCloseFocus'

  defineOptions({ name: 'HnPopoverContent' })

  const props = defineProps<PopoverContentProps>()
  const emit = defineEmits<PopoverContentEmits>()
  const forwarded = useForwardPropsEmits(props, emit)
  const closeAutoFocus = usePopoverCloseFocus(emit)
</script>

<template>
  <PopoverContent
    v-bind="{ ...forwarded, onCloseAutoFocus: closeAutoFocus }"
    :reference="props.reference"
  >
    <slot />
  </PopoverContent>
</template>
