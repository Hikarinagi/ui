<script setup lang="ts">
  import { ref } from 'vue'
  import { Select } from '@hina-ui/vue'

  const sort = ref('latest')
  const sorts = [
    { value: 'latest', label: 'Recently updated' },
    {
      label: 'By rating',
      options: [
        { value: 'rating-desc', label: 'Rating, high to low' },
        { value: 'rating-asc', label: 'Rating, low to high' },
      ],
    },
    {
      label: 'By release',
      options: [
        { value: 'release-desc', label: 'Newest release' },
        { value: 'release-asc', label: 'Oldest release' },
      ],
    },
  ]
</script>

<template>
  <Select v-model="sort" :options="sorts" aria-label="Sort" class="w-56" />
</template>
