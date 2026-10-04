<script setup lang="ts">
  import { Button, Sheet, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet title="Filters" description="Only affects the current list.">
    <Button variant="outline" tone="neutral">Open filters</Button>
    <template #content>
      <Text>Put the filter controls here. Drag the handle at the top downward to close.</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Reset</Button>
      <Button @click="close">Apply</Button>
    </template>
  </Sheet>
</template>
