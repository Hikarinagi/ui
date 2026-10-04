<script setup lang="ts">
  import { ImagePlus } from '@lucide/vue'
  import { FileUpload, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="stretch" class="w-96">
    <FileUpload invalid aria-label="Invalid" />
    <FileUpload disabled aria-label="Disabled" />
    <FileUpload loading aria-label="Uploading">Uploading</FileUpload>
    <FileUpload aria-label="Add image" class="aspect-square w-40">
      <template #icon>
        <ImagePlus />
      </template>
      Add image
    </FileUpload>
  </Stack>
</template>
