<script setup lang="ts">
  import { Inline, Spinner, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Inline gap="md" align="center">
      <Spinner />
      <Spinner class="text-accent" />
      <Spinner class="text-muted" />
    </Inline>
    <Text size="sm" tone="faint">The ring takes the current text colour from its container.</Text>
  </Stack>
</template>
