<script setup lang="ts">
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    {
      label: '最近阅读',
      items: [
        { id: 'book-1', label: '星之继承者', description: '詹姆斯·P·霍根' },
        { id: 'book-2', label: '海伯利安', description: '丹·西蒙斯' },
      ],
    },
    {
      label: '书单',
      items: [
        { id: 'list-1', label: '今年想读', description: '12 本' },
        { id: 'list-2', label: '硬科幻入门', description: '8 本' },
      ],
    },
  ]
</script>

<template>
  <CommandPalette :items="items" placeholder="搜索书与书单">
    <Button variant="outline" tone="neutral">搜索</Button>
  </CommandPalette>
</template>
