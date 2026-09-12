<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, Image, Lightbox, type LightboxItem } from '@hina-ui/vue'

  const open = ref(false)
  const source = shallowRef<HTMLImageElement | null>(null)
  const items: LightboxItem[] = [
    {
      id: 'image-1',
      src: '/sample.webp',
      alt: 'A hillside on a summer afternoon',
      fit: 'cover',
      source: () => source.value,
    },
  ]

  function show(event: MouseEvent) {
    source.value = (event.currentTarget as HTMLElement).querySelector('img')
    open.value = true
  }
</script>

<template>
  <Button
    variant="ghost"
    tone="neutral"
    :ripple="false"
    aria-label="Open image preview"
    class="h-auto w-64 cursor-zoom-in overflow-hidden rounded-xl p-0"
    @click="show"
  >
    <Image
      src="/sample.webp"
      alt="A hillside on a summer afternoon"
      :ratio="16 / 9"
      :lazy="false"
      class="w-64"
    />
  </Button>
  <Lightbox v-model:open="open" :items="items" />
</template>
