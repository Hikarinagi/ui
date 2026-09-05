<script setup lang="ts">
  import { Center, ContextMenu, ContextMenuItem, Text } from '@hina-ui/vue'
</script>

<template>
  <ContextMenu label="图片操作">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">在这里点击右键</Text>
    </Center>
    <template #content>
      <ContextMenuItem>在新标签页打开</ContextMenuItem>
      <ContextMenuItem>复制图片地址</ContextMenuItem>
      <ContextMenuItem>保存图片</ContextMenuItem>
    </template>
  </ContextMenu>
</template>
