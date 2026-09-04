<script setup lang="ts">
  import { ref } from 'vue'
  import { DatePicker } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
</script>

<template>
  <DatePicker v-model="date" clearable aria-label="发布日期" class="w-72" />
</template>
