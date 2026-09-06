<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, CommandPalette, Stack, Text, type CommandItems } from '@hina-ui/vue'

  const picked = ref('')

  const items: CommandItems = [
    { id: 'home', label: '首页' },
    { id: 'library', label: '书架' },
    { id: 'bookmarks', label: '收藏' },
    { id: 'settings', label: '设置' },
  ]
</script>

<template>
  <Stack gap="md" align="start">
    <CommandPalette :items="items" @select="item => (picked = item.label)">
      <Button variant="outline" tone="neutral">打开面板</Button>
    </CommandPalette>
    <Text v-if="picked" size="sm" tone="muted">已选择：{{ picked }}</Text>
  </Stack>
</template>
