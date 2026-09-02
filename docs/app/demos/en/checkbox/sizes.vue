<script setup lang="ts">
  import { Checkbox, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Checkbox size="sm" model-value>Small</Checkbox>
    <Checkbox size="md" model-value>Medium</Checkbox>
    <Checkbox size="lg" model-value>Large</Checkbox>
  </Stack>
</template>
