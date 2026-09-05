<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const files = ref<File[]>([])
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload v-model="files" multiple aria-label="Upload attachments" />
    <Text tone="muted" size="sm">{{ files.length }} files chosen</Text>
  </Stack>
</template>
