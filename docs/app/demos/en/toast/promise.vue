<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'

  function upload() {
    const task = new Promise<{ name: string }>(resolve =>
      setTimeout(() => resolve({ name: 'beyond-the-stars.epub' }), 2000),
    )
    toast.promise(task, {
      loading: 'Uploading',
      success: book => `${book.name} uploaded`,
      error: 'Upload failed, please try again',
    })
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="upload">Upload a file</Button>
</template>
