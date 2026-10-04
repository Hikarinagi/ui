<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, DropdownMenu, DropdownMenuItem, Inline, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <DropdownMenu v-model:open="open" label="受控菜单">
      <Button variant="outline" tone="neutral">菜单</Button>
      <template #content>
        <DropdownMenuItem>第一项</DropdownMenuItem>
        <DropdownMenuItem>第二项</DropdownMenuItem>
      </template>
    </DropdownMenu>
    <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
      从外部{{ open ? '收起' : '展开' }}
    </Button>
    <Text tone="muted" size="sm">当前：{{ open ? '展开' : '收起' }}</Text>
  </Inline>
</template>
