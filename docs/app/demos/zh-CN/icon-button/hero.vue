<script setup lang="ts">
  import { Bookmark, Download, Pencil, Share2, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <IconButton label="编辑">
      <Pencil />
    </IconButton>
    <IconButton label="收藏">
      <Bookmark />
    </IconButton>
    <IconButton label="分享">
      <Share2 />
    </IconButton>
    <IconButton label="下载">
      <Download />
    </IconButton>
    <IconButton label="删除" tone="danger">
      <Trash2 />
    </IconButton>
  </Inline>
</template>
