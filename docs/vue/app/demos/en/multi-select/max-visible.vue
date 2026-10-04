<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const tags = ref(['school', 'sf', 'romance', 'mystery'])
  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'fantasy', label: 'Fantasy' },
  ]
</script>

<template>
  <Stack class="w-96">
    <MultiSelect v-model="tags" :options="options" :max-visible="1" aria-label="At most one" />
    <MultiSelect v-model="tags" :options="options" :max-visible="3" aria-label="At most three" />
  </Stack>
</template>
