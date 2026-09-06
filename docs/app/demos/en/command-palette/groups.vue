<script setup lang="ts">
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    {
      label: 'Recently read',
      items: [
        { id: 'book-1', label: 'Inherit the Stars', description: 'James P. Hogan' },
        { id: 'book-2', label: 'Hyperion', description: 'Dan Simmons' },
      ],
    },
    {
      label: 'Lists',
      items: [
        { id: 'list-1', label: 'To read this year', description: '12 books' },
        { id: 'list-2', label: 'Hard SF starter', description: '8 books' },
      ],
    },
  ]
</script>

<template>
  <CommandPalette :items="items" placeholder="Search books and lists">
    <Button variant="outline" tone="neutral">Search</Button>
  </CommandPalette>
</template>
