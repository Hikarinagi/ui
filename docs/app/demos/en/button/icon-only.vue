<script setup lang="ts">
  import { Bookmark, Check, Share2, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <IconButton label="Bookmark">
      <Bookmark />
    </IconButton>
    <IconButton label="Share" variant="outline">
      <Share2 />
    </IconButton>
    <IconButton label="Confirm" variant="solid" tone="accent">
      <Check />
    </IconButton>
    <IconButton label="Delete" variant="soft" tone="danger">
      <Trash2 />
    </IconButton>
  </Inline>
</template>
