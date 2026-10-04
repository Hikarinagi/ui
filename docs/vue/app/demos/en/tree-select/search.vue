<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>(null)
  const search = ref('')
</script>

<template>
  <Stack class="w-64">
    <TreeSelect
      v-model="region"
      v-model:search="search"
      :items="regions"
      searchable
      search-placeholder="Search nodes"
      aria-label="Region"
    />
    <Text tone="muted">Value: {{ region ?? 'None' }}</Text>
    <Text tone="muted">Search: {{ search || 'None' }}</Text>
  </Stack>
</template>
