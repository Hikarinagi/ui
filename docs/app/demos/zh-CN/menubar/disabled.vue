<script setup lang="ts">
  import { Menubar, MenubarItem, MenubarMenu } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="不可用示例">
    <MenubarMenu label="文件">
      <MenubarItem>新建</MenubarItem>
      <MenubarItem disabled>另存为</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="调试" disabled>
      <MenubarItem>开始调试</MenubarItem>
    </MenubarMenu>
  </Menubar>
</template>
