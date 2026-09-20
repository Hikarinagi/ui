<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('菜单按钮随书写方向排列')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton dir="rtl" menu-label="خيارات النشر" @click="result = '已执行：发布'">
      نشر المقال
      <template #content>
        <DropdownMenuItem @select="result = '已执行：保存草稿'">حفظ المسودة</DropdownMenuItem>
        <DropdownMenuItem @select="result = '已执行：定时发布'">جدولة النشر</DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
