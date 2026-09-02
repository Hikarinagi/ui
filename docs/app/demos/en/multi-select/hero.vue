<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect } from '@hina-ui/vue'

  const tags = ref(['school', 'sf'])
  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'fantasy', label: 'Fantasy' },
  ]
</script>

<template>
  <MultiSelect v-model="tags" :options="options" aria-label="Tags" class="w-72" />
</template>
