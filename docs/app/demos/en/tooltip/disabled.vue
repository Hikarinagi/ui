<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Text, Tooltip } from '@hikarinagi/ui'

  const off = ref(true)
</script>

<template>
  <Inline align="center">
    <Tooltip content="Only needed while the sidebar is collapsed" :disabled="off">
      <Button variant="outline" tone="neutral">Hover me</Button>
    </Tooltip>
    <Button size="sm" variant="soft" tone="neutral" @click="off = !off">
      {{ off ? 'Enable' : 'Disable' }} the tooltip
    </Button>
    <Text tone="muted" size="sm">Currently {{ off ? 'disabled' : 'enabled' }}</Text>
  </Inline>
</template>
