<script setup lang="ts">
  import { ref } from 'vue'
  import { Copy, Download, RotateCcw } from '@lucide/vue'
  import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, Stack, Text } from '@hina-ui/vue'

  const action = ref('No action yet')
</script>

<template>
  <Stack align="start" gap="sm">
    <Toolbar label="Actions" size="sm">
      <ToolbarButton @click="action = 'Copy'">
        <template #icon><Copy /></template>
        Copy
      </ToolbarButton>
      <ToolbarButton @click="action = 'Download'">
        <template #icon><Download /></template>
        Download
      </ToolbarButton>
      <ToolbarButton @click="action = 'Reset'">
        <template #icon><RotateCcw /></template>
        Reset
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#api">API</ToolbarLink>
    </Toolbar>
    <Text size="sm" tone="muted" aria-live="polite">{{ action }}</Text>
  </Stack>
</template>
