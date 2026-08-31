<script setup lang="ts">
  import { ExternalLink, Pencil, Share2, Trash2 } from '@lucide/vue'
  import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hikarinagi/ui'
</script>

<template>
  <DropdownMenu label="条目">
    <Button variant="outline" tone="neutral">条目</Button>
    <template #content>
      <DropdownMenuItem>
        <template #icon>
          <Pencil />
        </template>
        编辑
      </DropdownMenuItem>
      <DropdownMenuItem>
        <template #icon>
          <Share2 />
        </template>
        分享
        <template #trailing>
          <ExternalLink class="text-faint size-3.5" />
        </template>
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
