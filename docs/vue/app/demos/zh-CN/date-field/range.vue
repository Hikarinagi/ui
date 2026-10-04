<script setup lang="ts">
  import { ref } from 'vue'
  import { DateField } from '@hina-ui/vue'

  const date = ref<string | null>('2026-10-15')
</script>

<template>
  <DateField
    v-model="date"
    min="2026-09-01"
    max="2026-09-30"
    placeholder="2026-09-01"
    aria-label="活动日期"
    class="w-72"
  />
</template>
