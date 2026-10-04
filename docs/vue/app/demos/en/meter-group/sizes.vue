<script setup lang="ts">
  import { MeterGroup, Stack, type MeterItem } from '@hina-ui/vue'

  const items: MeterItem[] = [
    { label: 'Read', value: 56 },
    { label: 'Reading', value: 19 },
  ]
</script>

<template>
  <Stack gap="lg" class="w-96">
    <MeterGroup :items="items" size="sm" :legend="false" />
    <MeterGroup :items="items" :legend="false" />
    <MeterGroup :items="items" size="lg" :legend="false" />
  </Stack>
</template>
