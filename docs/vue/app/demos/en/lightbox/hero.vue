<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Lightbox, type LightboxItem } from '@hina-ui/vue'

  const open = ref(false)
  const items: LightboxItem[] = [
    { id: 'image-1', src: '/sample.webp', alt: 'A hillside on a summer afternoon' },
  ]
</script>

<template>
  <Button variant="outline" tone="neutral" @click="open = true">Open preview</Button>
  <Lightbox v-model:open="open" :items="items" />
</template>
