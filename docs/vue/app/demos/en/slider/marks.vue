<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider } from '@hina-ui/vue'

  const speed = ref(50)
  const marks = [
    { value: 0, label: 'Slow' },
    { value: 25 },
    { value: 50, label: 'Normal' },
    { value: 75 },
    { value: 100, label: 'Fast' },
  ]
</script>

<template>
  <Slider v-model="speed" :step="25" :marks="marks" aria-label="Page turn speed" class="w-64" />
</template>
