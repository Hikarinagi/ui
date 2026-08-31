<script setup lang="ts">
  import { Stack, Text, Time } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      值为 null：
      <Time :value="null" />
    </Text>
    <Text>
      无法解析：
      <Time value="昨天下午" />
    </Text>
  </Stack>
</template>
