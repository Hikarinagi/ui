<script setup lang="ts">
  import { Avatar, Inline, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="start" class="gap-8">
    <Stack gap="xs" align="center">
      <Avatar name="Shion Hoshimi" />
      <Text tone="muted" size="sm">Two initials</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar name="星见书音" />
      <Text tone="muted" size="sm">One character for CJK</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar />
      <Text tone="muted" size="sm">An icon without a name</Text>
    </Stack>
    <Stack gap="xs" align="center">
      <Avatar src="/missing.png" name="Shion Hoshimi" />
      <Text tone="muted" size="sm">The image failed to load</Text>
    </Stack>
  </Inline>
</template>
