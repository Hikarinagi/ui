<script setup lang="ts">
  import { Checkbox, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Checkbox size="sm" model-value>小号</Checkbox>
    <Checkbox size="md" model-value>中号</Checkbox>
    <Checkbox size="lg" model-value>大号</Checkbox>
  </Stack>
</template>
