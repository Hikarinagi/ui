<script setup lang="ts">
  import { Banner } from '@hina-ui/vue'

  const notices = [
    { text: '86 new reviews this week, 1,204 active readers.' },
    { text: 'The most popular title this week is Spice and Wolf.' },
    { text: 'Shelves can now be filtered by tag.' },
  ]
</script>

<template>
  <Banner :items="notices" :autoplay="4000" tone="info">
    <template #item="{ item }">{{ item.text }}</template>
  </Banner>
</template>
