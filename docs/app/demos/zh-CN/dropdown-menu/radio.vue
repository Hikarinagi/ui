<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Button,
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
  } from '@hikarinagi/ui'

  const sort = ref('newest')
  const labels: Record<string, string> = {
    newest: '最新发布',
    popular: '最多收藏',
    rating: '评分最高',
  }
</script>

<template>
  <DropdownMenu label="排序方式">
    <Button variant="outline" tone="neutral">排序：{{ labels[sort] }}</Button>
    <template #content>
      <DropdownMenuLabel>排序方式</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="sort">
        <DropdownMenuRadioItem value="newest">最新发布</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="popular">最多收藏</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="rating">评分最高</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </template>
  </DropdownMenu>
</template>
