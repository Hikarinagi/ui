<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox, Stack, Text } from '@hina-ui/vue'

  const type = ref<string | null>(null)
  const types = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga' },
    { value: 'anime', label: 'Anime' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox v-model="type" :options="types" aria-label="Work type" />
    <Text tone="muted">Current value: {{ type ?? 'none' }}</Text>
  </Stack>
</template>
