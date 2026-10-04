<script setup lang="ts">
  import { Spoiler, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      默认形态：
      <Spoiler>噪点遮罩</Spoiler>
    </Text>
    <Text>
      降级形态：
      <Spoiler force-fallback>底色加模糊</Spoiler>
    </Text>
  </Stack>
</template>
