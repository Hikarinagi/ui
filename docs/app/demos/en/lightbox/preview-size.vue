<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, Image, Lightbox, type LightboxItem } from '@hina-ui/vue'

  const open = ref(false)
  const target = shallowRef<HTMLElement>()
  const image = {
    thumbnail: '/sample-thumbnail.webp',
    original: '/sample.webp',
    width: 1200,
    height: 675,
  }
  const items: LightboxItem[] = [
    {
      id: 'image-1',
      src: image.thumbnail,
      preview: image.original,
      previewSize: { width: image.width, height: image.height },
      alt: 'A hillside on a summer afternoon',
      source: () => (target.value?.isConnected ? target.value.getBoundingClientRect() : undefined),
    },
  ]

  function show(event: MouseEvent) {
    target.value = event.currentTarget as HTMLElement
    open.value = true
  }
</script>

<template>
  <Button
    variant="ghost"
    tone="neutral"
    :ripple="false"
    aria-label="Preview image"
    class="h-auto w-64 cursor-zoom-in rounded-none border-0 p-0"
    @click="show"
  >
    <Image
      :src="image.thumbnail"
      alt="A hillside on a summer afternoon"
      :ratio="16 / 9"
      :lazy="false"
      class="w-64"
    />
  </Button>
  <Lightbox v-model:open="open" :items="items" />
</template>
