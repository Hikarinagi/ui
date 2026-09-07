<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Read', value: 56 },
    { label: 'Reading', value: 19 },
    { label: 'To read', value: 12 },
  ]
</script>

<template>
  <MeterGroup label="This year's books" :items="items" class="w-96" />
</template>
