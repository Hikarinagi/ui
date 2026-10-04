<script setup lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="更多操作">
    <Button variant="outline" tone="neutral">更多操作</Button>
    <template #content>
      <DropdownMenuItem>编辑</DropdownMenuItem>
      <DropdownMenuItem>复制</DropdownMenuItem>
      <DropdownMenuItem>归档</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
