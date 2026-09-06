<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, CommandPalette, Stack, Text, type CommandItems } from '@hina-ui/vue'

  const picked = ref('')

  const items: CommandItems = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'settings', label: 'Settings' },
  ]
</script>

<template>
  <Stack gap="md" align="start">
    <CommandPalette :items="items" @select="item => (picked = item.label)">
      <Button variant="outline" tone="neutral">Open panel</Button>
    </CommandPalette>
    <Text v-if="picked" size="sm" tone="muted">Selected: {{ picked }}</Text>
  </Stack>
</template>
