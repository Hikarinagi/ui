<script setup lang="ts">
  import { Spoiler, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      Default form:
      <Spoiler>noise cover</Spoiler>
    </Text>
    <Text>
      Fallback form:
      <Spoiler force-fallback>tint and blur</Spoiler>
    </Text>
  </Stack>
</template>
