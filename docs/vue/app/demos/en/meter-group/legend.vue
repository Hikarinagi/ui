<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Documents', value: 42 },
    { label: 'Photos', value: 27 },
    { label: 'Videos', value: 13 },
  ]
</script>

<template>
  <MeterGroup label="Storage" :items="items" :legend="false" class="w-96" />
</template>
