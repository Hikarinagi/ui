<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: '已读', value: 56 },
    { label: '在读', value: 19 },
    { label: '想读', value: 12 },
  ]
</script>

<template>
  <MeterGroup label="今年的书" :items="items" class="w-96" />
</template>
