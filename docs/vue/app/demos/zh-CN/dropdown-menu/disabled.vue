<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="导出">
    <Button variant="outline" tone="neutral">导出</Button>
    <template #content>
      <DropdownMenuItem>导出为 PDF</DropdownMenuItem>
      <DropdownMenuItem disabled>导出为 EPUB</DropdownMenuItem>
      <DropdownMenuItem>导出为纯文本</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
