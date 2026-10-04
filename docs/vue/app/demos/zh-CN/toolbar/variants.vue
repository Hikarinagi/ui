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
        <ToolbarButton label="剪切"><Scissors /></ToolbarButton>
        <ToolbarButton label="复制"><Copy /></ToolbarButton>
        <ToolbarButton label="粘贴"><ClipboardPaste /></ToolbarButton>
      </Toolbar>
    </Stack>
  </Stack>
</template>
