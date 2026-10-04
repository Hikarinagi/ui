<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const file = ref<File | null>(null)
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload v-model="file" aria-label="上传封面" />
    <Text tone="muted" size="sm">值：{{ file?.name ?? '空' }}</Text>
  </Stack>
</template>
