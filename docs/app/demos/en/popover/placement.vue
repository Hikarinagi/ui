<script setup lang="ts">
  import { Button, Inline, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover align="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <Text size="sm">Lined up with the start edge of the trigger.</Text>
      </template>
    </Popover>
    <Popover align="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <Text size="sm">Centred on the trigger.</Text>
      </template>
    </Popover>
    <Popover side="right" align="start">
      <Button variant="outline" tone="neutral">right</Button>
      <template #content>
        <Text size="sm">Opens to the right of the trigger.</Text>
      </template>
    </Popover>
    <Popover side="top">
      <Button variant="outline" tone="neutral">top</Button>
      <template #content>
        <Text size="sm">Opens above the trigger.</Text>
      </template>
    </Popover>
  </Inline>
</template>
