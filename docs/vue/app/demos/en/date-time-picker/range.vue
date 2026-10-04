<script setup lang="ts">
  import { ref } from 'vue'
  import { DateTimePicker } from '@hina-ui/vue'

  const at = ref<string | null>('2026-09-10T20:00')
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
</script>

<template>
  <DateTimePicker
    v-model="at"
    min="2026-09-01T00:00"
    max="2026-09-30T23:59"
    :minute-step="15"
    :unavailable="weekend"
    aria-label="Event time"
    class="w-80"
  />
</template>
