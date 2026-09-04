<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangePicker, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-04', end: '2026-09-12' })
</script>

<template>
  <DateRangePicker v-model="range" clearable aria-label="活动期间" class="w-96" />
</template>
