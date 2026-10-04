<script setup lang="ts">
  import { Card, MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: 'School' },
    { value: 'sf', label: 'Sci-fi' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect :options="options" placeholder="Directly on the page" aria-label="On the page" />
    <Card>
      <MultiSelect
        variant="secondary"
        :options="options"
        placeholder="Inside a card"
        aria-label="Inside a card"
      />
    </Card>
  </Stack>
</template>
