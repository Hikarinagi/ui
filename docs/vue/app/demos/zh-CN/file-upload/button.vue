<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload } from '@hina-ui/vue'

  const file = ref<File | null>(null)
</script>

<template>
  <FileUpload v-model="file" variant="button" accept=".pdf" aria-label="上传合同" class="w-96" />
</template>
