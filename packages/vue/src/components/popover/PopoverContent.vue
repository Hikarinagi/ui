<script setup lang="ts">
  import {
    PopoverContent,
    useForwardPropsEmits,
    type PopoverContentProps,
    type PopoverContentEmits,
  } from 'reka-ui'
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
