<script setup lang="ts">
  import { Button, Inline, toast } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button
      variant="outline"
      tone="neutral"
      @click="
        toast('Moved to the bin', {
          action: { label: 'Undo', onClick: () => toast.success('Restored') },
        })
      "
    >
      With an action
    </Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="
        toast.warning('Empty the bin?', {
          duration: 0,
          action: { label: 'Empty', onClick: () => toast.success('The bin is empty') },
          cancel: { label: 'Cancel' },
        })
      "
    >
      Two buttons
    </Button>
  </Inline>
</template>
