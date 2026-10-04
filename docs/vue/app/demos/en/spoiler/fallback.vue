<script setup lang="ts">
  import { Spoiler, Stack, Text } from '@hina-ui/vue'
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
