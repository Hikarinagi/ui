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
    <ContextMenu label="文件操作">
      <Center class="bg-inset h-32 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">在这里点击右键</Text>
      </Center>
      <template #content>
        <ContextMenuItem @select="last = '重命名'">
          <template #icon><Pencil /></template>
          重命名
        </ContextMenuItem>
        <ContextMenuItem @select="last = '复制'">
          <template #icon><Copy /></template>
          复制
        </ContextMenuItem>
        <ContextMenuSub label="移动到">
          <template #icon><FolderInput /></template>
          <ContextMenuItem @select="last = '移动到收藏夹'">收藏夹</ContextMenuItem>
          <ContextMenuItem @select="last = '移动到归档'">归档</ContextMenuItem>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem tone="danger" @select="last = '删除'">
          <template #icon><Trash2 /></template>
          删除
        </ContextMenuItem>
      </template>
    </ContextMenu>
    <Text v-if="last" tone="muted" size="sm">选择了：{{ last }}</Text>
  </Stack>
</template>
