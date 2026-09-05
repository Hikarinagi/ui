<script setup lang="ts">
  import { Copy, FilePlus, Trash2 } from '@lucide/vue'
  import {
    Kbd,
    Menubar,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
  } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="条目示例">
    <MenubarMenu label="文件">
      <MenubarLabel>当前文档</MenubarLabel>
      <MenubarItem>
        <template #icon><FilePlus /></template>
        新建
        <template #trailing><Kbd>Ctrl N</Kbd></template>
      </MenubarItem>
      <MenubarItem>
        <template #icon><Copy /></template>
        复制一份
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem tone="danger">
        <template #icon><Trash2 /></template>
        删除
      </MenubarItem>
    </MenubarMenu>
  </Menubar>
</template>
