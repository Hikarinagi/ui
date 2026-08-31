<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <DropdownMenu label="向下对齐起始边" align="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <DropdownMenuItem>第一项</DropdownMenuItem>
        <DropdownMenuItem>第二项</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="向下居中" align="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <DropdownMenuItem>第一项</DropdownMenuItem>
        <DropdownMenuItem>第二项</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <DropdownMenu label="向右展开" side="right" align="start">
      <Button variant="outline" tone="neutral">right</Button>
      <template #content>
        <DropdownMenuItem>第一项</DropdownMenuItem>
        <DropdownMenuItem>第二项</DropdownMenuItem>
      </template>
    </DropdownMenu>
  </Inline>
</template>
