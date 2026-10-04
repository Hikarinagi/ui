<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="Export">
    <Button variant="outline" tone="neutral">Export</Button>
    <template #content>
      <DropdownMenuItem>Export as PDF</DropdownMenuItem>
      <DropdownMenuItem disabled>Export as EPUB</DropdownMenuItem>
      <DropdownMenuItem>Export as plain text</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
