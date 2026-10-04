<script setup lang="ts">
  import { Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>Renders a p element by default.</Text>
    <Text as="span" tone="muted">Setting as to span keeps it inline.</Text>
    <Text as="div" size="sm">It can also be a div.</Text>
  </Stack>
</template>
