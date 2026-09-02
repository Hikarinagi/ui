<script setup lang="ts">
  import { Stack, Text, VisuallyHidden } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Text>
      Rated 8.9
      <VisuallyHidden>, out of 10</VisuallyHidden>
    </Text>
    <Text size="sm" tone="faint">The added phrase is only read out by screen readers.</Text>
  </Stack>
</template>
