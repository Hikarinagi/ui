<script setup lang="ts">
  import { Bookmark, Home, Library, LogOut, Moon, PenLine, Search, Settings } from '@lucide/vue'
  import { ref } from 'vue'
  import { Button, CommandPalette, Kbd, Stack, Text, type CommandItems } from '@hina-ui/vue'

  const picked = ref('')

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
          description: 'Write about a book you just finished',
        },
        { id: 'theme', label: 'Toggle theme', icon: Moon, kbd: ['⌘', 'D'] },
        { id: 'logout', label: 'Sign out', icon: LogOut },
      ],
    },
  ]
</script>

<template>
  <Stack gap="md" align="start">
    <CommandPalette :items="items" hotkey="mod+j" @select="item => (picked = item.label)">
      <Button variant="outline" tone="neutral">
        <template #icon><Search /></template>
        Search
        <Kbd>⌘J</Kbd>
      </Button>
    </CommandPalette>
    <Text v-if="picked" size="sm" tone="muted">Selected: {{ picked }}</Text>
  </Stack>
</template>
