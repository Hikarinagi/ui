<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>(null)
</script>

<template>
  <Stack class="w-64">
    <TreeSelect
      v-model="region"
      :items="regions"
      placeholder="Choose a region"
      aria-label="Region"
    />
    <Text tone="muted">Current value: {{ region ?? 'none' }}</Text>
  </Stack>
</template>
