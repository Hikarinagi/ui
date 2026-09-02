<script setup lang="ts">
  import { Inline, Kbd, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack>
    <Inline align="center" gap="xs">
      <Kbd>Ctrl</Kbd>
      <Text tone="faint">+</Text>
      <Kbd>Shift</Kbd>
      <Text tone="faint">+</Text>
      <Kbd>P</Kbd>
    </Inline>
    <Inline align="center" gap="xs">
      <Kbd>G</Kbd>
      <Text tone="faint">随后</Text>
      <Kbd>H</Kbd>
    </Inline>
  </Stack>
</template>
