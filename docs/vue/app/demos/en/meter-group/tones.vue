<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Approved', value: 62, tone: 'success' },
    { label: 'Pending', value: 21, tone: 'warning' },
    { label: 'Returned', value: 9, tone: 'danger' },
  ]
</script>

<template>
  <MeterGroup label="Review results" :items="items" class="w-96" />
</template>
