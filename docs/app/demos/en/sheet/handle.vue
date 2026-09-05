<script setup lang="ts">
  import { Button, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet
    title="No handle"
    description="A close button takes its place; the title area can still be dragged."
    :handle="false"
  >
    <Button variant="outline" tone="neutral">Open</Button>
    <template #content>
      <Text>Try dragging the title downward.</Text>
    </template>
  </Sheet>
</template>
