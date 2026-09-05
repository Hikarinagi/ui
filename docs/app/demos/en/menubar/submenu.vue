<script setup lang="ts">
  import { Menubar, MenubarItem, MenubarMenu, MenubarSub } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="Share">
    <MenubarMenu label="File">
      <MenubarItem>Copy link</MenubarItem>
      <MenubarSub label="Export as">
        <MenubarItem>PDF</MenubarItem>
        <MenubarItem>Markdown</MenubarItem>
        <MenubarSub label="Image">
          <MenubarItem>PNG</MenubarItem>
          <MenubarItem>SVG</MenubarItem>
        </MenubarSub>
      </MenubarSub>
    </MenubarMenu>
  </Menubar>
</template>
