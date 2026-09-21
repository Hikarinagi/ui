<script setup lang="ts">
  import { ref } from 'vue'
  import { Clock, FilePen, Send } from '@lucide/vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('文章准备就绪')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton label="文章操作" menu-label="其他发布方式" @click="result = '已执行：立即发布'">
      <template #icon><Send /></template>
      立即发布
      <template #content>
        <DropdownMenuItem @select="result = '已执行：保存草稿'">
          <template #icon><FilePen /></template>
          保存草稿
        </DropdownMenuItem>
        <DropdownMenuItem @select="result = '已执行：定时发布'">
          <template #icon><Clock /></template>
          定时发布
        </DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
