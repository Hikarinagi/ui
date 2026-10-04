<script setup lang="ts">
  import { Bookmark, Home, Library, Moon, PenLine, Settings } from '@lucide/vue'
  import { CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    {
      label: 'Pages',
      items: [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'library', label: 'Library', icon: Library },
        { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
        { id: 'settings', label: 'Settings', icon: Settings, kbd: ['⌘', ','] },
      ],
    },
    {
      label: 'Actions',
      items: [
        {
          id: 'review',
          label: 'New review',
          icon: PenLine,
          description: 'Log a book just finished',
        },
        { id: 'theme', label: 'Toggle theme', icon: Moon, kbd: ['⌘', 'D'] },
      ],
    },
  ]
</script>

<template>
  <CommandPalette inline :items="items" class="max-w-sm" />
</template>
