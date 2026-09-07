<script setup lang="ts">
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Read', value: 56 },
    { label: 'Reading', value: 19 },
  ]
</script>

<template>
  <MeterGroup :items="items" class="w-96" />
</template>
