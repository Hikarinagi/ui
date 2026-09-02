<script setup lang="ts">
  import { Image } from '@hina-ui/vue'
</script>

<template>
  <Image
    src="/sample.webp"
    alt="夏日午后的坡道"
    :lazy="false"
    eager
    :ratio="16 / 9"
    class="w-full max-w-md rounded-md"
  />
</template>
