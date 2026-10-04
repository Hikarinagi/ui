<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const files = ref<File[]>([])
</script>

<template>
  <Stack gap="sm" class="w-[300px]">
    <Text size="sm" weight="medium">{{ t('landing.wall.upload.label') }}</Text>
    <FileUpload
      v-model="files"
      multiple
      accept="image/*"
      :aria-label="t('landing.wall.upload.label')"
    />
  </Stack>
</template>
