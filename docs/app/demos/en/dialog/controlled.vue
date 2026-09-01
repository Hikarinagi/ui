<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Dialog, Inline, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <Text tone="muted" size="sm">Currently {{ open ? 'open' : 'closed' }}</Text>
    <Dialog
      v-model:open="open"
      title="A dialog without a trigger"
      description="Outside state controls it."
    >
      <template #content>
        <Text>Leaving out the default slot renders no trigger, so `open` is the only way in.</Text>
      </template>
      <template #footer="{ close }">
        <Button @click="close">Close</Button>
      </template>
    </Dialog>
  </Inline>
</template>
