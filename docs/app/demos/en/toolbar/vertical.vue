<script setup lang="ts">
  import { ref } from 'vue'
  import { MousePointer2, Hand, Type, Plus } from '@lucide/vue'
  import {
    Toolbar,
    ToolbarButton,
    ToolbarToggleGroup,
    ToolbarToggleItem,
    ToolbarSeparator,
  } from '@hina-ui/vue'

  const tool = ref<string | undefined>('pointer')
</script>

<template>
  <Toolbar label="Vertical tools" orientation="vertical" size="sm">
    <ToolbarToggleGroup v-model="tool" label="Tools">
      <ToolbarToggleItem value="pointer" label="Select" side="right">
        <MousePointer2 />
      </ToolbarToggleItem>
      <ToolbarToggleItem value="hand" label="Move" side="right"><Hand /></ToolbarToggleItem>
      <ToolbarToggleItem value="text" label="Text" side="right"><Type /></ToolbarToggleItem>
    </ToolbarToggleGroup>
    <ToolbarSeparator />
    <ToolbarButton label="Add" side="right"><Plus /></ToolbarButton>
  </Toolbar>
</template>
