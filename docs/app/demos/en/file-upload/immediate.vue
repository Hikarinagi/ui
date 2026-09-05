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
      aria-label="Upload images"
      @update:model-value="send"
    >
      Drop or click, uploads on pick
    </FileUpload>
    <Text tone="muted" size="sm">
      Handed to the upload flow: {{ sent.length ? sent.join(', ') : 'none' }}
    </Text>
  </Stack>
</template>
