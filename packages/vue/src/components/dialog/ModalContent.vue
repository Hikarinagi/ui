<script setup lang="ts">
  import { AlertDialogContent, DialogContent } from 'reka-ui'
  import { useDialogCloseFocus } from '../../lib/dialog-focus'

  defineOptions({ name: 'HnModalContent' })

  const props = defineProps<{ alert?: boolean }>()
  const emit = defineEmits<{ closeAutoFocus: [event: Event] }>()
  const closeAutoFocus = useDialogCloseFocus(event => emit('closeAutoFocus', event))
</script>

<template>
  <component
    :is="props.alert ? AlertDialogContent : DialogContent"
    @close-auto-focus="closeAutoFocus"
  >
    <slot />
  </component>
</template>
