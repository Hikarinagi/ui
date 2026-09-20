<script setup lang="ts">
  import { ref } from 'vue'
  import { Download } from '@lucide/vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('主操作伸展，菜单按钮保持方形')
</script>

<template>
  <Stack class="w-full max-w-xs" gap="sm">
    <SplitButton block menu-label="报表的其他操作" @click="result = '已执行：导出完整报表'">
      <template #icon><Download /></template>
      导出本月所有项目的完整运行报表
      <template #content>
        <DropdownMenuItem @select="result = '已执行：仅导出选中项'">仅导出选中项</DropdownMenuItem>
        <DropdownMenuItem @select="result = '已执行：复制报表链接'">复制报表链接</DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
