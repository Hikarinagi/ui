<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, CommandPalette, Inline, Text, type CommandItems } from '@hina-ui/vue'

  const open = ref(false)

  const items: CommandItems = [
    { id: 'home', label: '首页' },
    { id: 'library', label: '书架' },
    { id: 'settings', label: '设置' },
  ]
</script>

<template>
  <Inline gap="md" align="center">
    <Button variant="outline" tone="neutral" @click="open = true">从外部打开</Button>
    <Text size="sm" tone="muted">{{ open ? '已打开' : '已关闭' }}</Text>
    <CommandPalette v-model:open="open" :items="items" />
  </Inline>
</template>
