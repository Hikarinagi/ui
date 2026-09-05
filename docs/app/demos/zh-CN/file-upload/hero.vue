<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload } from '@hina-ui/vue'

  const files = ref<File[]>([])
</script>

<template>
  <FileUpload v-model="files" multiple accept="image/*" aria-label="上传截图" class="w-96" />
</template>
