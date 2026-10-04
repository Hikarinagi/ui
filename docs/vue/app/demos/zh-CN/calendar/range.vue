<script setup lang="ts">
  import { ref } from 'vue'
  import { Calendar } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-10')
</script>

<template>
  <Calendar v-model="date" min="2026-09-07" max="2026-09-25" />
</template>
