<script setup lang="ts">
  import { Image } from '@hikarinagi/ui'
</script>

<template>
  <Image
    src="/missing.webp"
    fallback="/sample.webp"
    alt="夏日午后的坡道"
    :ratio="16 / 9"
    class="w-full max-w-md rounded-md"
  />
</template>
