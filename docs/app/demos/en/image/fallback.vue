<script setup lang="ts">
  import { Image } from '@hikarinagi/ui'
</script>

<template>
  <Image
    src="/missing.webp"
    fallback="/sample.webp"
    alt="A slope on a summer afternoon"
    :ratio="16 / 9"
    class="w-full max-w-md rounded-md"
  />
</template>
