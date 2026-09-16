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
  <Toolbar label="纵向工具" orientation="vertical" size="sm">
    <ToolbarToggleGroup v-model="tool" label="工具">
      <ToolbarToggleItem value="pointer" label="选择" side="right">
        <MousePointer2 />
      </ToolbarToggleItem>
      <ToolbarToggleItem value="hand" label="移动" side="right"><Hand /></ToolbarToggleItem>
      <ToolbarToggleItem value="text" label="文字" side="right"><Type /></ToolbarToggleItem>
    </ToolbarToggleGroup>
    <ToolbarSeparator />
    <ToolbarButton label="添加" side="right"><Plus /></ToolbarButton>
  </Toolbar>
</template>
