<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const sort = ref('updated')
  const options = [
    { value: 'updated', label: 'Recently updated' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title' },
  ]
</script>

<template>
  <RadioGroup v-model="sort" :options="options" orientation="horizontal" aria-label="Sort by" />
</template>
