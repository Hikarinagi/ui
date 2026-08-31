<script setup lang="ts">
  import { Bookmark, Check } from '@lucide/vue'
  import { Badge, IconButton } from '@hikarinagi/ui'
</script>

<template>
  <Badge content="已完成" tone="success" size="md" label="已完成">
    <template #content>
      <Check class="size-3" />
    </template>
    <IconButton label="收藏" variant="soft">
      <Bookmark />
    </IconButton>
  </Badge>
</template>
