<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { Button, Lightbox, type LightboxItem } from '@hina-ui/vue'

  const open = ref(false)
  const target = shallowRef<HTMLElement>()
  const items: LightboxItem[] = [
    {
      id: 'image-1',
      src: '/sample.webp',
      alt: '夏日午后的坡道',
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
    aria-label="预览背景图片"
    class="h-36 w-64 cursor-zoom-in rounded-none bg-cover bg-center p-0"
    :style="{ backgroundImage: 'url(/sample.webp)' }"
    @click="show"
  />
  <Lightbox v-model:open="open" :items="items" />
</template>
