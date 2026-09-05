<script setup lang="ts">
  import { ref } from 'vue'
  import { Center, ContextMenu, ContextMenuCheckboxItem, Text } from '@hina-ui/vue'

  const grid = ref(true)
  const ruler = ref(false)
</script>

<template>
  <ContextMenu label="视图">
    <Center class="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
      <Text tone="muted" size="sm">
        网格{{ grid ? '开' : '关' }}，标尺{{ ruler ? '开' : '关' }}
      </Text>
    </Center>
    <template #content>
      <ContextMenuCheckboxItem v-model:checked="grid">显示网格</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem v-model:checked="ruler">显示标尺</ContextMenuCheckboxItem>
    </template>
  </ContextMenu>
</template>
