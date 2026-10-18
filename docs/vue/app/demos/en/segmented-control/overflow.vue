<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const sort = ref('relevance')
  const options = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'updated', label: 'Recently updated' },
    { value: 'favorites', label: 'Most favorited' },
    { value: 'comments', label: 'Most comments' },
    { value: 'words', label: 'Longest' },
    { value: 'rating', label: 'Top rated' },
  ]
</script>

<template>
  <SegmentedControl v-model="sort" :options="options" class="max-w-xs" aria-label="Sort by" />
</template>
