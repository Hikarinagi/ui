<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Popover, Stack, Text } from '@hikarinagi/ui'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <Popover v-model:open="open">
      <Button variant="outline" tone="neutral">Details</Button>
      <template #content>
        <Stack gap="sm" class="w-56">
          <Text size="sm">This panel can be opened and closed from outside.</Text>
          <Button size="sm" variant="soft" tone="neutral" @click="open = false">Got it</Button>
        </Stack>
      </template>
    </Popover>
    <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
      {{ open ? 'Close' : 'Open' }} from outside
    </Button>
    <Text tone="muted" size="sm">Currently {{ open ? 'open' : 'closed' }}</Text>
  </Inline>
</template>
