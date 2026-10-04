<script setup lang="ts">
  import { Copy, Pencil, Trash2 } from '@lucide/vue'
  import {
    Center,
    ContextMenu,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    Kbd,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <ContextMenu label="Note actions">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">Right-click here</Text>
    </Center>
    <template #content>
      <ContextMenuLabel>This note</ContextMenuLabel>
      <ContextMenuItem>
        <template #icon><Pencil /></template>
        Edit
        <template #trailing><Kbd>E</Kbd></template>
      </ContextMenuItem>
      <ContextMenuItem>
        <template #icon><Copy /></template>
        Copy
        <template #trailing><Kbd>⌘C</Kbd></template>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem tone="danger">
        <template #icon><Trash2 /></template>
        Delete
      </ContextMenuItem>
    </template>
  </ContextMenu>
</template>
