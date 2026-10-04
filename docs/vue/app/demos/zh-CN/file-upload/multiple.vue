<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const files = ref<File[]>([])
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload v-model="files" multiple aria-label="上传附件" />
    <Text tone="muted" size="sm">已选 {{ files.length }} 个文件</Text>
  </Stack>
</template>
