<script setup lang="ts">
  import { Copy, Moon, PenLine, Trash2 } from '@lucide/vue'
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    { id: 'review', label: '新建书评', icon: PenLine, kbd: ['⌘', 'N'] },
    { id: 'copy', label: '复制链接', icon: Copy, kbd: ['⌘', 'C'] },
    { id: 'theme', label: '切换主题', icon: Moon, kbd: ['⌘', 'D'] },
    { id: 'delete', label: '删除书评', icon: Trash2, disabled: true },
  ]
</script>

<template>
  <CommandPalette :items="items">
    <Button variant="outline" tone="neutral">操作</Button>
  </CommandPalette>
</template>
