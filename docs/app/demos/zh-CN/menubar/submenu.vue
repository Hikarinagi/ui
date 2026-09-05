<script setup lang="ts">
  import { Menubar, MenubarItem, MenubarMenu, MenubarSub } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="分享">
    <MenubarMenu label="文件">
      <MenubarItem>复制链接</MenubarItem>
      <MenubarSub label="导出为">
        <MenubarItem>PDF</MenubarItem>
        <MenubarItem>Markdown</MenubarItem>
        <MenubarSub label="图片">
          <MenubarItem>PNG</MenubarItem>
          <MenubarItem>SVG</MenubarItem>
        </MenubarSub>
      </MenubarSub>
    </MenubarMenu>
  </Menubar>
</template>
