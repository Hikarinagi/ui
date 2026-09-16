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
  <Toolbar label="文本工具" size="sm">
    <ToolbarButton label="撤销"><Undo2 /></ToolbarButton>
    <ToolbarButton label="重做" disabled><Redo2 /></ToolbarButton>
    <ToolbarSeparator />
    <ToolbarToggleGroup v-model="formats" type="multiple" label="格式">
      <ToolbarToggleItem value="bold" label="加粗"><Bold /></ToolbarToggleItem>
      <ToolbarToggleItem value="italic" label="斜体"><Italic /></ToolbarToggleItem>
      <ToolbarToggleItem value="underline" label="下划线"><Underline /></ToolbarToggleItem>
    </ToolbarToggleGroup>
  </Toolbar>
</template>
