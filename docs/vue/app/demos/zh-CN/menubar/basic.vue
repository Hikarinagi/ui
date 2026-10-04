<script setup lang="ts">
  import { Menubar, MenubarItem, MenubarMenu } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="示例菜单">
    <MenubarMenu label="文件">
      <MenubarItem>新建</MenubarItem>
      <MenubarItem>打开</MenubarItem>
      <MenubarItem>保存</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="编辑">
      <MenubarItem>撤销</MenubarItem>
      <MenubarItem>重做</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="帮助">
      <MenubarItem>文档</MenubarItem>
      <MenubarItem>关于</MenubarItem>
    </MenubarMenu>
  </Menubar>
</template>
