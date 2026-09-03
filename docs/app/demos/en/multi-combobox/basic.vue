<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiCombobox, Stack, Text } from '@hina-ui/vue'

  const genres = ref<Array<string | number>>([])
  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Science fiction' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'daily', label: 'Slice of life' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox
      v-model="genres"
      :options="options"
      placeholder="Type a genre"
      aria-label="Genres"
    />
    <Text tone="muted" size="sm">
      {{ genres.length ? genres.join(', ') : 'Nothing chosen yet' }}
    </Text>
  </Stack>
</template>
