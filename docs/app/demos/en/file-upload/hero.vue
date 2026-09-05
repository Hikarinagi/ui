<script setup lang="ts">
  import { ref } from 'vue'
  import { FileUpload } from '@hina-ui/vue'

  const files = ref<File[]>([])
</script>

<template>
  <FileUpload
    v-model="files"
    multiple
    accept="image/*"
    aria-label="Upload screenshots"
    class="w-96"
  />
</template>
