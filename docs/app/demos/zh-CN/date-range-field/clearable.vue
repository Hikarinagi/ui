<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangeField, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-01', end: '2026-09-30' })
</script>

<template>
  <DateRangeField v-model="range" clearable aria-label="活动期间" class="w-96" />
</template>
