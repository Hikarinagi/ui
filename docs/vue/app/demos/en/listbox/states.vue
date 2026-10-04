<script setup lang="ts">
  import { Listbox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga', disabled: true },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox :options="options" model-value="gal" aria-label="With a disabled option" />
    <Listbox disabled :options="options" model-value="gal" aria-label="Disabled" />
  </Stack>
</template>
