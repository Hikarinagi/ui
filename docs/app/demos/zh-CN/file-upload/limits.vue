<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text, type FileUploadRejection } from '@hina-ui/vue'

  const files = ref<File[]>([])
  const notice = ref('')

  const reasons: Record<FileUploadRejection['reason'], string> = {
    type: '不是图片',
    size: '超过 2 MB',
    count: '超过 3 个',
  }

  function onReject(rejections: FileUploadRejection[]) {
    notice.value = rejections.map(r => `${r.file.name}：${reasons[r.reason]}`).join('；')
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
      aria-label="上传图片"
      @reject="onReject"
    >
      最多 3 张图片，每张不超过 2 MB
    </FileUpload>
    <Text v-if="notice" tone="danger" size="sm">{{ notice }}</Text>
  </Stack>
</template>
