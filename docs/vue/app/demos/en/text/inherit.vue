<script setup lang="ts">
  import { Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Text size="sm">
      sm parent text,
      <Text as="span" size="inherit" tone="accent">inherited size and line height</Text>
      .
    </Text>
    <Text size="base">
      base parent text,
      <Text as="span" size="inherit" tone="accent">inherited size and line height</Text>
      .
    </Text>
    <Text size="xl">
      xl parent text,
      <Text as="span" size="inherit" tone="accent">inherited size and line height</Text>
      .
    </Text>
  </Stack>
</template>
