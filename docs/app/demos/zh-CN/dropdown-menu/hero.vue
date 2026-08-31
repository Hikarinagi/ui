<script setup lang="ts">
  import { ChevronDown, Copy, Download, Pencil, Trash2 } from '@lucide/vue'
  import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="文件操作" align="start">
    <Button variant="outline" tone="neutral">
      文件
      <template #trailing>
        <ChevronDown />
      </template>
    </Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Pencil />
        </template>
        重命名
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Copy />
        </template>
        复制
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Download />
        </template>
        下载
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem tone="danger">
        <template #icon>
          <Trash2 />
        </template>
        删除
      </DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>
