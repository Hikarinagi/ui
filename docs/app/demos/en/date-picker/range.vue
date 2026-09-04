<script setup lang="ts">
  import { ref } from 'vue'
  import { DatePicker } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-10')
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
</script>

<template>
  <DatePicker
    v-model="date"
    min="2026-09-01"
    max="2026-09-30"
    :unavailable="weekend"
    aria-label="Event date"
    class="w-72"
  />
</template>
