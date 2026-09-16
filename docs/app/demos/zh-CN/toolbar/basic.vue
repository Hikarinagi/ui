<script setup lang="ts">
  import { ref } from 'vue'
  import { Copy, Download, RotateCcw } from '@lucide/vue'
  import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, Stack, Text } from '@hina-ui/vue'

  const action = ref('尚未执行')
</script>

<template>
  <Stack align="start" gap="sm">
    <Toolbar label="操作" size="sm">
      <ToolbarButton @click="action = '复制'">
        <template #icon><Copy /></template>
        复制
      </ToolbarButton>
      <ToolbarButton @click="action = '下载'">
        <template #icon><Download /></template>
        下载
      </ToolbarButton>
      <ToolbarButton @click="action = '重置'">
        <template #icon><RotateCcw /></template>
        重置
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#api">API</ToolbarLink>
    </Toolbar>
    <Text size="sm" tone="muted" aria-live="polite">{{ action }}</Text>
  </Stack>
</template>
