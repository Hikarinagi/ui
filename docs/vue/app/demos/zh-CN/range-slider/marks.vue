<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider } from '@hina-ui/vue'

  const range = ref<[number, number]>([25, 75])
  const marks = [
    { value: 0, label: '0' },
    { value: 25 },
    { value: 50, label: '50' },
    { value: 75 },
    { value: 100, label: '100' },
  ]
</script>

<template>
  <RangeSlider v-model="range" :step="25" :marks="marks" aria-label="区间" class="w-64" />
</template>
