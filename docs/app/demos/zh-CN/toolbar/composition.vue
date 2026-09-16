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
  const action = ref('尚未执行')
</script>

<template>
  <Stack align="start" gap="sm">
    <Toolbar label="组合控件" size="sm">
      <ToolbarButton as-child>
        <Toggle v-model="bold" label="加粗" size="sm">
          <template #icon><Bold /></template>
        </Toggle>
      </ToolbarButton>
      <ToolbarButton label="复制" @click="action = '复制'"><Copy /></ToolbarButton>
      <ToolbarSeparator />
      <DropdownMenu label="更多操作">
        <ToolbarButton label="更多"><Ellipsis /></ToolbarButton>
        <template #content>
          <DropdownMenuItem @select="action = '复制'">
            <template #icon><Copy /></template>
            复制
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" @select="action = '删除'">
            <template #icon><Trash2 /></template>
            删除
          </DropdownMenuItem>
        </template>
      </DropdownMenu>
    </Toolbar>
    <Text size="sm" tone="muted" aria-live="polite">{{ action }}</Text>
  </Stack>
</template>
