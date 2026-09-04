<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeCalendar, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-10', end: '2026-09-14' })
</script>

<template>
  <RangeCalendar v-model="range" min="2026-09-07" max="2026-09-25" :maximum-days="7" />
</template>
