<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const files = ref<File[]>([])
  const sent = ref<string[]>([])

  function send(next: File | File[] | null) {
    const picked = Array.isArray(next) ? next : next ? [next] : []
    sent.value.push(...picked.map(file => file.name))
    files.value = []
  }
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload
      :model-value="files"
      :list="false"
      multiple
      accept="image/*"
      aria-label="上传图片"
      @update:model-value="send"
    >
      拖拽或者点击，选中即上传
    </FileUpload>
    <Text tone="muted" size="sm">已交给上传流程：{{ sent.length ? sent.join('、') : '无' }}</Text>
  </Stack>
</template>
