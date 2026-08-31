<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DropdownMenu, DropdownMenuItem, Inline, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <DropdownMenu v-model:open="open" label="Controlled menu">
      <Button variant="outline" tone="neutral">Menu</Button>
      <template #content>
        <DropdownMenuItem>First item</DropdownMenuItem>
        <DropdownMenuItem>Second item</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
      {{ open ? 'Close' : 'Open' }} from outside
    </Button>
    <Text tone="muted" size="sm">Currently: {{ open ? 'open' : 'closed' }}</Text>
  </Inline>
</template>
