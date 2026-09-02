<script setup lang="ts">
  import { Alert, Button, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="min-h-48 w-full max-w-xl">
    <Alert tone="success" title="已发布" closable>文章现在对所有人可见。</Alert>
    <Alert tone="danger" title="发布失败">
      服务器暂时无法响应，草稿已保留。
      <template #actions>
        <Button size="sm" variant="soft" tone="danger">重试</Button>
      </template>
    </Alert>
  </Stack>
</template>
