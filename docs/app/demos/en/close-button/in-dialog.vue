<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="Export data" description="Choose a format to export the current selection.">
    <Button variant="outline" tone="neutral">Open dialog</Button>
    <template #content>
      <Text tone="muted">
        The close button in the corner comes with Dialog; there is no need to add another.
      </Text>
    </template>
  </Dialog>
</template>
