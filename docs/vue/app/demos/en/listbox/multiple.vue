<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox, Stack, Text } from '@hina-ui/vue'

  const tags = ref(['school'])
  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox v-model="tags" :options="options" multiple aria-label="Tags" />
    <Text tone="muted">Chosen: {{ tags.length ? tags.join(', ') : 'none' }}</Text>
  </Stack>
</template>
