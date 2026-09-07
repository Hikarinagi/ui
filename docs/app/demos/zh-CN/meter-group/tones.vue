<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: '通过', value: 62, tone: 'success' },
    { label: '待定', value: 21, tone: 'warning' },
    { label: '退回', value: 9, tone: 'danger' },
  ]
</script>

<template>
  <MeterGroup label="审核结果" :items="items" class="w-96" />
</template>
