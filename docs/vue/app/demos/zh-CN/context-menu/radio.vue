<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Center,
    ContextMenu,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    Text,
  } from '@hina-ui/vue'

  const sort = ref('name')
  const names: Record<string, string> = { name: '名称', date: '修改日期', size: '大小' }
</script>

<template>
  <ContextMenu label="排序">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">按{{ names[sort] }}排序</Text>
    </Center>
    <template #content>
      <ContextMenuLabel>排序方式</ContextMenuLabel>
      <ContextMenuRadioGroup v-model="sort">
        <ContextMenuRadioItem value="name">名称</ContextMenuRadioItem>
        <ContextMenuRadioItem value="date">修改日期</ContextMenuRadioItem>
        <ContextMenuRadioItem value="size">大小</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </template>
  </ContextMenu>
</template>
