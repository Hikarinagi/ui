<script setup lang="ts">
  import { Send } from '@lucide/vue'
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button variant="ghost" tone="neutral">取消</Button>
    <Button variant="outline" tone="neutral">存为草稿</Button>
    <Button>
      <template #icon>
        <Send />
      </template>
      发布
    </Button>
  </Inline>
</template>
