<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangeField, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-20', end: '2026-09-10' })
</script>

<template>
  <DateRangeField
    v-model="range"
    min="2026-09-01"
    max="2026-09-30"
    placeholder="2026-09-01"
    aria-label="Event period"
    class="w-96"
  />
</template>
