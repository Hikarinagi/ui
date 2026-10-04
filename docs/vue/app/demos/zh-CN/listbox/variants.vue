<script setup lang="ts">
  import { Listbox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox :options="options" model-value="a" aria-label="Primary" />
    <Listbox variant="secondary" :options="options" model-value="a" aria-label="Secondary" />
    <Listbox variant="bare" :options="options" model-value="a" aria-label="Bare" />
  </Stack>
</template>
