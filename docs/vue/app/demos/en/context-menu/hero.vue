<script setup lang="ts">
  import { ref } from 'vue'
  import { Copy, FolderInput, Pencil, Trash2 } from '@lucide/vue'
  import {
    Center,
    ContextMenu,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const last = ref('')
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <ContextMenu label="File actions">
      <Center class="bg-inset h-32 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">Right-click here</Text>
      </Center>
      <template #content>
        <ContextMenuItem @select="last = 'Rename'">
          <template #icon><Pencil /></template>
          Rename
        </ContextMenuItem>
        <ContextMenuItem @select="last = 'Copy'">
          <template #icon><Copy /></template>
          Copy
        </ContextMenuItem>
        <ContextMenuSub label="Move to">
          <template #icon><FolderInput /></template>
          <ContextMenuItem @select="last = 'Move to Favorites'">Favorites</ContextMenuItem>
          <ContextMenuItem @select="last = 'Move to Archive'">Archive</ContextMenuItem>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem tone="danger" @select="last = 'Delete'">
          <template #icon><Trash2 /></template>
          Delete
        </ContextMenuItem>
      </template>
    </ContextMenu>
    <Text v-if="last" tone="muted" size="sm">Picked: {{ last }}</Text>
  </Stack>
</template>
