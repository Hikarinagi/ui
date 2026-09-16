<script setup lang="ts">
  import { Copy, Scissors, ClipboardPaste } from '@lucide/vue'
  import { Toolbar, ToolbarButton, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack align="start">
    <Stack
      v-for="variant in ['primary', 'secondary', 'bare'] as const"
      :key="variant"
      align="start"
      gap="xs"
    >
      <Text size="sm" tone="muted">{{ variant }}</Text>
      <Toolbar :variant="variant" :label="variant" size="sm">
        <ToolbarButton label="Cut"><Scissors /></ToolbarButton>
        <ToolbarButton label="Copy"><Copy /></ToolbarButton>
        <ToolbarButton label="Paste"><ClipboardPaste /></ToolbarButton>
      </Toolbar>
    </Stack>
  </Stack>
</template>
