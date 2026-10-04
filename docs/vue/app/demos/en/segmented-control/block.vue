<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const range = ref('week')
  const options = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: 'all', label: 'All time' },
  ]
</script>

<template>
  <SegmentedControl v-model="range" :options="options" block aria-label="Range" class="max-w-md" />
</template>
