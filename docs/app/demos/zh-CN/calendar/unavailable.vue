<script setup lang="ts">
  import { ref } from 'vue'
  import { Calendar } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
</script>

<template>
  <Calendar v-model="date" :unavailable="weekend" />
</template>
