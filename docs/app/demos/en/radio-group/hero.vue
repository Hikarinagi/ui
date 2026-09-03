<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const status = ref('doing')
  const options = [
    { value: 'wish', label: 'Want to read' },
    { value: 'doing', label: 'Reading' },
    { value: 'done', label: 'Finished' },
  ]
</script>

<template>
  <RadioGroup v-model="status" :options="options" aria-label="Library status" />
</template>
