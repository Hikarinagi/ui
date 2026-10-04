<script setup lang="ts">
  import { ref } from 'vue'
  import { Bold, Copy, Ellipsis, Trash2 } from '@lucide/vue'
  import {
    Toolbar,
    ToolbarButton,
    ToolbarSeparator,
    Toggle,
    DropdownMenu,
    DropdownMenuItem,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const bold = ref(false)
  const action = ref('No action yet')
</script>

<template>
  <Stack align="start" gap="sm">
    <Toolbar label="Composed controls" size="sm">
      <ToolbarButton as-child>
        <Toggle v-model="bold" label="Bold" size="sm">
          <template #icon><Bold /></template>
        </Toggle>
      </ToolbarButton>
      <ToolbarButton label="Copy" @click="action = 'Copy'"><Copy /></ToolbarButton>
      <ToolbarSeparator />
      <DropdownMenu label="More actions">
        <ToolbarButton label="More"><Ellipsis /></ToolbarButton>
        <template #content>
          <DropdownMenuItem @select="action = 'Copy'">
            <template #icon><Copy /></template>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" @select="action = 'Delete'">
            <template #icon><Trash2 /></template>
            Delete
          </DropdownMenuItem>
        </template>
      </DropdownMenu>
    </Toolbar>
    <Text size="sm" tone="muted" aria-live="polite">{{ action }}</Text>
  </Stack>
</template>
