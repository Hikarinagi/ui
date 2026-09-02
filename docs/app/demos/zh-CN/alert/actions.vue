<script setup lang="ts">
  import { Alert, Button } from '@hina-ui/vue'
</script>

<template>
  <Alert tone="info" title="有新的评论" class="w-full max-w-xl">
    你的文章收到了 3 条新评论。
    <template #actions>
      <Button size="sm" variant="soft" tone="neutral">稍后</Button>
      <Button size="sm">查看</Button>
    </template>
  </Alert>
</template>
