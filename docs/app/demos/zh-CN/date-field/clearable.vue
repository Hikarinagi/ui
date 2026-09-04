<script setup lang="ts">
  import { ref } from 'vue'
  import { DateField } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
</script>

<template>
  <DateField v-model="date" clearable aria-label="发布日期" class="w-72" />
</template>
