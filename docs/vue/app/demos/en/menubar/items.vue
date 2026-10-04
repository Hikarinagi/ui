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
  <Menubar label="Item example">
    <MenubarMenu label="File">
      <MenubarLabel>This document</MenubarLabel>
      <MenubarItem>
        <template #icon><FilePlus /></template>
        New
        <template #trailing><Kbd>Ctrl N</Kbd></template>
      </MenubarItem>
      <MenubarItem>
        <template #icon><Copy /></template>
        Duplicate
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem tone="danger">
        <template #icon><Trash2 /></template>
        Delete
      </MenubarItem>
    </MenubarMenu>
  </Menubar>
</template>
