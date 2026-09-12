<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Lightbox, type LightboxItem } from '@hina-ui/vue'

  const open = ref(false)
  const items: LightboxItem[] = [{ id: 'image-1', src: '/sample.webp', alt: '夏日午后的坡道' }]
</script>

<template>
  <Button variant="outline" tone="neutral" @click="open = true">打开预览</Button>
  <Lightbox v-model:open="open" :items="items" />
</template>
