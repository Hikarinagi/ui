<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, CommandPalette, Inline, Text, type CommandItems } from '@hina-ui/vue'

  const open = ref(false)

  const items: CommandItems = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'settings', label: 'Settings' },
  ]
</script>

<template>
  <Inline gap="md" align="center">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <Text size="sm" tone="muted">{{ open ? 'Open' : 'Closed' }}</Text>
    <CommandPalette v-model:open="open" :items="items" />
  </Inline>
</template>
