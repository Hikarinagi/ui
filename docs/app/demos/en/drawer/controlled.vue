<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Inline, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <Text tone="muted" size="sm">Currently {{ open ? 'open' : 'closed' }}</Text>
    <Drawer
      v-model:open="open"
      title="A drawer without a trigger"
      description="Outside state controls it."
    >
      <template #content>
        <Text>Leaving out the default slot renders no trigger, so `open` is the only way in.</Text>
      </template>
      <template #footer="{ close }">
        <Button @click="close">Close</Button>
      </template>
    </Drawer>
  </Inline>
</template>
