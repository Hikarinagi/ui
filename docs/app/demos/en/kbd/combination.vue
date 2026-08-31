<script setup lang="ts">
  import { Inline, Kbd, Stack, Text } from '@hikarinagi/ui'
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
      <Text tone="faint">then</Text>
      <Kbd>H</Kbd>
    </Inline>
  </Stack>
</template>
