<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeCalendar, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-07', end: '2026-09-11' })
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
</script>

<template>
  <RangeCalendar v-model="range" :unavailable="weekend" />
</template>
