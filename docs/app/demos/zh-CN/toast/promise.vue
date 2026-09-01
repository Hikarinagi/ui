<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'

  function upload() {
    const task = new Promise<{ name: string }>(resolve =>
      setTimeout(() => resolve({ name: '星之彼方.epub' }), 2000),
    )
    toast.promise(task, {
      loading: '正在上传',
      success: book => `${book.name} 上传完成`,
      error: '上传失败，请重试',
    })
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="upload">上传文件</Button>
</template>
