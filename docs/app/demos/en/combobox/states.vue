<script setup lang="ts">
  import { Combobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga', disabled: true },
  ]
</script>

<template>
  <Stack class="w-64">
    <Combobox invalid :options="options" placeholder="Choose a type" aria-label="Invalid" />
    <Combobox disabled :options="options" model-value="gal" aria-label="Disabled" />
  </Stack>
</template>
