<script setup lang="ts">
  import { Inline, Spinner, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm" align="center">
    <Spinner size="sm" label="Submitting your rating" />
    <Text size="sm" tone="muted">Submitting your rating…</Text>
  </Inline>
</template>
