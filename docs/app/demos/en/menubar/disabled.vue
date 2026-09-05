<script setup lang="ts">
  import { Menubar, MenubarItem, MenubarMenu } from '@hina-ui/vue'
</script>

<template>
  <Menubar label="Disabled example">
    <MenubarMenu label="File">
      <MenubarItem>New</MenubarItem>
      <MenubarItem disabled>Save as</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="Debug" disabled>
      <MenubarItem>Start debugging</MenubarItem>
    </MenubarMenu>
  </Menubar>
</template>
