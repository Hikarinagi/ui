<script setup lang="ts">
  import { Settings } from '@lucide/vue'
  import { Button, Inline, Drawer, Tag, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="Panel title">
    <Button variant="outline" tone="neutral">Title slots</Button>
    <template #icon><Settings /></template>
    <template #title>
      <Inline as="span" :wrap="false" class="inline-flex gap-2">
        Custom title
        <Tag size="sm" tone="neutral">Optional</Tag>
      </Inline>
    </template>
    <template #content>
      <Text>The icon is separate, and the title slot combines text with a tag.</Text>
    </template>
  </Drawer>
</template>
