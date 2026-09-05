<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text, type FileUploadRejection } from '@hina-ui/vue'

  const files = ref<File[]>([])
  const notice = ref('')

  const reasons: Record<FileUploadRejection['reason'], string> = {
    type: 'not an image',
    size: 'over 2 MB',
    count: 'more than 3 files',
  }

  function onReject(rejections: FileUploadRejection[]) {
    notice.value = rejections.map(r => `${r.file.name}: ${reasons[r.reason]}`).join('; ')
  }
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload
      v-model="files"
      multiple
      accept="image/*"
      :max-size="2 * 1024 * 1024"
      :max-files="3"
      aria-label="Upload images"
      @reject="onReject"
    >
      Up to 3 images, 2 MB each
    </FileUpload>
    <Text v-if="notice" tone="danger" size="sm">{{ notice }}</Text>
  </Stack>
</template>
