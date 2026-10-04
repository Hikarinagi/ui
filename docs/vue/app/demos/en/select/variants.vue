<script setup lang="ts">
  import { Card, Select, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select :options="options" placeholder="Directly on the page" aria-label="On the page" />
    <Card>
      <Select
        variant="secondary"
        :options="options"
        placeholder="Inside a card"
        aria-label="Inside a card"
      />
    </Card>
  </Stack>
</template>
