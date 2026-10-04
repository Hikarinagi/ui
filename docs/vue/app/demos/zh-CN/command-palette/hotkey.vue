<script setup lang="ts">
  import { Button, CommandPalette, Inline, Kbd, Text, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    { id: 'home', label: '首页' },
    { id: 'library', label: '书架' },
    { id: 'settings', label: '设置' },
  ]
</script>

<template>
  <Inline gap="md" align="center">
    <CommandPalette :items="items" hotkey="mod+shift+p">
      <Button variant="outline" tone="neutral">搜索</Button>
    </CommandPalette>
    <Text size="sm" tone="muted">
      也可以按
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>P</Kbd>
      打开
    </Text>
  </Inline>
</template>
