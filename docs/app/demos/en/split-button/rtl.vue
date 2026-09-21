<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/vue'

  const result = ref('The menu button follows the writing direction')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton dir="rtl" menu-label="خيارات النشر" @click="result = 'Action: publish'">
      نشر المقال
      <template #content>
        <DropdownMenuItem @select="result = 'Action: save draft'">حفظ المسودة</DropdownMenuItem>
        <DropdownMenuItem @select="result = 'Action: schedule'">جدولة النشر</DropdownMenuItem>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
