<script setup lang="ts">
  import { Copy, Moon, PenLine, Trash2 } from '@lucide/vue'
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    { id: 'review', label: 'New review', icon: PenLine, kbd: ['⌘', 'N'] },
    { id: 'copy', label: 'Copy link', icon: Copy, kbd: ['⌘', 'C'] },
    { id: 'theme', label: 'Toggle theme', icon: Moon, kbd: ['⌘', 'D'] },
    { id: 'delete', label: 'Delete review', icon: Trash2, disabled: true },
  ]
</script>

<template>
  <CommandPalette :items="items">
    <Button variant="outline" tone="neutral">Actions</Button>
  </CommandPalette>
</template>
