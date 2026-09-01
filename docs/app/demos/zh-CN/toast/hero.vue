<script setup lang="ts">
  import { Button, Inline, toast } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-3">
    <Button variant="outline" tone="neutral" @click="toast('草稿已保存')">默认</Button>
    <Button variant="outline" tone="neutral" @click="toast.success('文章已发布')">成功</Button>
    <Button
      variant="outline"
      tone="neutral"
      @click="toast.danger('上传失败', { description: '文件超过 20 MB。' })"
    >
      失败
    </Button>
  </Inline>
</template>
