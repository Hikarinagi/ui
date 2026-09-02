<script setup lang="ts">
  import { Select, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga', disabled: true },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select invalid :options="options" placeholder="Choose a type" aria-label="Invalid" />
    <Select disabled :options="options" model-value="gal" aria-label="Disabled" />
    <Select :options="[]" placeholder="Nothing to choose" aria-label="Empty list" />
  </Stack>
</template>
