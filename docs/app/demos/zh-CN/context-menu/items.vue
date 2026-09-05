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
  <ContextMenu label="条目操作">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">在这里点击右键</Text>
    </Center>
    <template #content>
      <ContextMenuLabel>这条笔记</ContextMenuLabel>
      <ContextMenuItem>
        <template #icon><Pencil /></template>
        编辑
        <template #trailing><Kbd>E</Kbd></template>
      </ContextMenuItem>
      <ContextMenuItem>
        <template #icon><Copy /></template>
        复制
        <template #trailing><Kbd>⌘C</Kbd></template>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem tone="danger">
        <template #icon><Trash2 /></template>
        删除
      </ContextMenuItem>
    </template>
  </ContextMenu>
</template>
