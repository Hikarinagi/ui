<script setup lang="ts">
  import { ImagePlus } from '@lucide/vue'
  import { FileUpload, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="stretch" class="w-96">
    <FileUpload invalid aria-label="校验未通过" />
    <FileUpload disabled aria-label="已禁用" />
    <FileUpload loading aria-label="上传中">上传中</FileUpload>
    <FileUpload aria-label="上传图片" class="aspect-square w-40">
      <template #icon>
        <ImagePlus />
      </template>
      添加图片
    </FileUpload>
  </Stack>
</template>
