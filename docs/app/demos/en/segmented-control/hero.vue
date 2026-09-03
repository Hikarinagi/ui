<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl } from '@hina-ui/vue'

  const status = ref('all')
  const options = [
    { value: 'all', label: 'All' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'done', label: 'Completed' },
  ]
</script>

<template>
  <SegmentedControl v-model="status" :options="options" aria-label="Status" />
</template>
