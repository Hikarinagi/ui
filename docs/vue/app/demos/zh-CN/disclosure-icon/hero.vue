<script setup lang="ts">
  import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="排序方式">
    <Button variant="outline" tone="neutral">
      <template #trailing>
        <DisclosureIcon />
      </template>
      按更新时间
    </Button>
    <template #content>
      <DropdownMenuItem>按更新时间</DropdownMenuItem>
      <DropdownMenuItem>按发行日期</DropdownMenuItem>
      <DropdownMenuItem>按收藏数</DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
