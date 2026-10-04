<script setup lang="ts">
  import { Copy, Scissors, ClipboardPaste } from '@lucide/vue'
  import { Toolbar, ToolbarButton, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack align="start">
    <Stack v-for="size in ['sm', 'md', 'lg'] as const" :key="size" align="start" gap="xs">
      <Text size="sm" tone="muted">{{ size }}</Text>
      <Toolbar :size="size" :label="size">
        <ToolbarButton label="Cut"><Scissors /></ToolbarButton>
        <ToolbarButton label="Copy"><Copy /></ToolbarButton>
        <ToolbarButton label="Paste"><ClipboardPaste /></ToolbarButton>
      </Toolbar>
    </Stack>
  </Stack>
</template>
