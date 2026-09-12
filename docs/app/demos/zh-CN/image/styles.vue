<script setup lang="ts">
  import { Image } from '@hina-ui/vue'
</script>

<template>
  <Image
    src="/sample.webp"
    alt="夏日午后的坡道"
    preview
    class="rounded-md"
    :style="{ width: '240px', height: '160px' }"
    :image-style="{ objectPosition: 'left center' }"
  />
</template>
