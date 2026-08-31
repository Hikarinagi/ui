<script setup lang="ts">
  import { Kbd, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      按
      <Kbd>Enter</Kbd>
      提交，按
      <Kbd>Esc</Kbd>
      取消。
    </Text>
    <Text size="sm">
      小字号中的
      <Kbd>Enter</Kbd>
      会一同缩小。
    </Text>
  </Stack>
</template>
