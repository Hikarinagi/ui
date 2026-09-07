<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Documents', value: 38 },
    { label: 'Photos', value: 24 },
    { label: 'Videos', value: 46 },
  ]

  const format = (value: number) => `${value} GB`
</script>

<template>
  <MeterGroup label="Storage" :items="items" :max="256" :format="format" class="w-96" />
</template>
