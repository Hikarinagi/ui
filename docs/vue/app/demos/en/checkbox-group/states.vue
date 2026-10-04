<script setup lang="ts">
  import { CheckboxGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
    { value: 'manga', label: 'Manga', disabled: true },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <CheckboxGroup :options="options" :model-value="['gal']" aria-label="With a disabled option" />
    <CheckboxGroup disabled :options="options" :model-value="['gal']" aria-label="Disabled group" />
    <CheckboxGroup invalid :options="options" :model-value="[]" aria-label="Invalid" />
  </Inline>
</template>
