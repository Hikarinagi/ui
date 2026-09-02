<script setup lang="ts">
  import { ref } from 'vue'
  import { Upload } from '@lucide/vue'
  import { Button } from '@hina-ui/vue'

  const uploading = ref(false)

  function upload() {
    uploading.value = true
    setTimeout(() => (uploading.value = false), 2000)
  }
</script>

<template>
  <Button :loading="uploading" @click="upload">
    <template #icon>
      <Upload />
    </template>
    {{ uploading ? '上传中…' : '上传文件' }}
  </Button>
</template>
