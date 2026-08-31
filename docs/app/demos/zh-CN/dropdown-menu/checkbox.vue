<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@hikarinagi/ui'

  const showCover = ref(true)
  const showSummary = ref(false)
  const showTags = ref(true)
</script>

<template>
  <DropdownMenu label="显示项">
    <Button variant="outline" tone="neutral">显示项</Button>
    <template #content>
      <DropdownMenuLabel>列表中显示</DropdownMenuLabel>
      <DropdownMenuCheckboxItem v-model:checked="showCover">封面</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showSummary">简介</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showTags">标签</DropdownMenuCheckboxItem>
    </template>
  </DropdownMenu>
</template>
