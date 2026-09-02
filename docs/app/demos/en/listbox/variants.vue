<script setup lang="ts">
  import { Card, Listbox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox :options="options" model-value="gal" aria-label="On the page" />
    <Card>
      <Listbox
        variant="secondary"
        :options="options"
        model-value="gal"
        aria-label="Inside a card"
      />
    </Card>
  </Stack>
</template>
