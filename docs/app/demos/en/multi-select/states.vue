<script setup lang="ts">
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
    { value: 'romance', label: 'Romance' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect
      invalid
      :options="options"
      placeholder="Choose at least one tag"
      aria-label="Invalid"
    />
    <MultiSelect disabled :options="options" :model-value="['school']" aria-label="Disabled" />
  </Stack>
</template>
