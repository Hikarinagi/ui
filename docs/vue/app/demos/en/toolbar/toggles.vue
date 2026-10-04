<script setup lang="ts">
  import { ref } from 'vue'
  import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/vue'
  import {
    Toolbar,
    ToolbarToggleGroup,
    ToolbarToggleItem,
    ToolbarSeparator,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const formats = ref(['bold'])
  const alignment = ref<string | undefined>('start')
</script>

<template>
  <Stack align="start" gap="sm">
    <Toolbar label="Toggle groups" size="sm">
      <ToolbarToggleGroup v-model="formats" type="multiple" label="Formatting">
        <ToolbarToggleItem value="bold" label="Bold"><Bold /></ToolbarToggleItem>
        <ToolbarToggleItem value="italic" label="Italic"><Italic /></ToolbarToggleItem>
        <ToolbarToggleItem value="underline" label="Underline"><Underline /></ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup v-model="alignment" label="Alignment">
        <ToolbarToggleItem value="start" label="Align start"><AlignLeft /></ToolbarToggleItem>
        <ToolbarToggleItem value="center" label="Center"><AlignCenter /></ToolbarToggleItem>
        <ToolbarToggleItem value="end" label="Align end"><AlignRight /></ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
    <Text size="sm" tone="muted">
      Formats: {{ formats.join(', ') || 'None' }} · Alignment: {{ alignment ?? 'None' }}
    </Text>
  </Stack>
</template>
