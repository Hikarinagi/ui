<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <DropdownMenu label="Aligned to the start" align="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <DropdownMenuItem>First item</DropdownMenuItem>
        <DropdownMenuItem>Second item</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="Centred" align="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <DropdownMenuItem>First item</DropdownMenuItem>
        <DropdownMenuItem>Second item</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="Opening to the right" side="right" align="start">
      <Button variant="outline" tone="neutral">right</Button>
      <template #content>
        <DropdownMenuItem>First item</DropdownMenuItem>
        <DropdownMenuItem>Second item</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Inline>
</template>
