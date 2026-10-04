<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const file = ref<File | null>(null)
</script>

<template>
  <Stack gap="sm" align="stretch" class="w-96">
    <FileUpload v-model="file" aria-label="Upload cover" />
    <Text tone="muted" size="sm">Value: {{ file?.name ?? 'empty' }}</Text>
  </Stack>
</template>
