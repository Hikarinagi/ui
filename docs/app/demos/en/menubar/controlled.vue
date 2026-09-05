<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Menubar, MenubarItem, MenubarMenu, Stack, Text } from '@hina-ui/vue'

  const open = ref('')
</script>

<template>
  <Stack gap="md" align="start">
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" @click="open = 'file'">Open "File"</Button>
      <Button variant="outline" tone="neutral" @click="open = 'help'">Open "Help"</Button>
    </Inline>
    <Menubar v-model="open" label="Controlled menu">
      <MenubarMenu label="File" value="file">
        <MenubarItem>New</MenubarItem>
        <MenubarItem>Open</MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="Help" value="help">
        <MenubarItem>Documentation</MenubarItem>
        <MenubarItem>About</MenubarItem>
      </MenubarMenu>
    </Menubar>
    <Text tone="muted" size="sm">Open now: {{ open || 'none' }}</Text>
  </Stack>
</template>
