<script setup lang="ts">
  import { Divider, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Text tone="muted" size="sm">A separator by default, announced by screen readers</Text>
    <Divider />
    <Text tone="muted" size="sm">
      With decorative it is only a line, out of the accessibility tree
    </Text>
    <Divider decorative />
  </Stack>
</template>
