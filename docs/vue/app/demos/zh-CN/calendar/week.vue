<script setup lang="ts">
  import { ref } from 'vue'
  import { Calendar } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
</script>

<template>
  <Calendar v-model="date" :week-starts-on="0" weekday-format="short" />
</template>
