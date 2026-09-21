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
  const result = ref('The primary action uses the selected format')
</script>

<template>
  <Stack align="center" gap="sm">
    <SplitButton
      variant="outline"
      menu-label="Export format"
      @click="result = `Action: export ${format}`"
    >
      <template #icon><Download /></template>
      Export {{ format }}
      <template #content>
        <DropdownMenuLabel>File format</DropdownMenuLabel>
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
