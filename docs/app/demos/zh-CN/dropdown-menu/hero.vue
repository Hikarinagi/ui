<script setup lang="ts">
  import { Copy, Download, Pencil, Trash2 } from '@lucide/vue'
  import {
    Button,
    DisclosureIcon,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
  } from '@hina-ui/vue'
</script>

<template>
  <DropdownMenu label="文件操作" align="start">
    <Button variant="outline" tone="neutral">
      文件
      <template #trailing>
        <DisclosureIcon />
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
