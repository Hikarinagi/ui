<script setup lang="ts">
  import { ref } from 'vue'
  import { Download } from '@lucide/vue'
  import {
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    SplitButton,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const format = ref('CSV')
  const result = ref('选择格式后，主操作使用新的格式')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton variant="outline" menu-label="导出格式" @click="result = `已执行：导出 ${format}`">
      <template #icon><Download /></template>
      导出 {{ format }}
      <template #content>
        <DropdownMenuLabel>文件格式</DropdownMenuLabel>
        <DropdownMenuRadioGroup v-model="format">
          <DropdownMenuRadioItem value="CSV">CSV</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="JSON">JSON</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="XLSX">Excel (.xlsx)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </template>
    </SplitButton>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
