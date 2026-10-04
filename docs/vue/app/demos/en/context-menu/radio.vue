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
  const names: Record<string, string> = { name: 'name', date: 'date modified', size: 'size' }
</script>

<template>
  <ContextMenu label="Sort">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">Sorted by {{ names[sort] }}</Text>
    </Center>
    <template #content>
      <ContextMenuLabel>Sort by</ContextMenuLabel>
      <ContextMenuRadioGroup v-model="sort">
        <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
        <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
        <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </template>
  </ContextMenu>
</template>
