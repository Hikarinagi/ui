<script setup lang="ts">
  import { ref } from 'vue'
  import { Select } from '@hina-ui/vue'

  const type = ref('gal')
  const types = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga' },
    { value: 'anime', label: 'Anime' },
  ]
</script>

<template>
  <Select v-model="type" :options="types" aria-label="Work type" class="w-64" />
</template>
