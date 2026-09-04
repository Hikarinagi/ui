<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangePicker, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-08', end: '2026-09-11' })
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
</script>

<template>
  <DateRangePicker
    v-model="range"
    min="2026-09-01"
    max="2026-09-30"
    :maximum-days="7"
    :unavailable="weekend"
    aria-label="活动期间"
    class="w-96"
  />
</template>
