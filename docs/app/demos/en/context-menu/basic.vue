<script setup lang="ts">
  import { Center, ContextMenu, ContextMenuItem, Text } from '@hina-ui/vue'
</script>

<template>
  <ContextMenu label="Image actions">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">Right-click here</Text>
    </Center>
    <template #content>
      <ContextMenuItem>Open in new tab</ContextMenuItem>
      <ContextMenuItem>Copy image address</ContextMenuItem>
      <ContextMenuItem>Save image</ContextMenuItem>
    </template>
  </ContextMenu>
</template>
