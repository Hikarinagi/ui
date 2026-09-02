<script setup lang="ts">
  import { Bookmark, Check, Share2, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <IconButton label="收藏">
      <Bookmark />
    </IconButton>
    <IconButton label="分享" variant="outline">
      <Share2 />
    </IconButton>
    <IconButton label="确认" variant="solid" tone="accent">
      <Check />
    </IconButton>
    <IconButton label="删除" variant="soft" tone="danger">
      <Trash2 />
    </IconButton>
  </Inline>
</template>
