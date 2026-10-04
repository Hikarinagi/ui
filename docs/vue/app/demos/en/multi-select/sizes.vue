<script setup lang="ts">
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
    { value: 'romance', label: 'Romance' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect size="sm" :options="options" :model-value="['school', 'sf']" aria-label="Small" />
    <MultiSelect size="md" :options="options" :model-value="['school', 'sf']" aria-label="Medium" />
    <MultiSelect size="lg" :options="options" :model-value="['school', 'sf']" aria-label="Large" />
  </Stack>
</template>
