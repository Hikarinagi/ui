<script setup lang="ts">
  import { Copy, Scissors, Trash2 } from '@lucide/vue'
  import { Button, DropdownMenu, DropdownMenuItem, Kbd } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="编辑">
    <Button variant="outline" tone="neutral">编辑</Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Copy />
        </template>
        复制
        <template #trailing>
          <Kbd>Ctrl C</Kbd>
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Scissors />
        </template>
        剪切
        <template #trailing>
          <Kbd>Ctrl X</Kbd>
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem tone="danger">
        <template #icon>
          <Trash2 />
        </template>
        删除
        <template #trailing>
          <Kbd>Del</Kbd>
        </template>
      </DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
