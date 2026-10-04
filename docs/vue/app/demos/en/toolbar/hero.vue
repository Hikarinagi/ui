<script setup lang="ts">
  import { ref } from 'vue'
  import { Bold, Italic, Underline, Undo2, Redo2 } from '@lucide/vue'
  import {
    Toolbar,
    ToolbarButton,
    ToolbarToggleGroup,
    ToolbarToggleItem,
    ToolbarSeparator,
  } from '@hina-ui/vue'

  const formats = ref(['bold'])
</script>

<template>
  <Toolbar label="Text tools" size="sm">
    <ToolbarButton label="Undo"><Undo2 /></ToolbarButton>
    <ToolbarButton label="Redo" disabled><Redo2 /></ToolbarButton>
    <ToolbarSeparator />
    <ToolbarToggleGroup v-model="formats" type="multiple" label="Formatting">
      <ToolbarToggleItem value="bold" label="Bold"><Bold /></ToolbarToggleItem>
      <ToolbarToggleItem value="italic" label="Italic"><Italic /></ToolbarToggleItem>
      <ToolbarToggleItem value="underline" label="Underline"><Underline /></ToolbarToggleItem>
    </ToolbarToggleGroup>
  </Toolbar>
</template>
